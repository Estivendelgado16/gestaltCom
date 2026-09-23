export function Logo({
  className = "",
  tone = "ink",
  img,
  size = 44,
}: {
  className?: string;
  tone?: "ink" | "cream";
  img?: string;
  size?: number;
}) {
  const src = img ?? (tone === "cream" ? "/img/logo2.png" : "/img/logo1.png");
  return (
    <img
      src={src}
      alt="Comunidad Gestáltica — Estudios de Gestalt de Campo"
      style={{ height: size, width: "auto", alignSelf: "flex-start" }}
      className={className}
    />
  );
}
