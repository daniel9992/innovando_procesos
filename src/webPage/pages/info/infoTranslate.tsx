import Feture1IMG from "@pageAsset/home/job-5382501_1280.jpg";
import Feture2IMG from "@pageAsset/home/taking-notes-3475991_1280.jpg";
import Feture3IMG from "@pageAsset/home/whiteboard-849812_1280.jpg";
import Feture4IMG from "@pageAsset/info/close-up-businessman-with-digital-tablet.jpg";

export interface Step {
  heading: string;
  text: string;
}
export interface Section {
  id: string;
  img: string;
  title: string;
  description: string;
  steps: Array<Step>;
}

export interface IntoTranslate {
  title: string;
  subtitle: string;
  text: string;
  sectionsList: Array<Section>;
}

export const InfoTranslateEs: IntoTranslate = {
  title: "Transformando Negocios",
  subtitle: "Un Viaje de Innovación y Crecimiento",
  text: "La Innovación es el proceso de transformar nuestros negocios para que sean más eficientes, competitivos y rentables. En este curso, aprenderá a transformar tu negocio a través de la innovación, desarrollando estrategias y estrategias de innovación para mejorar tus procesos y tus operaciones.",
  sectionsList: [
    {
      id: "adn",
      img: Feture1IMG,
      title: "Regeneración del ADN",
      description:
        "La regeneración del ADN es un proceso fascinante que implica la renovación y reparación de nuestras células. Al igual que la regeneración del ADN, en los negocios debemos estar dispuestos a descomponer nuestras viejas formas de pensar y reconstruir desde cero.",
      steps: [
        {
          heading: "Primero",
          text: `Reinvente su mentalidad. La necesidad de tomar la
              iniciativa de utilizar asesoría con una empresa de asesoramiento
              llamada Innova Procesos nos enseña que la innovación comienza con
              una mentalidad abierta. Al igual que la regeneración del ADN,
              debemos estar dispuestos a descomponer nuestras viejas formas de
              pensar y reconstruir desde cero. Desafíe sus suposiciones,
              cuestione sus prejuicios y explore nuevas perspectivas. Este es el
              primer paso para encontrar el impulso en su negocio.`,
        },
        {
          heading: "Segundo",
          text: `Aprenda de los errores. Se nos anima a ver los fracasos
              como oportunidades de aprendizaje. Al igual que en la ciencia del
              ADN, los errores pueden llevar a descubrimientos revolucionarios.
              Analice sus fracasos, identifique las lecciones y aplique estos
              aprendizajes en su próximo proyecto. Recuerde, cada fracaso es un
              paso más cerca del éxito.`,
        },
        {
          heading: "Tercero",
          text: `Persista en sus esfuerzos. La regeneración del ADN no es
              un proceso rápido, requiere tiempo y paciencia. Del mismo modo,
              impulsar su negocio requiere persistencia. Mantenga su visión,
              persevere a través de los desafíos y persista en sus esfuerzos. La
              persistencia es la clave del éxito a largo plazo. ¡Adelante,
              regenere su ADN empresarial y encuentre el impulso para su
              negocio!`,
        },
      ],
    },

    {
      id: "profesional-advice",
      img: Feture2IMG,
      title: "Asesoría",
      description:
        "La asesoría es un recurso invaluable que puede proporcionar orientación y conocimientos expertos. Al igual que un buen asesor, Innova Procesos puede guiarnos a través de los desafíos del emprendimiento.",
      steps: [
        {
          heading: "Primero",
          text: `Reconoce el valor de la asesoría. La necesidad de tomar
              la iniciativa de utilizar asesoría con una empresa de
              asesoramiento llamada Innova Procesos nos enseña que la guía
              personalizada puede ser un recurso invaluable. Busca
              asesoramiento, escucha a los expertos y aprende de sus
              experiencias. Al igual que un mapa nos guía a través de un
              territorio desconocido, un buen asesor puede guiarnos a través de
              los desafíos del emprendimiento.`,
        },
        {
          heading: "Segundo",
          text: `Aplica lo que aprendes. La asesoría no es útil a menos
              que se aplique. Toma las lecciones que has aprendido, integra este
              conocimiento en tu estrategia y actúa en consecuencia. La
              aplicación de la asesoría es tan importante como la asesoría
              misma.`,
        },
        {
          heading: "Tercero",
          text: `Comparte tu conocimiento. Una vez que hayas beneficiado
              de la asesoría y la guía personalizada, considera compartir tu
              conocimiento con otros. Mentorea a otros emprendedores, comparte
              tus experiencias y contribuye a la comunidad empresarial. El
              verdadero éxito se encuentra en ayudar a otros a tener éxito.
              ¡Adelante, aprovecha la asesoría y la guía personalizada para
              impulsar tu negocio y ayudar a otros a hacer lo mismo!`,
        },
      ],
    },

    {
      id: "process-refinement",
      img: Feture3IMG,
      title: "Creación o Reingeniería de Procesos",
      description:
        "Este es un enfoque estratégico que implica la revisión, análisis y rediseño de procesos de negocio existentes para mejorar la eficiencia y efectividad.",
      steps: [
        {
          heading: "Primero",
          text: `Visualice el proceso actual. Hay que entender
              completamente el proceso existente. Mapee el flujo de trabajo,
              identifique los cuellos de botella y evalúe la eficiencia.`,
        },
        {
          heading: "Segundo",
          text: `Innove y diseñe. Una vez que comprenda el proceso actual,
              puede comenzar a innovar. Piense fuera de la caja, diseñe nuevos
              procesos y experimente con diferentes enfoques.`,
        },
        {
          heading: "Tercero",
          text: `Implemente y mejore. Recuerde, la reingeniería de
              procesos es un ciclo continuo de mejora. ¡Adelante, cree o
              reinvente sus procesos y conduzca su negocio hacia el éxito!`,
        },
      ],
    },

    {
      id: "risk-management",
      img: Feture4IMG,
      title: "Administración del riesgo",
      description:
        "La administración del riesgo es un proceso esencial en cualquier negocio. Implica identificar, evaluar y priorizar los riesgos para minimizar, monitorear y controlar la probabilidad de eventos desafortunados.",
      steps: [
        {
          heading: "Primero",
          text: `Identifica los riesgos. Examina tu negocio a fondo,
              identifica las áreas de incertidumbre y evalúa los posibles
              impactos. Al igual que un médico diagnostica una enfermedad antes
              de tratarla, debes identificar los riesgos antes de poder
              gestionarlos.`,
        },
        {
          heading: "Segundo",
          text: `Elabora estrategias de mitigación. Analiza cada riesgo,
              desarrolla un plan de acción e implementa soluciones. La
              mitigación de riesgos no es solo sobre evitar el riesgo, sino
              también sobre tomar decisiones informadas.`,
        },
        {
          heading: "Tercero",
          text: `Revisa y ajusta. La administración del riesgo no es un
              proceso estático, sino un proceso continuo. Monitorea los riesgos,
              revisa tus estrategias de mitigación y ajusta según sea necesario.
              ¡Adelante, administra el riesgo y conduce tu negocio hacia el
              éxito!`,
        },
      ],
    },
  ],
};

export const InfoTranslateEn: IntoTranslate = {
  title: "Transforming Business",
  subtitle: "A Journey of Innovation and Growth",
  text: "Innovation is the process of transforming our businesses to be more efficient, competitive, and profitable. In this course, you will learn how to transform your business through innovation, developing strategies and innovation strategies to improve your processes and operations.",
  sectionsList: [
    {
      id: "DNA",
      img: Feture1IMG,
      title: "DNA Regeneration",
      description:
        "DNA regeneration is a fascinating process that involves the renewal and repair of our cells. Like DNA regeneration, in business we must be willing to break down our old ways of thinking and rebuild from scratch.",
      steps: [
        {
          heading: "First",
          text: `Reinvent your mindset. The need to take the
Initiative to use consulting with a consulting firm
called Innova Procesos teaches us that innovation begins with
an open mind. Like DNA regeneration,
We must be willing to break down our old ways of
to think and rebuild from scratch. Challenge their assumptions,
Question your biases and explore new perspectives. This is the
first step to finding momentum in your business.`,
        },
        {
          heading: "Second",
          text: `Learn from mistakes. We are encouraged to see failures
as learning opportunities. As in the science of
DNA, mistakes can lead to breakthrough discoveries.
Analyze your failures, identify the lessons, and apply these
learning in their next project. Remember, every failure is a
step closer to success.`,
        },
        {
          heading: "Burned",
          text: `Persist in your efforts. DNA regeneration is not
A quick process, it takes time and patience. Similarly,
Driving your business requires persistence. Maintain your vision,
Persevere through challenges and persist in your efforts. The
Persistence is the key to long-term success. ¡Go ahead
regenerate your business DNA and find the momentum for your
business!`,
        },
      ],
    },

    {
      id: "professional-advice",
      img: Feture2IMG,
      title: "Consulting",
      description:
        "Counseling is an invaluable resource that can provide guidance and expert knowledge. Like a good advisor, Innova Procesos can guide us through the challenges of entrepreneurship.",
      steps: [
        {
          heading: "First",
          text: `Recognize the value of counseling. The need to take
the initiative to use advice with a
The advice called Innova Processes teaches us that the guide
Personalized can be an invaluable resource. Search
advice, listen to experts and learn from their
Experiences. Just like a map guides us through a
Uncharted territory, a good advisor can guide us through
the challenges of entrepreneurship.`,
        },
        {
          heading: "Second",
          text: `Apply what you learn. Advice is not useful unless
that it is applied. Take the lessons you've learned, integrate this
knowledge in your strategy and act accordingly. The
Applying the advice is as important as the advice
itself.`,
        },
        {
          heading: "Burned",
          text: `Share your knowledge. Once you've benefited
of advice and personalized guidance, consider sharing your
knowledge with others. Mentor other entrepreneurs, share
your experiences and contribute to the business community. The
True success is found in helping others succeed.
Go ahead, take advantage of the advice and personalized guidance to
boost your business and help others do the same!`,
        },
      ],
    },

    {
      id: "process-refinement",
      img: Feture3IMG,
      title: "Process Creation or Reengineering",
      description:
        "This is a strategic approach that involves reviewing, analyzing, and redesigning existing business processes to improve efficiency and effectiveness.",
      steps: [
        {
          heading: "First",
          text: `Visualize the current process. You have to understand
completely the existing process. Map the workflow,
identify bottlenecks and assess efficiency.`,
        },
        {
          heading: "Second",
          text: `Innovate and design. Once you understand the current process,
you can start innovating. Think outside the box, design new ones
processes and experiment with different approaches.`,
        },
        {
          heading: "Burned",
          text: `Implement and improve. Remember, the re-engineering of
processes is a continuous cycle of improvement. Go ahead, believe or
reinvent your processes and lead your business to success!`,
        },
      ],
    },

    {
      id: "risk-management",
      img: Feture4IMG,
      title: "Risk Management",
      description:
        "Risk management is an essential process in any business. It involves identifying, assessing, and prioritizing risks to minimize, monitor, and control the likelihood of unfortunate events.",
      steps: [
        {
          heading: "First",
          text: `Identify the risks. Examine your business thoroughly,
Identify areas of uncertainty and assess possible
Impacts. Just like a doctor diagnoses a disease earlier
to treat it, you must identify the risks before you can
manage them.`,
        },
        {
          heading: "Second",
          text: `Develop mitigation strategies. Analyze each risk,
Develop an action plan and implement solutions. The
Risk mitigation is not just about avoiding risk, but
also about making informed decisions.`,
        },
        {
          heading: "Burned",
          text: `Review and adjust. Risk management is not a
static process, but a continuous process. Monitor risks,
Review your mitigation strategies and adjust as needed.
Go ahead, manage the risk and lead your business towards the
success!`,
        },
      ],
    },
  ],
};
