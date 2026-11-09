import Image from "next/image";

type LogoProps = {
  className?: string;
  variant?: "default" | "purple";
};

export function Logo({ className = '', variant = "default" }: LogoProps) {
  const bgClass =
    variant === "purple"
      ? "bg-purple-700 shadow-purple-500/20"
      : "bg-linear-to-br from-blue-600 to-blue-700 shadow-blue-500/25";

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl shadow-xl overflow-hidden ${bgClass} ${className}`}
    >
      <Image
        loading="eager"
        src="/logo_uniautonoma_blanco.svg"
        alt="Logo"
        fill
        className="object-contain p-2"
      />
    </div>
  );
}
