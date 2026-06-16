ALTER TABLE public.auditoria_casos
  ADD CONSTRAINT fk_auditoria_usuario
  FOREIGN KEY (id_usuario) REFERENCES public.perfiles(id) ON DELETE SET NULL;
