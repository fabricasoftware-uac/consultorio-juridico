"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Upload, Download, Trash2, File, Image as ImageIcon, FileSpreadsheet, FileArchive, Archive, Eye, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabase-client";

type Documento = {
  id: number;
  id_caso: number;
  id_usuario: string;
  storage_path: string;
  nombre_original: string;
  mime_type: string;
  tamano: number;
  estado?: string;
  estado_doc?: string;
  created_at: string;
  signed_url?: string | null;
};

const ICON_MIME: Record<string, { icon: typeof File; color: string }> = {
  "application/pdf": { icon: FileText, color: "text-red-500" },
  "image/": { icon: ImageIcon, color: "text-blue-500" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { icon: FileSpreadsheet, color: "text-green-500" },
  "application/vnd.ms-excel": { icon: FileSpreadsheet, color: "text-green-500" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { icon: FileText, color: "text-blue-600" },
  "application/msword": { icon: FileText, color: "text-blue-600" },
  "application/zip": { icon: FileArchive, color: "text-amber-500" },
};

function getIcon(mime: string) {
  const match = Object.entries(ICON_MIME).find(([k]) => mime.startsWith(k));
  return match?.[1] ?? { icon: File, color: "text-slate-500" };
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

interface Props {
  idCaso: string;
}

async function api(path: string, options?: RequestInit) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return null;
  const res = await fetch(path, {
    ...options,
    headers: { Authorization: `Bearer ${session.access_token}`, ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Error" }));
    toast.error(err.error || "Error");
    return null;
  }
  return res.json();
}

export function DocumentosCaso({ idCaso }: Props) {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [role, setRole] = useState("");
  const [preview, setPreview] = useState<Documento | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        const payload = JSON.parse(atob(session.access_token.split(".")[1]));
        setRole(payload.user_role ?? "");
      }
      cargar();
    });
  }, [idCaso]);

  const cargar = async () => {
    const data = await api(`/api/documentos?id_caso=${idCaso}`);
    if (data) setDocumentos(data.documentos ?? []);
    setLoading(false);
  };

  useEffect(() => { cargar(); }, [idCaso]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    const form = new FormData();
    form.append("file", file);
    form.append("id_caso", idCaso);
    const data = await api("/api/documentos", { method: "POST", body: form });
    if (data?.documento) {
      toast.success(`"${file.name}" subido`);
      cargar();
    }
    setSubiendo(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (doc: Documento) => {
    const data = await api(`/api/documentos/${doc.id}`, { method: "DELETE" });
    if (data?.success) {
      toast.success("Documento eliminado");
      cargar();
    }
  };

  const handleArchivar = async (doc: Documento) => {
    const nuevoEstado = doc.estado === "archivado" ? "activo" : "archivado";
    const data = await api(`/api/documentos/${doc.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    if (data?.success) {
      toast.success(nuevoEstado === "archivado" ? "Documento archivado" : "Documento restaurado");
      cargar();
    }
  };

  const handleAprobarDoc = async (doc: Documento, estado: "aprobado" | "rechazado") => {
    const data = await api(`/api/documentos/${doc.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado_doc: estado }),
    });
    if (data?.success) {
      toast.success(estado === "aprobado" ? "Documento aprobado" : "Documento rechazado");
      cargar();
    }
  };

  const handleDownload = (doc: Documento) => {
    if (doc.signed_url) window.open(doc.signed_url, "_blank");
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-sm text-slate-400">Cargando...</div>
    );
  }

  return (
    <>
    <div className="space-y-3">
      {documentos.length === 0 ? (
        <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <File className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No hay documentos aún</p>
        </div>
      ) : (
        documentos.map((doc) => {
          const { icon: Icon, color } = getIcon(doc.mime_type);
          return (
            <div key={doc.id} className={`flex items-center gap-3 p-3 rounded-xl border shadow-sm group transition-opacity ${doc.estado === "archivado" ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-slate-100"}`}>
              <Icon className={`w-5 h-5 ${color} shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-700 truncate">{doc.nombre_original}</p>
                  {doc.estado_doc === "aprobado" ? (
                    <Badge variant="outline" className="text-[10px] text-green-700 bg-green-50 border-green-200 h-4 px-1">Aprobado</Badge>
                  ) : doc.estado_doc === "rechazado" ? (
                    <Badge variant="outline" className="text-[10px] text-red-700 bg-red-50 border-red-200 h-4 px-1">Rechazado</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-amber-700 bg-amber-50 border-amber-200 h-4 px-1">Pendiente</Badge>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">{formatSize(doc.tamano)} {doc.estado === "archivado" && "· Archivado"}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPreview(doc)} title="Vista previa">
                  <Eye className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDownload(doc)} title="Descargar">
                  <Download className="w-3.5 h-3.5" />
                </Button>
                {(role === "asesor" || role === "pro_apoyo" || role === "admin") && doc.estado_doc !== "aprobado" && (
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleAprobarDoc(doc, "aprobado")} title="Aprobar">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  </Button>
                )}
                {(role === "asesor" || role === "pro_apoyo" || role === "admin") && doc.estado_doc !== "rechazado" && (
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleAprobarDoc(doc, "rechazado")} title="Rechazar">
                    <XCircle className="w-3.5 h-3.5 text-red-500" />
                  </Button>
                )}
                {(role === "asesor" || role === "pro_apoyo" || role === "admin") && (
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleArchivar(doc)} title={doc.estado === "archivado" ? "Restaurar" : "Archivar"}>
                    <Archive className="w-3.5 h-3.5" />
                  </Button>
                )}
                {(role === "admin" || role === "pro_apoyo") && (
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={() => handleDelete(doc)} title="Eliminar">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          );
        })
      )}

      <div className="pt-2">
        <input ref={fileRef} type="file" onChange={handleUpload} className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
        />
        <Button
          variant="outline"
          onClick={() => fileRef.current?.click()}
          disabled={subiendo}
          className="w-full border-dashed"
        >
          <Upload className="w-4 h-4 mr-2" />
          {subiendo ? "Subiendo..." : "Subir documento"}
        </Button>
      </div>
    </div>

    <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-base truncate">{preview?.nombre_original}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center min-h-[200px]">
          {preview?.mime_type?.startsWith("image/") && preview?.signed_url && (
            <Image
              src={preview.signed_url}
              alt={preview.nombre_original}
              width={1200}
              height={900}
              unoptimized
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          )}
          {preview?.mime_type === "application/pdf" && preview?.signed_url && (
            <iframe src={preview.signed_url} className="w-full h-[70vh] rounded-lg" title="PDF" />
          )}
          {preview && !preview.mime_type?.startsWith("image/") && preview.mime_type !== "application/pdf" && (
            <p className="text-slate-400 text-sm">Vista previa no disponible para este tipo de archivo.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
