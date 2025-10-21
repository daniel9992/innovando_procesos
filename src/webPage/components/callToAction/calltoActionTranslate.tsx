export interface ICallToActionTranslate {
  title: string;
  subtitle: string;

  name: string;
  placeHolderName: string;
  isNameMinLength: string;
  isNameMaxLength: string;
  isRequiredName: string;

  email: string;
  placeHolderEmail: string;
  isRequiredEmail: string;

  message: string;
  placeHolderMessage: string;
  isMessageMinLength: string;
  isMessageMaxLength: string;
  isRequiredMessage: string;

  submitButton: string;
  copyEmail: string;
  copiedEmail: string;
  subscriptionToastTitle: string;
  subscriptionToastDescription: string;
}

export const CallToActionTranslateEs: ICallToActionTranslate = {
  title: "¡Envíanos tu mensaje!",
  subtitle: "¡Nos pondremos en contacto contigo!",

  name: "Nombre",
  placeHolderName: "Tu nombre",
  isNameMinLength: "El nombre debe tener al menos 2 caracteres.",
  isNameMaxLength: "El nombre no puede tener más de 50 caracteres.",
  isRequiredName: "El nombre es obligatorio.",

  email: "Correo electrónico",
  placeHolderEmail: "Tu correo electrónico",
  isRequiredEmail: "El correo electrónico es obligatorio.",

  message: "Mensaje",
  placeHolderMessage: "Tu mensaje",
  isMessageMinLength: "El mensaje debe tener al menos 10 caracteres.",
  isMessageMaxLength: "El mensaje no puede tener más de 1000 caracteres.",
  isRequiredMessage: "El mensaje es obligatorio.",

  submitButton: "Enviar",
  copyEmail: "Copiar correo electrónico",
  copiedEmail: "Correo electrónico copiado",
  subscriptionToastTitle: "Gracias por suscribirte.",
  subscriptionToastDescription:
    "Te estaremos notificando de cualquier actualización.",
};

export const CallToActionTranslateEn: ICallToActionTranslate = {
  title: "Send Us Your Message!",
  subtitle: "We'll get in touch with you!",

  name: "Name",
  placeHolderName: "Your Name",
  isNameMinLength: "The name must be at least 2 characters.",
  isNameMaxLength: "The name cannot exceed 50 characters.",
  isRequiredName: "The name is required.",

  email: "Email",
  placeHolderEmail: "Your Email",
  isRequiredEmail: "The email is required.",

  message: "Message",
  placeHolderMessage: "Your Message",
  isMessageMinLength: "The message must be at least 10 characters.",
  isMessageMaxLength: "The message cannot exceed 1000 characters.",
  isRequiredMessage: "The message is required.",

  submitButton: "Send",
  copyEmail: "Copy Email",
  copiedEmail: "Email Copied!",

  subscriptionToastTitle: "Thanks for subscribing.",
  subscriptionToastDescription: "We'll let you know about any updates.",
};
