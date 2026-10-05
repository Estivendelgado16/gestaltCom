/**
 * Contenido del dossier del Diplomado Internacional en Terapia Gestalt de Campo.
 *
 * Objeto plano e inmutable (tipo `as const`) y centralizado: todos los datos
 * textuales/estructurales viven aquí, de modo que la vista se limita a
 * renderizarlos (separación de datos y presentación — Single Responsibility).
 *
 * Nota visual: usamos únicamente las variables de color globales ya definidas
 * (--ink, --ink-soft, --gold, --sand-light, --cream). No se introducen paletas nuevas.
 */
export type Segmento = { text: string; bold: boolean };
export type ParrafoSegmentado = { texto: string; segments?: Segmento[] };

/** Sesión individual del calendario de un módulo. */
export type Sesion = {
  titulo: string;
  fecha: string;
  docente: string;
  pais: string;
};

/** Módulo del programa: banner visual con título, objetivo y sesiones. */
export type Modulo = {
  moduloTag: string;
  titulo: string;
  objetivo: string;
  /** Palabras/frases a resaltar en negrita dentro del objetivo. */
  resaltes?: readonly string[];
  imagen: string;
  imagenAlt: string;
  logoLeft: string;
  logoRight: string;
  sesiones: readonly Sesion[];
};

/** Logos institucionales usados en la cabecera de cada banner de módulo. */
const LOGOS = {
  izquierdo: "/img/logo2.png",
  derecho: "/img/logo1.png",
} as const;

export const diplomadoData = {
  hero: {
    imagenFondo: "/img/banner-diplomado.png",
  },

  introduccion: {
    categoria: "FORMACIÓN ONLINE:",
    titulo: "Fundamentos en fenomenología y teoría de campo",
    descripcion:
      "Su objetivo es ofrecer fundamentos en fenomenología y teoría de campo, entendidas como influencias centrales de la Terapia Gestalt que sostienen y orientan la práctica clínica.",
    imagen: "/img/imgDiplomado1.jpg",
    imagenAlt: "Piedras apiladas en equilibrio",
  },

  presentacion: {
    titulo: "Presentación",
    parrafos: [
      "El Diplomado Internacional en Terapia Gestalt de Campo: Fundamentos en fenomenología y teoría de campo, surge de la necesidad de ampliar una formación en los pilares conceptuales que sostienen nuestro quehacer clínico. En particular, propone acercarnos a la fenomenología y la teoría de campo como marcos fundamentales para comprender el sentido, la coherencia y la orientación epistemológica de la situación terapéutica.",
      "Con frecuencia, estos fundamentos han quedado reducidos a referencias históricas o a introducciones teóricas que no siempre favorecen su asimilación e integración en la práctica clínica. La fenomenología, como método de acercamiento en el encuentro terapéutico, y la teoría de campo, como marco comprensivo de la experiencia, serán las coordenadas que orientarán este diplomado.",
      "Por ello, en un contexto contemporáneo que exige claridad conceptual y solidez en la práctica psicoterapéutica, se vuelve necesario revisar estos fundamentos, no solo para comprenderlos, sino también para interrogarlos, actualizarlos y sostener su vigencia. Este diplomado propone un espacio formativo que articula la reflexión teórica, el diálogo crítico y el pensamiento clínico, honrando el legado teórico de la Terapia Gestalt y asumiendo el desafío de continuar su desarrollo.",
    ],
  },

  objetivoYTipo: {
    bloques: [
      {
        titulo: "Objetivo General",
        texto:
          "Ofrecer una formación teórica en los fundamentos de la Terapia Gestalt, con énfasis en la fenomenología y la teoría de campo, a través de la comprensión de los principios filosóficos y conceptuales que sostienen y orientan la práctica clínica.",
      },
      {
        titulo: "¿A quién va dirigido?",
        texto:
          "Este diplomado está dirigido a psicólogos y terapeutas gestálticos (graduados o en formación), así como a profesionales de las ciencias sociales y de la salud interesados en profundizar y fundamentar su mirada clínica desde la fenomenología y la teoría de campo.",
      },
    ],
    cierre:
      "Al tratarse de un espacio formativo internacional, el programa favorece el diálogo, el intercambio y la co-construcción del conocimiento y de la experiencia entre los participantes.",
  },

  diferenciadores: {
    titulo: "¿Qué hace diferente este diplomado?",
    texto:
      "Este diplomado se distingue por ofrecer una formación multicultural en los fundamentos filosóficos y conceptuales de la Terapia Gestalt, haciendo una aproximación a las influencias de la fenomenología y la teoría de campo que configuran su marco epistemológico.",
    imagen: "/img/imgDiplomado2.jpg",
    imagenAlt: "Pies descalzos caminando sobre un tronco cubierto de musgo",
  },

  metodologia: {
    titulo: "Metodología",
    parrafo1:
      "La propuesta metodológica del diplomado está orientada a favorecer una comprensión teórica y reflexiva de dichos fundamentos de la Terapia Gestalt, integrando el estudio conceptual con la elaboración clínica y la experiencia compartida en grupo.",
    parrafo2:
      "El programa cuenta con docentes con amplio recorrido, tanto en el ámbito clínico como en el desarrollo teórico, y, con trayectoria específica en las temáticas abordadas, lo que garantiza que los contenidos se encuentren sólidamente sustentados en la experiencia clínica y en la reflexión conceptual.",
    cita: "“Nuestro propio cuerpo está en el mundo como el corazón está en el organismo”. – Merleau-Ponty",
    imagen: "/img/imgDiplomado3.jpg",
    imagenAlt: "Mano suspendida sobre el agua tocando la superficie",
  },

  generalidades: {
    titulo: "Generalidades",
    parrafos: [
      {
        // Texto plano (sin resaltados)
        texto:
          "Como parte del proceso de admisión, se invitará a cada postulante a compartir su recorrido formativo, su experiencia clínica y las motivaciones que lo convocan a participar. Este proceso busca cuidar la calidad del encuentro y del espacio que construiremos conjuntamente.",
      } as ParrafoSegmentado,
      {
        // Segmentos con resaltado en negrita (destacar fechas y horarios)
        texto:
          "El diplomado inicia el 5 de septiembre de 2026 y finaliza el 3 de julio de 2027, con encuentros quincenales los días sábados de 8:00 a.m. a 12:00 m. (hora oficial de Colombia GMT-5), con una intensidad de 4 horas por sesión. Duración: 9 meses.",
        segments: [
          { text: "El diplomado inicia el ", bold: false },
          { text: "5 de septiembre de 2026", bold: true },
          { text: " y finaliza el ", bold: false },
          { text: "3 de julio de 2027", bold: true },
          { text: ", con encuentros quincenales los días ", bold: false },
          { text: "sábados de 8:00 a.m. a 12:00 m.", bold: true },
          { text: " (hora oficial de Colombia GMT-5), con una intensidad de ", bold: false },
          { text: "4 horas por sesión", bold: true },
          { text: ". Duración: ", bold: false },
          { text: "9 meses", bold: true },
          { text: ".", bold: false },
        ],
      },
      {
        texto:
          "Idioma: Español. El programa incluye dos módulos con interpretación consecutiva del francés y del italiano al español.",
      } as ParrafoSegmentado,
    ],
    imagen: "/img/manifiesto.jpg",
    imagenAlt: "Manos pintadas con texturas de arcilla de colores tierra",
  },

  evaluacion: {
    titulo: "Evaluación y certificación",
    texto:
      "La certificación del diplomado requiere una participación mínima del 80% en los encuentros sincrónicos, así como el cumplimiento de las actividades...",
    cita: "“No hay nada más práctico que una buena teoría”. – Kurt Lewin",
  },

  /** Documento editorial del programa: un banner visual por módulo que integra
   *  título, objetivo y el calendario de sesiones del módulo. */
  programa: {
    modulos: [
      {
        moduloTag: "MÓDULO 1",
        titulo: "MARCO EPISTEMOLÓGICO DE LA TERAPIA GESTALT",
        objetivo:
          "Reconocer los fundamentos epistemológicos de la Terapia Gestalt, comprendiendo su surgimiento histórico y las principales influencias teóricas que configuran su marco conceptual.",
        resaltes: ["Terapia Gestalt"],
        imagen: "/img/backgroundMod1.jpg",
        imagenAlt: "Paisaje panorámico del Módulo 1",
        logoLeft: LOGOS.izquierdo,
        logoRight: LOGOS.derecho,
        sesiones: [
          {
            titulo: "Primer encuentro: generalidades",
            fecha: "15/09/2026",
            docente: "Dany Mora, María Isabel Moreno",
            pais: "Venezuela-Colombia · Colombia",
          },
          {
            titulo:
              "De la ruptura al campo: fundamentos históricos e influencias epistemológicas de la terapia Gestalt",
            fecha: "19/09/2026",
            docente: "Fernando Guzmán",
            pais: "México",
          },
          {
            titulo: "La Gestalt antes de la Gestalt: filogénesis filosófica",
            fecha: "3/10/2026",
            docente: "Luis Javier Tobón",
            pais: "Colombia",
          },
          {
            titulo: "Discusión y asimilación",
            fecha: "17/10/2026",
            docente: "María Isabel Moreno",
            pais: "Colombia",
          },
        ],
      },
      {
        moduloTag: "MÓDULO 2",
        titulo: "ACERCAMIENTO A LA FENOMENOLOGÍA",
        objetivo:
          "Abordar los principios de la fenomenología y algunos de sus desarrollos filosóficos relevantes para la Terapia Gestalt, favoreciendo la comprensión de la experiencia, la percepción y el sentido como base ética y metodológica.",
        resaltes: ["fenomenología", "Terapia Gestalt"],
        imagen: "/img/backgroundMod2.jpg",
        imagenAlt: "Paisaje panorámico del Módulo 2",
        logoLeft: LOGOS.izquierdo,
        logoRight: LOGOS.derecho,
        sesiones: [
          {
            titulo: "Lo real haciéndose fenómeno: cartografía fenomenológica para la existencia",
            fecha: "7/11/2026",
            docente: "Luis Javier Tobón",
            pais: "Colombia",
          },
          {
            titulo: "Génesis fenomenológica de la Gestalt",
            fecha: "21/11/2026",
            docente: "Marcos Müller",
            pais: "Brasil",
          },
          {
            titulo:
              "Acontecimiento y comprensión: fenomenología hermenéutica en la práctica gestáltica",
            fecha: "5/12/2026",
            docente: "Guenadi Búrquez",
            pais: "México",
          },
          {
            titulo:
              "Aportes de la fenomenología de la percepción de Merleau-Ponty a la Gestalt de campo",
            fecha: "16/01/2027",
            docente: "José Miguel Echavarría",
            pais: "Argentina",
          },
          {
            titulo: "Discusión y asimilación",
            fecha: "30/01/2027",
            docente: "Dany Mora y Daniel Echavarría",
            pais: "Venezuela-Colombia · Colombia",
          },
        ],
      },
      {
        moduloTag: "MÓDULO 3",
        titulo: "APROXIMACIÓN A LA TEORÍA DE CAMPO",
        objetivo:
          "Explorar los fundamentos de la teoría de campo para una comprensión de la experiencia humana en el espacio terapéutico.",
        resaltes: ["teoría de campo"],
        imagen: "/img/backgorundMod3.jpg",
        imagenAlt: "Paisaje panorámico del Módulo 3",
        logoLeft: LOGOS.izquierdo,
        logoRight: LOGOS.derecho,
        sesiones: [
          {
            titulo: "El campo como horizonte: primeras aproximaciones a la teoría de campo",
            fecha: "13/02/2027",
            docente: "Dany Mora",
            pais: "Venezuela-Colombia",
          },
          {
            titulo: "De la teoría de campo a la terapia de la situación",
            fecha: "27/02/2027",
            docente: "Daniel Echavarría",
            pais: "Colombia",
          },
          {
            titulo: "La co-construcción de la experiencia en terapia Gestalt",
            fecha: "13/03/2027",
            docente: "Ricardo García Jiménez",
            pais: "Chile",
          },
          {
            titulo: "La teoría de campo en la terapia Gestalt: metodología y práctica",
            fecha: "3/04/2027",
            docente: "Julio Polanco",
            pais: "México",
          },
          {
            titulo: "Discusión y asimilación",
            fecha: "16/04/2027",
            docente: "Dany Mora",
            pais: "Venezuela-Colombia",
          },
        ],
      },
      {
        moduloTag: "MÓDULO 4",
        titulo: "LA SITUACIÓN TERAPÉUTICA COMO TEJIDO DE LA EXPERIENCIA",
        objetivo:
          "Integrar los aportes de la fenomenología y la teoría de campo, como recursos que orientan el modo de estar y comprender la experiencia en el encuentro terapéutico.",
        resaltes: ["fenomenología", "teoría de campo"],
        imagen: "/img/background4.jpg",
        imagenAlt: "Paisaje panorámico del Módulo 4",
        logoLeft: LOGOS.izquierdo,
        logoRight: LOGOS.derecho,
        sesiones: [
          {
            titulo: "Fenomenología en acto: el arte del encuentro terapéutico",
            fecha: "8/05/2027",
            docente: "Jennifer Ortiz",
            pais: "Colombia",
          },
          {
            titulo:
              "El terapeuta como portador del campo: intercorporalidad, co-afectación y palabra encarnada",
            fecha: "22/05/2027",
            docente: "Jean-Marie Delacroix",
            pais: "Francia",
          },
          {
            titulo: "El conocimiento relacional estético en la actitud clínica",
            fecha: "5/06/2027",
            docente: "Michele Cannavò",
            pais: "Italia",
          },
          {
            titulo: "La clínica como campo vivo: fenomenología aplicada en el enfoque gestáltico",
            fecha: "19/06/2027",
            docente: "Sergio La Rosa",
            pais: "Argentina-Italia",
          },
          {
            titulo: "Discusión, asimilación y cierre",
            fecha: "3/07/2027",
            docente: "Dany Mora",
            pais: "Venezuela-Colombia",
          },
        ],
      },
    ],
  },
} as const;

export type DiplomadoData = typeof diplomadoData;
