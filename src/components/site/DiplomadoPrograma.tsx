import { diplomadoData } from "@/data/diplomado";
import { ModuloBannerCard } from "@/components/site/ModuloBannerCard";

const P = diplomadoData.programa;

/** Sección completa del documento editorial del programa. */
export function DiplomadoPrograma() {
  return (
    <div className="space-y-0">
      {P.modulos.map((modulo) => (
        <ModuloBannerCard key={modulo.moduloTag} modulo={modulo} />
      ))}
    </div>
  );
}
