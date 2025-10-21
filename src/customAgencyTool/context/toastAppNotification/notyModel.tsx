import type {
  NewNotification,
  Notification as ReapopNotification // Renombramos para evitar colisión si tenemos nuestro propio tipo Notification
} from 'reapop';

// --- Tipos ---
// Extendemos NewNotification para asegurar que podemos pasar cualquier opción de reapop
// y también definir una estructura para las actualizaciones.
export interface NotificationPayload extends Omit<NewNotification, 'id'> {
  // Puedes añadir campos personalizados si tu adaptador los necesita en el futuro
  // para otras librerías, pero por ahora nos basamos en NewNotification.
  // El 'id' será generado por la librería o por nuestro sendNotification.

  title?: string;
  message?: string;
}

export interface NotificationUpdatePayload
  extends Partial<Omit<ReapopNotification, 'id'>> {
  // Campos que se pueden actualizar.
  // No incluimos 'id' aquí porque se pasa como argumento separado.

  title?: string;
  message?: string;
}
