import { University } from "lucide-react";

/**
 * Docentes del Diplomado Internacional en Terapia Gestalt de Campo.
 *
 * Datos centralizados (nombre, país, descripción, foto y bandera) que
 * alimentan el carrusel de la sección "Docentes" de /diplomado.
 */
export type Docente = {
  nombre: string;
  pais: string;
  descripcion: string;
  foto: string;
  bandera: string;
  /** Varias banderas (p. ej. doble nacionalidad); si está presente reemplaza a `bandera`. */
  banderas?: readonly string[];
};

export const docentes: Docente[] = [
  {
    nombre: "Jean-Marie Delacroix",
    pais: "Francia",
    descripcion:
      "Psicólogo clínico, Terapeuta Gestalt de Canadá, con más de 50 años de trayectoria dedicados a la psicoterapia, la formación y la supervisión en diversos países del mundo. Es autor de varios libros.",
    foto: "/img/Jean-MarieDelacroix.jpg",
    bandera: "/img/bandera-francia.png",
  },
  {
    nombre: "Michele Cannavò",
    pais: "Italia",
    descripcion:
      "Psiquiatra, PhD en Medicina Neurovegetativa y psicoterapeuta gestáltico. Docente universitario en la UniCT",
    foto: "/img/MicheleCannavò.jpeg",
    bandera: "/img/bandera-italia.png",
  },
  {
    nombre: "Sergio La Rosa",
    pais: "Argentina · Italia",
    descripcion:
      "Macrobiólogo, formado como psicoanalista en la Tercera Escuela Vienesa de Psicoterapia. Es miembro del Instituto de Terapia Gestalt de Nueva York.",
    foto: "/img/SergioLaRosa.jpeg",
    bandera: "/img/bandera-italia.png",
    banderas: ["/img/bandera-argentina.png", "/img/bandera-italia.png"],
  },
  {
    nombre: "Marcos José Müller",
    pais: "Brasil",
    descripcion:
      "Gestalt-analista, Escritor, Filósofo, Psicólogo clínico y catedrático en Ontología y Clínica. Es autor de varias obras.",
    foto: "/img/MarcosMuller.png",
    bandera: "/img/brasil.png",
  },
  {
    nombre: "Julio Polanco Ocampo",
    pais: "México",
    descripcion:
      "Psicólogo, Magíster en Psicoterapia Gestalt y especialista en psicopatología. Coordinador académico y docente de la Maestría en Psicoterapia Gestalt de Casa Gestalt Mérida.",
    foto: "/img/JulioPolancoOcampo.jpg",
    bandera: "/img/bandera-mexico.png",
  },
  {
    nombre: "Guennadi Búrquez",
    pais: "México",
    descripcion:
      "Licenciado en Filosofía y Maestro en Psicoterapia Humanista. Docente, investigador y conferencista en temas que abarcan la filosofía, la fenomenología hermenéutica y la Terapia Gestalt de campo.",
    foto: "/img/GuennadiBurquez.png",
    bandera: "/img/bandera-mexico.png",
  },
  {
    nombre: "José Miguel Echarte",
    pais: "Argentina",
    descripcion:
      "Profesor de Filosofía y Psicólogo. Especialista en Psicoterapia y Psicopatología Gestáltica. Docente, supervisor y formador en Terapia Gestalt de campo.",
    foto: "/img/JoseMiguelEcharte.jpeg",
    bandera: "/img/bandera-argentina.png",
  },
  {
    nombre: "Dany Rafael Mora Bracho",
    pais: "Venezuela · Colombia",
    descripcion:
      "Psicólogo, magíster en Orientación. Terapeuta Gestáltico con formación en psicopatología. Fundador de Comunidad Gestáltica: Estudios de Gestalt de Campo.",
    foto: "/img/DanyMora.jpg",
    bandera: "/img/bandera-venezuela.png",
    banderas: ["/img/bandera-venezuela.png", "/img/bandera-colombia.png"],
  },
  {
    nombre: "Luis Javier Tobón",
    pais: "Colombia",
    descripcion:
      "Licenciado en Filosofía y Ciencias Religiosas, Psicólogo, Especialista en Pedagogía, Doctor en Psicología. Docente e investigador. Miembro ALPE.",
    foto: "/img/LuisJavierTobon.jpeg",
    bandera: "/img/bandera-colombia.png",
  },
  {
    nombre: "Ricardo García Jiménez",
    pais: "Chile",
    descripcion:
      "Psicólogo clínico, Magíster en Teoría y Práctica de la Psicoterapia Gestáltica. Especialista en Psicoterapia y Psicología Clínica Fenomenológico-Existencial. Formación en psicopatología.",
    foto: "/img/RicardoGarcia.jpeg",
    bandera: "/img/chile.png",
  },
  {
    nombre: "Daniel Echavarría",
    pais: "Colombia",
    descripcion:
      "Psicólogo, magíster en Psicología Clínica y Salud Mental, especialista en Psicología Sanitaria, con estudios en filosofía y terapia existencial.",
    foto: "/img/DanielEchavarria.jpeg",
    bandera: "/img/bandera-colombia.png",
  },
  {
    nombre: "María Isabel Moreno",
    pais: "Colombia",
    descripcion:
      "Psicóloga y especialista en Intervención Creativa. Formación en Terapia Gestalt y docente.",
    foto: "/img/MariaIsabelMoreno.jpeg",
    bandera: "/img/bandera-colombia.png",
  },
  {
    nombre: "Jennifer Ortíz",
    pais: "Colombia",
    descripcion:
      "Psicóloga y Magíster en Ciencias Sociales. Formación en Terapia Gestalt y terapia existencial. Docente e investigadora.",
    foto: "/img/JenniferOrtiz.jpeg",
    bandera: "/img/bandera-colombia.png",
  },
  {
    nombre: "Fernando Guzmán Cárdenas",
    pais: "México",
    descripcion:
      "Doctor en Psicoterapia Humanista, Maestro en Ciencias en Psicoterapia Humanista y licenciado en Psicología Humanista. Líder Estratégico en la Universidad Nexum de México y docente.",
    foto: "/img/FernandoGuzman.jpg",
    bandera: "/img/bandera-mexico.png",
  },
];
