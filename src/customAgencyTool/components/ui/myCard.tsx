import {
    Card,
    Heading,
    Image,
    type CardRootProps
} from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';

interface Props {
    url?: string;
    alt?: string;

    variant?: 'subtle' | 'outline' | 'elevated';
    size?: 'sm' | 'md' | 'lg';

    header?: ReactNode;
    body: ReactNode;
    footer?: ReactNode;
}

export const MyCard: FC<Props & CardRootProps> = ({
    url,
    alt,
    variant = 'subtle',
    size = 'sm',
    header,
    body,
    footer,
    ...props
}) => {
    return (
        <Card.Root variant={variant} size={size} {...props}>
            {url && (
                <Image
                    src={url}
                    alt={alt}
                    objectFit="cover"
                    maxW="200px"
                />
            )}
            <Card.Header>
                {typeof header === 'string' ? (
                    <Heading size="md">{header}</Heading>
                ) : (
                    header
                )}
            </Card.Header>
            <Card.Body color="fg.muted">{body}</Card.Body>
            {footer && (
                <Card.Footer color="fg.muted">{footer}</Card.Footer>
            )}
        </Card.Root>
    );
};
