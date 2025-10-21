interface IFrequentQuestion {
  id: number;
  title: string;
  text: string;
}

export interface IFrequentQuestionTranslate {
  title: string;
  text: string;
  questions: Array<IFrequentQuestion>;
}

export const FrequentQuestionEs: IFrequentQuestionTranslate = {
  title: "Preguntas frecuentes",
  text: `¿Tienes preguntas? ¡Tenemos respuestas! Nuestra sección de ‘Preguntas
    frecuentes’ está llena de información útil que puede aclarar tus
    dudas. No te quedes en la incertidumbre, ¡descubre las respuestas que
    necesitas hoy mismo!
  `,
  questions: [
    {
      id: 0,
      title: "¿Quéservicios de asesoramiento empresarial ofrecen?",
      text: "Ofrecemos una gama completa de servicios de asesoramiento empresarial, incluyendo planificación estratégica, gestión financiera, marketing, gestión de recursos humanos y mejora de procesos.",
    },
    {
      id: 1,
      title: "¿Cómo pueden ayudar a mi pequeña o mediana empresa a crecer?",
      text: "Trabajamos en estrecha colaboración con usted para entender sus objetivos de negocio, identificar desafíos y desarrollar soluciones personalizadas que impulsarán el crecimiento y éxito de su empresa.",
    },
    {
      id: 2,
      title: "¿Tienen experiencia en mi industria?",
      text: "Tenemos una amplia experiencia en una variedad de industrias y utilizamos esta experiencia para proporcionar asesoramiento relevante y efectivo para su negocio.",
    },
    {
      id: 3,
      title:
        "¿Cómo trabajan con los clientes para desarrollar estrategias y soluciones?",
      text: "Colaboramos con nuestros clientes para desarrollar estrategias y soluciones. Esto implica entender sus necesidades, analizar su situación actual y proponer soluciones personalizadas.",
    },
    {
      id: 4,
      title: "¿Cuál es su enfoque para la planificación estratégica?",
      text: "Nuestro enfoque para la planificación estratégica implica entender a fondo su negocio, su industria y sus objetivos a largo plazo. A partir de ahí, desarrollamos un plan estratégico que alinea sus objetivos con acciones concretas.",
    },
    {
      id: 5,
      title:
        "¿Cómo pueden ayudar a mejorar la gestión financiera de mi empresa?",
      text: "Ofrecemos herramientas y estrategias para mejorar la gestión financiera de su empresa, incluyendo la optimización de costos, la gestión del flujo de efectivo y la obtención de financiamiento.",
    },
    {
      id: 6,
      title: "¿Cómo pueden ayudar a mi empresa a atraer y retener talento?",
      text: "Proporcionamos orientación sobre las mejores prácticas de contratación y retención, así como sobre la gestión eficaz del personal.",
    },
    {
      id: 7,
      title: "¿Cuál es el costo de sus servicios de asesoramiento empresarial?",
      text: "El costo de nuestros servicios varía dependiendo de las necesidades específicas de su empresa. Estaremos encantados de discutir esto con usted en detalle durante una consulta inicial gratuita.",
    },
    {
      id: 8,
      title: "¿Cómo miden y comunican el progreso y los resultados?",
      text: "Medimos y comunicamos el progreso y los resultados a través de informes regulares y reuniones de seguimiento. Nuestro objetivo es asegurar que esté informado y satisfecho con nuestro trabajo.",
    },
    {
      id: 9,
      title:
        "¿Ofrecen algún tipo de garantía o reembolso si no estoy satisfecho con sus servicios?",
      text: "Nos esforzamos por proporcionar servicios de alta calidad que satisfagan las necesidades de nuestros clientes. Si no está satisfecho con nuestros servicios, por favor háganoslo saber y haremos todo lo posible para resolver cualquier problema.",
    },
    {
      id: 10,
      title:
        "¿Cómo manejan la confidencialidad y la seguridad de la información de mi empresa?",
      text: "Tomamos muy en serio la confidencialidad y la seguridad de la información de su empresa. Tenemos políticas y procedimientos en vigor para garantizar que su información esté segura con nosotros.",
    },
    {
      id: 11,
      title:
        "¿Cómo se mantienen al día con las últimas tendencias y desarrollos en el asesoramiento empresarial?",
      text: "Nos mantenemos al día con las últimas tendencias y desarrollos en el asesoramiento empresarial a través de la formación continua, la investigación y la participación en eventos de la industria.",
    },
  ],
};

export const FrequentQuestionEn: IFrequentQuestionTranslate = {
  title: "Frequent Questions",
  text: `Do you have any questions? We have answers! Our ‘Frequently Asked
    Questions’ section is packed with useful information that can clear
    your doubts. Don’t let uncertainty hold you back, discover the answers
    you need today!`,

  questions: [
    {
      id: 0,
      title: "What business advisory services do you offer?",
      text: "We offer a full range of business advisory services, including strategic planning, financial management, marketing, human resource management and process improvement.",
    },
    {
      id: 1,
      title: "How can they help my small or medium-sized business grow?",
      text: "We work closely with you to understand your business goals, identify challenges, and develop customized solutions that will drive your company's growth and success.",
    },
    {
      id: 2,
      title: "Do you have experience in my industry?",
      text: "We have extensive experience in a variety of industries and use this experience to provide relevant and effective advice for your business.",
    },
    {
      id: 3,
      title:
        "How do they work with clients to develop strategies and solutions?",
      text: "We collaborate with our customers to develop strategies and solutions. This means understanding their needs, analyzing their current situation and proposing customized solutions.",
    },
    {
      id: 4,
      title: "What's Your Approach to Strategic Planning?",
      text: "Our approach to strategic planning involves thoroughly understanding your business, your industry, and your long-term goals. From there, we develop a strategic plan that aligns its objectives with concrete actions.",
    },
    {
      id: 5,
      title: "How can you help improve my company's financial management?",
      text: "We offer tools and strategies to improve your company's financial management, including cost optimization, cash flow management, and obtaining financing.",
    },
    {
      id: 6,
      title: "How can you help my company attract and retain talent?",
      text: "We provide guidance on recruitment and retention best practices, as well as effective staff management.",
    },
    {
      id: 7,
      title: "What is the cost of your business advisory services?",
      text: "The cost of our services varies depending on your company's specific needs. We would be happy to discuss this with you in detail during a free initial consultation.",
    },
    {
      id: 8,
      title: "How do you measure and communicate progress and results?",
      text: "We measure and communicate progress and results through regular reports and follow-up meetings. Our goal is to ensure that you are informed and satisfied with our work.",
    },
    {
      id: 9,
      title:
        "Do you offer any kind of guarantee or refund if I am not satisfied with your services?",
      text: "We strive to provide high-quality services that meet the needs of our customers. If you are not satisfied with our services, please let us know and we will do our best to resolve any issues.",
    },
    {
      id: 10,
      title:
        "How do you handle the confidentiality and security of my company's information?",
      text: "We take the confidentiality and security of your company's information very seriously. We have policies and procedures in place to ensure that your information is safe with us.",
    },
    {
      id: 11,
      title:
        "How do they keep up with the latest trends and developments in business advice?",
      text: "We keep up with the latest trends and developments in business consulting through continuous training, research and participation in industry events.",
    },
  ],
};
