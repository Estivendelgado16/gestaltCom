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

  /** Documento editorial del programa: 4 páginas de contenido y 1 página de calendario. */
  programa: {
    paleta: {
      banner: "#4A6B82",
      panel: "#EAF0F4",
      cuerpo: "#3D4249",
      resalte: "#E8A33D",
      tinta: "#2E3A46",
    },
    paginasContenido: [
      {
        banner: true,
        titulo: "MÓDULO 1: Marco Epistemológico de la Terapia Gestalt",
        objetivo:
          "Reconocer los fundamentos epistemológicos de la Terapia Gestalt, comprendiendo su surgimiento histórico y las principales influencias teóricas que configuran su marco conceptual.",
        temario: [
          "Primer encuentro: generalidades.",
          "De la ruptura al campo: fundamentos históricos e influencias epistemológicas de la terapia Gestalt.",
          "La Gestalt antes de la Gestalt: filogénesis filosófica.",
          "Encuentro de cierre para la discusión y asimilación.",
        ],
        imagen: "/img/lineaFotos1.png",
        imagenAlt: "Manos entrelazadas sobre el tronco de un árbol en un bosque verde",
        imagenPosition: "left",
      },
      {
        banner: false,
        titulo: "MÓDULO 2: Acercamiento a la fenomenología",
        objetivo:
          "Abordar los principios de la fenomenología y algunos de sus desarrollos filosóficos relevantes para la Terapia Gestalt, favoreciendo la comprensión de la experiencia, la percepción y el sentido como base ética y metodológica.",
        temario: [
          "Lo real haciéndose fenómeno: cartografía fenomenológica para la existencia.",
          "Génesis fenomenológica de la Gestalt.",
          "Acontecimiento y comprensión: fenomenología hermenéutica en la práctica gestáltica.",
          "Encuentro de cierre para la discusión y asimilación.",
        ],
        imagen: "/img/supervision.jpg",
        imagenAlt: "Gotas de agua sobre una superficie tranquila con bokeh dorado",
        imagenPosition: "left",
      },
      {
        banner: false,
        titulo: "MÓDULO 3: Aproximación a la teoría de campo",
        objetivo:
          "Explorar los fundamentos de la teoría de campo para una comprensión de la experiencia humana en el espacio terapéutico.",
        temario: [
          "El campo como horizonte: primeras aproximaciones a la teoría de campo.",
          "De la teoría de campo a la terapia de la situación.",
          "La co-construcción de la experiencia en terapia Gestalt.",
          "La teoría de campo en la terapia Gestalt: metodología y práctica.",
          "Encuentro de cierre para la discusión y asimilación.",
        ],
        imagen: "/img/lineaFotos2.png",
        imagenAlt: "Sendero de tierra a través de un campo seco y dorado hacia el horizonte",
        imagenPosition: "center",
      },
      {
        banner: false,
        titulo: "MÓDULO 4: La situación terapéutica como tejido de la experiencia",
        objetivo:
          "Integrar los aportes de la fenomenología y la teoría de campo, como recursos que orientan el modo de estar y comprender la experiencia en el encuentro terapéutico.",
        temario: [
          "Fenomenología en acto: el arte del encuentro terapéutico.",
          "El terapeuta como portador del campo: intercorporalidad, co-afectación y palabra encarnada.",
          "El conocimiento relacional estético en la actitud clínica.",
          "La clínica como campo vivo: fenomenología aplicada en el enfoque gestáltico.",
          "Encuentro de cierre para la discusión y asimilación.",
        ],
        imagen: "/img/terapia.jpg",
        imagenAlt: "Dos manos entrelazadas contra un fondo de hojas verdes tropicales",
        imagenPosition: "right",
      },
    ],
    calendario: {
      titulo: "Programa",
      modulos: [
        {
          titulo: "MÓDULO 1: MARCO EPISTEMOLÓGICO DE LA TERAPIA GESTALT",
          sesiones: [
            {
              titulo: "Primer encuentro: generalidades",
              fecha: "15/09/2026",
              docente: "Dany Mora (Venezuela-Colombia), María Isabel Moreno (Colombia)",
            },
            {
              titulo:
                "De la ruptura al campo: fundamentos históricos e influencias epistemológicas de la terapia Gestalt",
              fecha: "19/09/2026",
              docente: "Fernando Guzmán (México)",
            },
            {
              titulo: "La Gestalt antes de la Gestalt: filogénesis filosófica",
              fecha: "3/10/2026",
              docente: "Luis Javier Tobón (Colombia)",
            },
            {
              titulo: "Discusión y asimilación",
              fecha: "17/10/2026",
              docente: "María Isabel Moreno (Colombia)",
            },
          ],
        },
        {
          titulo: "MÓDULO 2: ACERCAMIENTO A LA FENOMENOLOGÍA",
          sesiones: [
            {
              titulo: "Lo real haciéndose fenómeno: cartografía fenomenológica para la existencia",
              fecha: "7/11/2026",
              docente: "Luis Javier Tobón (Colombia)",
            },
            {
              titulo: "Génesis fenomenológica de la Gestalt",
              fecha: "21/11/2026",
              docente: "Marcos Müller (Brasil)",
            },
            {
              titulo:
                "Acontecimiento y comprensión: fenomenología hermenéutica en la práctica gestáltica",
              fecha: "5/12/2026",
              docente: "Guenadi Búrquez (México)",
            },
            {
              titulo:
                "Aportes de la fenomenología de la percepción de Merleau-Ponty a la Gestalt de campo",
              fecha: "16/01/2027",
              docente: "José Miguel Echavarría (Argentina)",
            },
            {
              titulo: "Discusión y asimilación",
              fecha: "30/01/2027",
              docente: "Dany Mora (Venezuela-Colombia) y Daniel Echavarría (Colombia)",
            },
          ],
        },
        {
          titulo: "MÓDULO 3: APROXIMACIÓN A LA TEORÍA DE CAMPO",
          sesiones: [
            {
              titulo: "El campo como horizonte: primeras aproximaciones a la teoría de campo",
              fecha: "13/02/2027",
              docente: "Dany Mora (Venezuela-Colombia)",
            },
            {
              titulo: "De la teoría de campo a la terapia de la situación",
              fecha: "27/02/2027",
              docente: "Daniel Echavarría (Colombia)",
            },
            {
              titulo: "La co-construcción de la experiencia en terapia Gestalt",
              fecha: "13/03/2027",
              docente: "Ricardo García Jiménez (Chile)",
            },
            {
              titulo: "La teoría de campo en la terapia Gestalt: metodología y práctica",
              fecha: "3/04/2027",
              docente: "Julio Polanco (México)",
            },
            {
              titulo: "Discusión y asimilación",
              fecha: "16/04/2027",
              docente: "Dany Mora (Venezuela-Colombia)",
            },
          ],
        },
        {
          titulo: "MÓDULO 4: LA SITUACIÓN TERAPÉUTICA COMO TEJIDO DE LA EXPERIENCIA",
          sesiones: [
            {
              titulo: "Fenomenología en acto: el arte del encuentro terapéutico",
              fecha: "8/05/2027",
              docente: "Jennifer Ortiz (Colombia)",
            },
            {
              titulo:
                "El terapeuta como portador del campo: intercorporalidad, co-afectación y palabra encarnada",
              fecha: "22/05/2027",
              docente: "Jean-Marie Delacroix (Francia)",
            },
            {
              titulo: "El conocimiento relacional estético en la actitud clínica",
              fecha: "5/06/2027",
              docente: "Michele Cannavò (Italia)",
            },
            {
              titulo: "La clínica como campo vivo: fenomenología aplicada en el enfoque gestáltico",
              fecha: "19/06/2027",
              docente: "Sergio La Rosa (Argentina-Italia)",
            },
            {
              titulo: "Discusión, asimilación y cierre",
              fecha: "3/07/2027",
              docente: "Dany Mora (Venezuela-Colombia)",
            },
          ],
        },
      ],
    },
  },
} as const;

export type DiplomadoData = typeof diplomadoData;
