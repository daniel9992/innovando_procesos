import type { ReactElement, ReactNode } from 'react';

export interface PdfProps {
    arrayOfPages?: ReactNode;
    howManyPages: number;
    pageList: ReactElement[] | undefined;
    pdfName: string;
    isTranslate?: boolean;
}
