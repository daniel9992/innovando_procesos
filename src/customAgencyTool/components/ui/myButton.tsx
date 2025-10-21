import type { ButtonProps as ChakraButtonProps } from '@chakra-ui/react';
import {
    AbsoluteCenter,
    Button as ChakraButton,
    Span,
    Spinner
} from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { forwardRef, useMemo, type ReactNode } from 'react';

type ColorPalette =
    | 'submit'
    | 'delete'
    | 'cancel'
    | 'accept'
    | 'warning'
    | 'info'
    | string;

interface ButtonLoadingProps {
    loading?: boolean;
    loadingText?: ReactNode;
    leftIcon?: string;
    rightIcon?: string;
    icon?: string;
    colorPalette?: ColorPalette;
    isDisabled?: boolean | (() => boolean);
    url?: string;
    openInNewTab?: boolean;
    isError?: boolean;
}

export type ButtonProps = ChakraButtonProps & ButtonLoadingProps;

const COLOR_SCHEMES: Record<
    ColorPalette,
    {
        bg: string;
        color: string;
        hoverBg: string;
        variant?:
            | 'solid'
            | 'subtle'
            | 'surface'
            | 'outline'
            | 'ghost'
            | 'plain';
    }
> = {
    submit: {
        bg: 'blue.500',
        color: 'white',
        hoverBg: 'blue.600'
    },
    active: {
        bg: 'blue.500',
        color: 'white',
        hoverBg: 'blue.600'
    },
    delete: {
        bg: 'red.500',
        color: 'white',
        hoverBg: 'red.600'
    },
    cancel: {
        bg: 'gray.500',
        color: 'white',
        hoverBg: 'gray.600'
    },
    accept: {
        bg: 'blue.500',
        color: 'white',
        hoverBg: 'blue.600'
    },
    warning: {
        bg: 'orange.500',
        color: 'white',
        hoverBg: 'orange.600'
    },
    success: {
        bg: '#66bfbf',
        color: 'white',
        hoverBg: '#488a8a'
    },
    danger: {
        bg: 'red.500',
        color: 'white',
        hoverBg: 'red.600'
    },
    info: {
        bg: 'cyan.500',
        color: 'white',
        hoverBg: 'cyan.600'
    },
    gray: {
        bg: 'gray.400',
        color: 'white',
        hoverBg: 'gray.600'
    },
    aside: {
        bg: 'transparent',
        color: 'white',
        hoverBg: 'gray.600'
    },
    calendar: {
        bg: 'orange.500',
        color: 'white',
        hoverBg: 'orange.600'
    },
    selected: {
        bg: 'blue.500',
        color: 'white',
        hoverBg: 'blue.600'
    },
    unselected: {
        bg: 'gray.500',
        color: 'white',
        hoverBg: 'gray.600'
    },
    refresh: {
        bg: 'transparent',
        color: '#2c3d8a',
        hoverBg: '#2c3d8a8b',
        variant: 'ghost'
    },
    edit: {
        bg: 'blue.500',
        color: 'white',
        hoverBg: 'blue.600'
    },
    air: {
        bg: '#e7eaf6',
        color: 'black',
        hoverBg: '#e7eaf6'
    },
    sea: {
        bg: 'blue.500',
        color: 'white',
        hoverBg: 'blue.600'
    },
    roa: {
        bg: '#976841',
        color: 'white',
        hoverBg: '#7c5e44'
    },
    proformainvoice: {
        bg: '#007bff',
        color: 'white',
        hoverBg: '#0069d9'
    },
    law: {
        bg: 'gray.500',
        color: 'white',
        hoverBg: 'gray.600'
    },
    add: {
        bg: 'blue.500',
        color: 'white',
        hoverBg: 'blue.600'
    },
    print: {
        bg: 'orange.500',
        color: 'white',
        hoverBg: 'orange.600',
        variant: 'solid'
    },
    agenda: {
        bg: 'orange.600',
        color: 'white',
        hoverBg: 'orange.800',
        variant: 'solid'
    },
    upload: {
        bg: 'purple.500',
        color: 'white',
        hoverBg: 'purple.800',
        variant: 'solid'
    },
    download: {
        bg: 'cyan.500',
        color: 'white',
        hoverBg: 'cyan.800',
        variant: 'solid'
    },
    ORDERTRACKING: {
        bg: 'blue.500',
        color: 'white',
        hoverBg: 'blue.600',
        variant: 'solid'
    },
    DUCAT: {
        bg: 'yellow.500',
        color: 'black',
        hoverBg: 'yellow.600',
        variant: 'solid'
    },
    TRANSPORTATION: {
        bg: 'green.500',
        color: 'white',
        hoverBg: 'green.600',
        variant: 'solid'
    },
    SUPPLIERSCONTROL: {
        bg: 'blue.500',
        color: 'white',
        hoverBg: 'blue.600',
        variant: 'solid'
    },
    xlsx: {
        bg: 'teal.500',
        color: 'white',
        hoverBg: 'teal.600',
        variant: 'solid'
    },
    pdf: {
        bg: 'red.400',
        color: 'white',
        hoverBg: 'red.500',
        variant: 'solid'
    },
    ask: {
        bg: '#9112BC',
        color: 'white',
        hoverBg: '#AE75DA',
        variant: 'solid'
    }
};

/**
 * Button
 * @param props  ButtonLoadingProps & ButtonProps
 * @param props  ButtonLoadingProps:
 * @param loading show loading spinner effect
 * @param loadingText text to show while loading
 * @param leftIcon show icon on left
 * @param rightIcon show icon on right
 * @param icon show icon if MyButton is use like iconButton
 * @param rightIcon show icon on right
 * @param colorPalette color of button
 * @param isDisabled disable button
 * @param url navigate to url
 * @param ref
 * @returns
 */
export const MyButton = forwardRef<HTMLButtonElement, ButtonProps>(
    function Button(props, ref) {
        const {
            loading = false,
            disabled = false,
            isDisabled = false,
            loadingText,
            children,
            leftIcon,
            rightIcon,
            icon,
            colorPalette = '',
            size = 'sm',
            variant = 'solid',
            url,
            openInNewTab = false,
            isError,
            ...rest
        } = props;

        const isDisabledLocaly = useMemo(() => {
            if (typeof isDisabled === 'function') {
                return isDisabled();
            }

            return isDisabled;
        }, [isDisabled]);

        const colorSchema = useMemo(() => {
            if (isError) {
                return {
                    color: 'white',
                    bg: 'red.500',
                    _hover: {
                        bg: 'red.600',
                        transform: 'scale(98%)',
                        transition: 'all 0.2s ease-in-out'
                    },
                    _active: {
                        transform: 'scale(0.98)'
                    },
                    _disabled: {
                        opacity: 0.6,
                        cursor: 'not-allowed',
                        _hover: {
                            transform: 'none'
                        }
                    }
                };
            }

            // Si colorPalette es una clave de COLOR_SCHEMES, usa esos valores
            if (colorPalette in COLOR_SCHEMES) {
                const scheme =
                    COLOR_SCHEMES[colorPalette as keyof typeof COLOR_SCHEMES];

                return {
                    variant: scheme.variant,
                    color: scheme.color,
                    bg: scheme.bg,
                    _hover: {
                        bg: scheme.hoverBg,
                        transform: 'scale(98%)',
                        transition: 'all 0.2s ease-in-out'
                    },
                    _active: {
                        transform: 'scale(0.98)'
                    },
                    _disabled: {
                        opacity: 0.6,
                        cursor: 'not-allowed',
                        _hover: {
                            transform: 'none'
                        }
                    }
                };
            }

            // Si no está en COLOR_SCHEMES, usa el color como un color de Chakra

            return {
                // color: 'white',
                // bg: `${colorPalette}.500`,
                colorPalette,
                _hover: {
                    // bg: `${colorPalette}.600`,
                    transform: 'scale(98%)',
                    transition: 'all 0.2s ease-in-out'
                },
                _active: {
                    transform: 'scale(0.98)'
                },
                _disabled: {
                    opacity: 0.6,
                    cursor: 'not-allowed',
                    _hover: {
                        transform: 'none'
                    }
                }
            };
        }, [colorPalette, isError]);

        const renderContent = () => {
            if (loading && !loadingText) {
                return (
                    <>
                        <AbsoluteCenter display="inline-flex">
                            <Spinner size="inherit" color="inherit" />
                        </AbsoluteCenter>
                        <Span opacity={0}>{children}</Span>
                    </>
                );
            }

            if (loading && loadingText) {
                return (
                    <>
                        <Spinner size="inherit" color="inherit" mr={2} />
                        {loadingText}
                    </>
                );
            }

            if (url) {
                return (
                    <a
                        href={url}
                        rel="noopener noreferrer"
                        target={
                            openInNewTab
                                ? // Opens the linked document in a new window or tab
                                  '_blank'
                                : // Opens the linked document in the same frame as it was clicked (this is default)
                                  '_self'
                        }
                    >
                        {leftIcon && (
                            <SelectedIcons iconName={leftIcon} mr={2} />
                        )}
                        {children}
                        {rightIcon && (
                            <SelectedIcons iconName={rightIcon} ml={2} />
                        )}
                        {icon && <SelectedIcons iconName={icon} mx={2} />}
                    </a>
                );
                // return (
                //     <Link to={url}>
                //         {leftIcon && (
                //             <SelectedIcons iconName={leftIcon} mr={2} />
                //         )}
                //         {children}
                //         {rightIcon && (
                //             <SelectedIcons iconName={rightIcon} ml={2} />
                //         )}
                //         {icon && <SelectedIcons iconName={icon} mx={2} />}
                //     </Link>
                // );
            }

            return (
                <>
                    {leftIcon && <SelectedIcons iconName={leftIcon} mr={2} />}
                    {children}
                    {rightIcon && <SelectedIcons iconName={rightIcon} ml={2} />}
                    {icon && <SelectedIcons iconName={icon} mx={2} />}
                </>
            );
        };

        if (url) {
            return (
                <ChakraButton
                    disabled={loading || disabled || isDisabledLocaly}
                    ref={ref}
                    size={size}
                    variant={variant}
                    asChild
                    {...colorSchema}
                    {...rest}
                >
                    {renderContent()}
                </ChakraButton>
            );
        }

        return (
            <ChakraButton
                disabled={loading || disabled || isDisabledLocaly}
                ref={ref}
                size={size}
                variant={variant}
                {...colorSchema}
                {...rest}
            >
                {renderContent()}
            </ChakraButton>
        );
    }
);
