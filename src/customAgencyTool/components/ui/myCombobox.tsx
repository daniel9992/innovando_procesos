import { useMemo, type FC } from 'react';
import Select, {
    components,
    type NoticeProps,
    type Props as SelectProps,
    type StylesConfig
} from 'react-select';
import { useColorModeValue } from './color-mode';
import { MyText } from './myText';

export interface Option {
    value: string;
    label: string;
    isDisabled?: boolean;
}

export interface GroupOption {
    readonly label: string;
    readonly options: readonly Option[];
}

interface MyComboboxProps<IsMulti extends boolean = false>
    extends Omit<SelectProps<Option, IsMulti, GroupOption>, 'styles'> {
    isError?: boolean;
    customStyles?: StylesConfig<Option, IsMulti, GroupOption>;
}

// Configuración de colores
interface ColorConfig {
    primary: string;
    secondary: string;
    error: string;
    text: {
        primary: string;
        secondary: string;
        disabled: string;
    };
    background: {
        primary: string;
        hover: string;
        selected: string;
        disabled: string;
    };
    border: {
        default: string;
        focus: string;
        hover: string;
        error: string;
    };
}

const NoOptionsMessage: FC<NoticeProps<Option>> = (props) => {
    const textColor = useColorModeValue('gray.600', 'gray.300');

    return (
        <components.NoOptionsMessage {...props}>
            <MyText
                fontWeight="semibold"
                color={textColor}
                fontSize="sm"
                textAlign="center"
            >
                {typeof props.selectProps.noOptionsMessage === 'function'
                    ? props.selectProps.noOptionsMessage({ inputValue: '' })
                    : props.selectProps.noOptionsMessage ||
                      'No se encontraron opciones'}
            </MyText>
        </components.NoOptionsMessage>
    );
};

export const MyCombobox = <IsMulti extends boolean = false>({
    isError = false,
    customStyles: propStyles,
    ...props
}: MyComboboxProps<IsMulti>) => {
    // Configuración de colores según el modo

    const primary = useColorModeValue('#2684FF', '#4C9AFF');
    const secondary = useColorModeValue('#deebff', '#2D3748');
    const error = useColorModeValue('#E53E3E', '#FC8181');
    const textPrimary = useColorModeValue('#1A202C', '#FFFFFF');
    const textSecondary = useColorModeValue('#4A5568', '#CBD5E0');
    const textDisabled = useColorModeValue('#A0AEC0', '#718096');

    const backgroundPrimary = useColorModeValue('#FFFFFF', '#1A202C');
    const backgroundHover = useColorModeValue('#EDF2F7', '#2D3748');
    const backgroundSelected = useColorModeValue('#deebff', '#4C9AFF');
    const backgroundDisabled = useColorModeValue('#EDF2F7', '#2D3748');

    const borderDefault = useColorModeValue('#E2E8F0', '#2D3748');
    const borderFocus = useColorModeValue('#2684FF', '#4C9AFF');
    const borderHover = useColorModeValue('#CBD5E0', '#4A5568');
    const borderError = useColorModeValue('#E53E3E', '#FC8181');

    const colors = useMemo((): ColorConfig => {
        return {
            primary: primary,
            secondary: secondary,
            error: error,
            text: {
                primary: textPrimary,
                secondary: textSecondary,
                disabled: textDisabled
            },
            background: {
                primary: backgroundPrimary,
                hover: backgroundHover,
                selected: backgroundSelected,
                disabled: backgroundDisabled
            },
            border: {
                default: borderDefault,
                focus: borderFocus,
                hover: borderHover,
                error: borderError
            }
        };
    }, [
        primary,
        secondary,
        error,
        textPrimary,
        textSecondary,
        textDisabled,
        backgroundPrimary,
        backgroundHover,
        backgroundSelected,
        backgroundDisabled,
        borderDefault,
        borderFocus,
        borderHover,
        borderError
    ]);

    const styles = useMemo(
        (): StylesConfig<Option, IsMulti, GroupOption> => ({
            control: (base, state) => ({
                ...base,
                backgroundColor: colors.background.primary,
                borderColor: isError
                    ? colors.border.error
                    : state.isFocused
                    ? colors.border.focus
                    : colors.border.default,
                boxShadow: isError
                    ? `0 0 0 1px ${colors.border.error}`
                    : state.isFocused
                    ? `0 0 0 1px ${colors.border.focus}`
                    : 'none',
                '&:hover': {
                    borderColor: isError
                        ? colors.border.error
                        : colors.border.hover
                },
                transition: 'all 0.2s'
            }),
            option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                    ? colors.primary
                    : state.isFocused
                    ? colors.secondary
                    : colors.background.primary,
                color: state.isSelected
                    ? colors.text.primary
                    : state.isDisabled
                    ? colors.text.disabled
                    : colors.text.primary,
                cursor: state.isDisabled ? 'not-allowed' : 'default',
                '&:active': {
                    backgroundColor: colors.background.selected
                }
            }),
            menu: (base) => ({
                ...base,
                backgroundColor: colors.background.primary,
                border: `1px solid ${colors.border.default}`,
                boxShadow:
                    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }),
            input: (base) => ({
                ...base,
                color: colors.text.primary
            }),
            singleValue: (base) => ({
                ...base,
                color: colors.text.primary
            }),
            multiValue: (base) => ({
                ...base,
                backgroundColor: colors.secondary
            }),
            multiValueLabel: (base) => ({
                ...base,
                color: colors.text.primary
            }),
            multiValueRemove: (base) => ({
                ...base,
                color: colors.text.secondary,
                '&:hover': {
                    backgroundColor: colors.background.hover,
                    color: colors.text.primary
                }
            }),
            indicatorSeparator: (base) => ({
                ...base,
                backgroundColor: colors.border.default
            }),
            dropdownIndicator: (base) => ({
                ...base,
                color: colors.text.secondary,
                '&:hover': {
                    color: colors.text.primary
                }
            }),
            clearIndicator: (base) => ({
                ...base,
                color: colors.text.secondary,
                '&:hover': {
                    color: colors.text.primary
                }
            }),
            ...propStyles
        }),
        [colors, isError, propStyles]
    );

    return (
        <div
            style={{
                width: '100%'
            }}
        >
            <Select<Option, IsMulti, GroupOption>
                {...props}
                styles={styles}
                components={{
                    NoOptionsMessage: NoOptionsMessage as React.ComponentType<
                        NoticeProps<Option, IsMulti, GroupOption>
                    >
                }}
            />
        </div>
    );
};
