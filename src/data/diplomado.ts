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

export const diplomadoData = {
  hero: {
    titulo: "Diplomado Internacional en Terapia Gestalt de Campo",
    subtitulo: "Fundamentos en fenomenología y teoría de campo",
    fechas: "2026-2027",
    imagenFondo: "/img/hero-piedras.png",
  },

  introduccion: {
    categoria: "FORMACIÓN ONLINE:",
    titulo: "Fundamentos en fenomenología y teoría de campo",
    descripcion:
      "Su objetivo es ofrecer fundamentos en fenomenología y teoría de campo, entendidas como influencias centrales de la Terapia Gestalt que sostienen y orientan la práctica clínica.",
    imagen: "/img/formacion.jpg",
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
    imagen: "/img/terapia.jpg",
    imagenAlt: "Pies descalzos caminando sobre un tronco cubierto de musgo",
  },

  metodologia: {
    titulo: "Metodología",
    parrafo1:
      "La propuesta metodológica del diplomado está orientada a favorecer una comprensión teórica y reflexiva de dichos fundamentos de la Terapia Gestalt, integrando el estudio conceptual con la elaboración clínica y la experiencia compartida en grupo.",
    parrafo2:
      "El programa cuenta con docentes con amplio recorrido, tanto en el ámbito clínico como en el desarrollo teórico, y, con trayectoria específica en las temáticas abordadas, lo que garantiza que los contenidos se encuentren sólidamente sustentados en la experiencia clínica y en la reflexión conceptual.",
    cita: "“Nuestro propio cuerpo está en el mundo como el corazón está en el organismo”. – Merleau-Ponty",
    imagen: "/img/supervision.jpg",
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
} as const;

export type DiplomadoData = typeof diplomadoData;
