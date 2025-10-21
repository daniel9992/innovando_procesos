// // components/message/MessageSource/MessageSource.tsx

// import { MyFlex, MyText } from '@src/customAgencyTool/components/ui';
// import { Ellipsis } from 'reablocks';
// import { type FC, useState } from 'react';
// import { twMerge } from 'tailwind-merge';

// export interface Source {
//     title: string;
//     url?: string;
//     image?: string;
//     description?: string;
//     type?: 'article' | 'video' | 'document' | 'code' | 'other';
//     metadata?: {
//         author?: string;
//         date?: string;
//         readTime?: string;
//         publisher?: string;
//     };
// }

// interface MessageSourceProps {
//     /**
//      * Source information
//      */
//     source: Source;

//     /**
//      * Custom styles for the component
//      */
//     className?: string;

//     /**
//      * Maximum length for title ellipsis
//      */
//     titleLimit?: number;

//     /**
//      * Whether to show metadata
//      */
//     showMetadata?: boolean;

//     /**
//      * Custom click handler
//      */
//     onClick?: (source: Source) => void;

//     /**
//      * Visual variant of the component
//      */
//     variant?: 'default' | 'compact' | 'expanded';

//     /**
//      * Whether to show preview
//      */
//     showPreview?: boolean;
// }

// const sourceTypeIcons = {
//     article: '📄',
//     video: '🎥',
//     document: '📑',
//     code: '💻',
//     other: '📎'
// };

// export const MessageSource: FC<MessageSourceProps> = ({
//     source,
//     className,
//     titleLimit = 50,
//     showMetadata = false,
//     onClick,
//     variant = 'default',
//     showPreview = false
// }) => {
//     const [isHovered, setIsHovered] = useState(false);

//     const handleClick = () => {
//         if (onClick) {
//             onClick(source);
//         } else if (source.url) {
//             window.open(source.url, '_blank', 'noopener,noreferrer');
//         }
//     };

//     const renderMetadata = () => {
//         if (!showMetadata || !source.metadata) return null;

//         return (
//             <MyFlex direction="row" gap={2} className="text-xs text-gray-500">
//                 {source.metadata.author && (
//                     <span>By {source.metadata.author}</span>
//                 )}
//                 {source.metadata.date && <span>• {source.metadata.date}</span>}
//                 {source.metadata.readTime && (
//                     <span>• {source.metadata.readTime} read</span>
//                 )}
//                 {source.metadata.publisher && (
//                     <span>• {source.metadata.publisher}</span>
//                 )}
//             </MyFlex>
//         );
//     };

//     const renderPreview = () => {
//         if (!showPreview || !isHovered) return null;

//         return (
//             <div className="absolute z-10 p-4 bg-white rounded-lg shadow-lg border border-gray-200 max-w-md">
//                 {source.image && (
//                     <img
//                         src={source.image}
//                         alt={source.title}
//                         className="w-full h-32 object-cover rounded-t-lg mb-2"
//                     />
//                 )}
//                 <MyText className="font-medium">{source.title}</MyText>
//                 {source.description && (
//                     <MyText className="text-sm text-gray-600 mt-1">
//                         {source.description}
//                     </MyText>
//                 )}
//                 {renderMetadata()}
//             </div>
//         );
//     };

//     const variants = {
//         default:
//             'p-4 border rounded-lg hover:bg-gray-50 transition-all duration-200',
//         compact: 'p-2 hover:bg-gray-50 transition-all duration-200',
//         expanded:
//             'p-6 border-2 rounded-xl hover:border-blue-500 transition-all duration-200'
//     };

//     return (
//         // <MyTooltip content={source.title}>
//         <div
//             className={twMerge(
//                 'relative cursor-pointer',
//                 variants[variant],
//                 className
//             )}
//             onClick={handleClick}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             <MyFlex direction="row" gap={3} align="center">
//                 <span className="text-2xl">
//                     {sourceTypeIcons[source.type || 'other']}
//                 </span>
//                 <MyFlex direction="column" gap={1} flex={1}>
//                     <MyText className="font-medium hover:text-blue-600 transition-colors">
//                         <Ellipsis value={source.title} limit={titleLimit} />
//                     </MyText>
//                     {variant !== 'compact' && (
//                         <>
//                             {source.url && (
//                                 <MyText className="text-sm text-gray-500 truncate">
//                                     {source.url}
//                                 </MyText>
//                             )}
//                             {renderMetadata()}
//                         </>
//                     )}
//                 </MyFlex>
//             </MyFlex>
//             {renderPreview()}
//         </div>
//         // </MyTooltip>
//     );
// };

// // Componente para múltiples fuentes
// interface MessageSourceListProps {
//     sources: Source[];
//     variant?: MessageSourceProps['variant'];
//     className?: string;
//     onSourceClick?: (source: Source) => void;
// }

// export const MessageSourceList: FC<MessageSourceListProps> = ({
//     sources,
//     variant = 'default',
//     className,
//     onSourceClick
// }) => {
//     return (
//         <MyFlex direction="column" gap={2} className={className}>
//             {sources.map((source, index) => (
//                 <MessageSource
//                     key={`source-${index}`}
//                     source={source}
//                     variant={variant}
//                     onClick={onSourceClick}
//                 />
//             ))}
//         </MyFlex>
//     );
// };

// // Hook personalizado para manejar fuentes
// export const useMessageSources = (initialSources: Source[] = []) => {
//     const [sources, setSources] = useState<Source[]>(initialSources);
//     const [selectedSource, setSelectedSource] = useState<Source | null>(null);

//     const addSource = (newSource: Source) => {
//         setSources((prev) => [...prev, newSource]);
//     };

//     const removeSource = (index: number) => {
//         setSources((prev) => prev.filter((_, i) => i !== index));
//     };

//     const updateSource = (index: number, updatedSource: Partial<Source>) => {
//         setSources((prev) =>
//             prev.map((source, i) =>
//                 i === index ? { ...source, ...updatedSource } : source
//             )
//         );
//     };

//     const selectSource = (source: Source) => {
//         setSelectedSource(source);
//     };

//     return {
//         sources,
//         selectedSource,
//         addSource,
//         removeSource,
//         updateSource,
//         selectSource
//     };
// };

// export default MessageSource;
