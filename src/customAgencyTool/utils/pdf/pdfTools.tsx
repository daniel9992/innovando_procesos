import type { FC, JSX, ReactElement, ReactNode } from 'react';
import { Children, Fragment } from 'react';

// Función para dividir los hijos de un elemento en un array de ReactNodes
export const DividerElements = (element: JSX.Element): ReactNode[] => {
    try {
        if (!element.props) {
            return [];
        }

        const children = Children.toArray(element.props.children);
        if (children.length > 0) {
            return children;
        } else {
            console.warn('El elemento no tiene hijos.');
            return [];
        }
    } catch (error) {
        console.error(error);
        return [];
    }
};

interface IMergePagesProps {
    document: ReactNode; // Cambiado a JSX.Element para que el tipo sea más específico
    newElement: ReactNode;
}

// Componente para combinar páginas de un documento con un nuevo elemento
export const MergePages: FC<IMergePagesProps> = ({
    document,
    newElement
}): ReactElement => {
    try {
        const arrayDocs = DividerElements(document as JSX.Element);

        arrayDocs.push(newElement);

        return (
            <>
                {arrayDocs.map((element, index) => (
                    <Fragment key={`reactFragment-${index}`}>
                        {element}
                    </Fragment>
                ))}
            </>
        );
    } catch (error) {
        console.error(error);
        return <></>;
    }
};
