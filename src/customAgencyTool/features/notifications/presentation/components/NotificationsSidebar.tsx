import { motion } from 'framer-motion';
import Notifications from './notifications';

interface NotificationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsSidebar({
  isOpen,
  onClose,
}: NotificationsSidebarProps) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '300px',
        height: '100%',
        backgroundColor: 'white',
        boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
    >
      <button onClick={onClose}>Close</button>
      <Notifications />
    </motion.div>
  );
}
