// // components/file/FileIcon.tsx

// import { MyFlex, MyText } from '@src/customAgencyTool/components/ui';
// import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
// import type { ConversationFile } from 'reachat';
// import type { FC, ReactNode } from 'react';

// interface ShowIconPerFileProps {
//     file: ConversationFile;
// }

// const FileIcon: FC<ShowIconPerFileProps> = ({ file }) => {
//     const splitText = file.name.split('.');
//     const prefix = '.' + splitText[splitText.length - 1];

//     const Wrapper: FC<{
//         children: ReactNode;
//     }> = ({ children }) => (
//         <MyFlex direction={'row'} gap={2} p={0} px={2} align={'center'}>
//             {children}
//         </MyFlex>
//     );

//     const text = (name: string) => (
//         <MyText fontSize={'xs'} fontWeight={'semibold'}>
//             {name}
//         </MyText>
//     );

//     const fileTypes = {
//         image: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.bmp'],
//         video: ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.webm'],
//         audio: ['.mp3', '.wav', '.aac', '.flac', '.ogg'],
//         pdf: ['.pdf'],
//         word: ['.doc', '.docx', '.rtf', '.txt', '.odt'],
//         excel: ['.xls', '.xlsx', '.csv', '.ods'],
//         powerpoint: ['.ppt', '.pptx', '.odp'],
//         code: ['.js', '.ts', '.py', '.java', '.c', '.cpp', '.cs'],
//         text: ['.txt', '.rtf', '.odt']
//     };

//     const getFileIcon = () => {
//         for (const [type, extensions] of Object.entries(fileTypes)) {
//             if (extensions.includes(prefix)) {
//                 return type.charAt(0).toUpperCase() + type.slice(1);
//             }
//         }
//         return 'File';
//     };

//     const iconName = getFileIcon();

//     return (
//         <Wrapper>
//             <SelectedIcons iconName={iconName} />
//             {text(file.name)}
//         </Wrapper>
//     );
// };

// export default FileIcon;
