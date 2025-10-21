import React, { createContext, type ReactNode, useCallback } from 'react';
import { setUpNotifications, useNotifications } from 'reapop';
import type {
  NotificationPayload,
  NotificationUpdatePayload
} from './notyModel';

// Configuración inicial para reapop (puedes personalizarla)
setUpNotifications({
  defaultProps: {
    position: 'top-right',
    dismissible: true,
    dismissAfter: 5000, // 5 segundos
    showDismissButton: true,
    pauseOnHover: true
  }
});

export interface NotificationContextType {
  sendNotification: (
    notification: NotificationPayload
  ) => string | undefined;
  updateNotification: (
    id: string,
    notificationUpdate: NotificationUpdatePayload
  ) => void;
  deleteAllNotifications: () => void;
  deleteNotification: (id: string) => void;
  notifications: Array<NotificationPayload>;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children
}) => {
  const {
    notifications: notificationsFromReapop, // Aunque no lo usemos directamente aquí, es parte del hook de reapop
    notify,
    dismissNotifications,
    dismissNotification
  } = useNotifications();

  const sendNotification = useCallback(
    (notification: NotificationPayload): string | undefined => {
      // `addNotification` de reapop devuelve la notificación completa, incluyendo el ID generado.
      const reapopNotif = notify({
        ...notification
      });
      return reapopNotif.id;
    },
    [notify]
  );

  const updateNotification = useCallback(
    (id: string, notificationUpdate: NotificationUpdatePayload) => {
      // reapopUpdateNotification espera el objeto completo de la notificación con el id.
      // Creamos una nueva notificación para la actualización.
      // Nota: reapop espera el objeto completo, así que si sólo pasas `message`,
      // otras propiedades (como `status`) podrían resetearse a sus defaults si no se proveen.
      // Es importante manejar esto según cómo `reapop` u otra librería esperen las actualizaciones.
      // Para `reapop`, `updateNotification` espera un objeto `ReapopNotification`.
      // Por simplicidad, asumimos que el `notificationUpdate` contiene los campos que `reapop` necesita.

      const notificationToUpdate = notificationsFromReapop.find(
        (notif) => notif.id === id
      );
      if (!notificationToUpdate) return;

      const copyNotification = {
        ...notificationToUpdate,
        ...notificationUpdate
      };

      notify({
        ...copyNotification
      });
    },
    [notify, notificationsFromReapop]
  );

  const deleteNotification = useCallback(
    (id: string) => {
      dismissNotification(id);
    },
    [dismissNotification]
  );

  const deleteAllNotifications = useCallback(() => {
    dismissNotifications();
  }, [dismissNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        sendNotification,
        updateNotification,
        deleteAllNotifications,
        deleteNotification,
        notifications: notificationsFromReapop
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
