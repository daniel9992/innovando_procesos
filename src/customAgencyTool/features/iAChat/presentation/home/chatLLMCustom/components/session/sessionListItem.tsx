// // components/session/SessionListItem/SessionListItem.tsx

// import { Menu, Portal } from '@chakra-ui/react';
// import {
//     MyButton,
//     MyDialog,
//     MyFlex,
//     MyInputText,
//     MyText
// } from '@src/customAgencyTool/components/ui';
// import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
// import { type Session } from 'reachat';
// import { type FC, useState } from 'react';

// interface SessionListItemProps {
//     /**
//      * Session data
//      */
//     session: Session;

//     /**
//      * Whether the session is currently active
//      */
//     isActive?: boolean;

//     /**
//      * Callback when session is clicked
//      */
//     onSelect?: (session: Session) => void;

//     /**
//      * Callback when session is renamed
//      */
//     onRename?: (session: Session, newTitle: string) => void;

//     /**
//      * Callback when session is deleted
//      */
//     onDelete?: (session: Session) => void;

//     /**
//      * Custom style variant
//      */
//     variant?: 'default' | 'compact' | 'expanded';

//     /**
//      * Whether to show session actions
//      */
//     showActions?: boolean;
// }

// interface RenameModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     session: Session;
//     onRename: (session: Session, newTitle: string) => void;
// }

// const RenameModal: FC<RenameModalProps> = ({
//     isOpen,
//     onClose,
//     session,
//     onRename
// }) => {
//     const [newTitle, setNewTitle] = useState(session.title || '');

//     const handleRename = () => {
//         onRename(session, newTitle);
//         onClose();
//     };

//     return (
//         <MyDialog
//             //
//             isOpen={isOpen}
//             onClose={onClose}
//             header="Rename Session"
//             body={
//                 <MyFlex direction="column" gap={4}>
//                     <MyInputText
//                         value={newTitle}
//                         onChange={(e) => setNewTitle(e.target.value)}
//                         placeholder="Enter new title"
//                         autoFocus
//                     />
//                     <MyFlex direction="row" gap={2} justify="flex-end">
//                         <MyButton onClick={onClose} variant="ghost">
//                             Cancel
//                         </MyButton>
//                         <MyButton
//                             onClick={handleRename}
//                             isDisabled={!newTitle.trim()}
//                         >
//                             Rename
//                         </MyButton>
//                     </MyFlex>
//                 </MyFlex>
//             }
//         />
//     );
// };

// const variants = {
//     default: {
//         padding: 2,
//         gap: 2,
//         fontSize: 'sm'
//     },
//     compact: {
//         padding: 1,
//         gap: 1,
//         fontSize: 'xs'
//     },
//     expanded: {
//         padding: 3,
//         gap: 3,
//         fontSize: 'md'
//     }
// };

// export const SessionListItem: FC<SessionListItemProps> = ({
//     session,
//     isActive = false,
//     onSelect,
//     onRename,
//     onDelete,
//     variant = 'default',
//     showActions = true
// }) => {
//     const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
//     const styles = variants[variant];

//     const handleClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         onSelect?.(session);
//     };

//     const handleDelete = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         onDelete?.(session);
//     };

//     const handleRenameClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         setIsRenameModalOpen(true);
//     };

//     return (
//         <>
//             <MyFlex
//                 direction="row"
//                 gap={styles.gap}
//                 p={styles.padding}
//                 align="center"
//                 justify="space-between"
//                 borderRadius="sm"
//                 bg={isActive ? 'bg.subtle' : 'transparent'}
//                 _hover={{
//                     bg: 'bg.muted'
//                 }}
//                 cursor="pointer"
//                 onClick={handleClick}
//                 className="noSelect"
//             >
//                 <MyFlex direction="row" gap={styles.gap} align="center">
//                     <SelectedIcons iconName="Comment" />
//                     <MyText fontSize={styles.fontSize} truncate lineClamp={2}>
//                         {session.title}
//                     </MyText>
//                 </MyFlex>

//                 {showActions && (
//                     <Menu.Root>
//                         <Menu.Trigger asChild>
//                             <MyButton
//                                 size="xs"
//                                 variant="plain"
//                                 onClick={(e) => e.stopPropagation()}
//                             >
//                                 <SelectedIcons iconName="MENU_DOTS" />
//                             </MyButton>
//                         </Menu.Trigger>
//                         <Portal>
//                             <Menu.Positioner>
//                                 <Menu.Content>
//                                     <Menu.Item
//                                         value="rename"
//                                         onClick={handleRenameClick}
//                                     >
//                                         <MyFlex
//                                             direction="row"
//                                             gap={2}
//                                             align="center"
//                                         >
//                                             <SelectedIcons iconName="EDIT" />
//                                             <MyText>Rename</MyText>
//                                         </MyFlex>
//                                     </Menu.Item>
//                                     <Menu.Item
//                                         value="delete"
//                                         onClick={handleDelete}
//                                     >
//                                         <MyFlex
//                                             direction="row"
//                                             gap={2}
//                                             align="center"
//                                         >
//                                             <SelectedIcons
//                                                 iconName="TRASH"
//                                                 color="red"
//                                             />
//                                             <MyText color="red">Delete</MyText>
//                                         </MyFlex>
//                                     </Menu.Item>
//                                 </Menu.Content>
//                             </Menu.Positioner>
//                         </Portal>
//                     </Menu.Root>
//                 )}
//             </MyFlex>

//             <RenameModal
//                 isOpen={isRenameModalOpen}
//                 onClose={() => setIsRenameModalOpen(false)}
//                 session={session}
//                 onRename={onRename || (() => {})}
//             />
//         </>
//     );
// };

// // Hook personalizado para manejar la lista de sesiones
// export const useSessionList = (initialSessions: Session[] = []) => {
//     const [sessions, setSessions] = useState<Session[]>(initialSessions);
//     const [activeSessionId, setActiveSessionId] = useState<string>();

//     const addSession = (session: Session) => {
//         setSessions((prev) => [...prev, session]);
//     };

//     const removeSession = (sessionId: string) => {
//         setSessions((prev) => prev.filter((s) => s.id !== sessionId));
//     };

//     const renameSession = (sessionId: string, newTitle: string) => {
//         setSessions((prev) =>
//             prev.map((s) =>
//                 s.id === sessionId ? { ...s, title: newTitle } : s
//             )
//         );
//     };

//     const selectSession = (sessionId: string) => {
//         setActiveSessionId(sessionId);
//     };

//     return {
//         sessions,
//         activeSessionId,
//         addSession,
//         removeSession,
//         renameSession,
//         selectSession
//     };
// };

// // Componente de lista de sesiones
// interface SessionListProps {
//     sessions: Session[];
//     activeSessionId?: string;
//     onSessionSelect?: (session: Session) => void;
//     onSessionRename?: (session: Session, newTitle: string) => void;
//     onSessionDelete?: (session: Session) => void;
//     variant?: SessionListItemProps['variant'];
// }

// export const SessionList: FC<SessionListProps> = ({
//     sessions,
//     activeSessionId,
//     onSessionSelect,
//     onSessionRename,
//     onSessionDelete,
//     variant = 'default'
// }) => {
//     return (
//         <MyFlex direction="column" gap={1}>
//             {sessions.map((session) => (
//                 <SessionListItem
//                     key={session.id}
//                     session={session}
//                     isActive={session.id === activeSessionId}
//                     onSelect={onSessionSelect}
//                     onRename={onSessionRename}
//                     onDelete={onSessionDelete}
//                     variant={variant}
//                 />
//             ))}
//         </MyFlex>
//     );
// };

// export default SessionListItem;
