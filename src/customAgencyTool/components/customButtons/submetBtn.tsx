import { useDialog } from '@src/customAgencyTool/context/appAlertDialog/useDialog';
import { isEmptyObject } from '@src/customAgencyTool/utils/objects/isEmptyObj';
import { type FC, type ReactNode } from 'react';
import { MyButton, MyFlex, MyText } from '../ui';
import { formatErrorList } from './formatErrorList';

type IconType = string; // o el tipo específico que uses para los íconos

interface SubmitButtonProps {
    icon?: IconType;
    label: string;
    onClick: () => void;
    errors?: Record<string, any>;
    isError?: boolean;
    isLoading?: boolean;
    isFloating?: boolean;
}

const FloatingWrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <MyFlex
        position="fixed"
        bottom="6rem"
        display="inline"
        zIndex={10}
        right="5rem"
    >
        <MyFlex>{children}</MyFlex>
    </MyFlex>
);

const BaseSubmitButton: FC<Omit<SubmitButtonProps, 'isFloating'>> = ({
    icon,
    label,
    onClick,
    isError,
    isLoading
}) => (
    <MyButton
        isError={isError}
        colorPalette={'submit'}
        rightIcon={icon}
        onClick={onClick}
        type="submit"
        loading={isLoading}
    >
        {label}
    </MyButton>
);

const SubmitButton: FC<SubmitButtonProps> = ({
    isFloating,
    errors,
    ...props
}) => {
    const { showDialog } = useDialog();

    const buttonProps = {
        ...props
        // isError: props.isError || props.isLoading // mantiene la lógica original donde isLoading depende de isError
        // isLoading: props.isError // mantiene la lógica original donde isLoading depende de isError
    };

    const renderButton = () => {
        if (errors !== undefined && !isEmptyObject(errors)) {
            return (
                <MyButton
                    colorPalette={'danger'}
                    leftIcon={'ERROR'}
                    onClick={async () => {
                        const formattedErrors = formatErrorList(errors);

                        const someDialog = await showDialog({
                            title: 'Importante',
                            message: (
                                <MyFlex direction={'column'} gap={2}>
                                    <MyText fontWeight={'semibold'}>
                                        Campos que requiere su atención
                                    </MyText>

                                    <MyFlex direction={'column'} gap={4}>
                                        {formattedErrors.map((error, index) => (
                                            <MyText
                                                key={`errorList-` + index}
                                                // color={'#919aa7'}
                                                bg={'bg.muted'}
                                                borderRadius={'md'}
                                                p={1}
                                                px={3}
                                                _hover={{
                                                    boxShadow: 'md'
                                                }}
                                            >
                                                {error}
                                            </MyText>
                                        ))}
                                    </MyFlex>
                                </MyFlex>
                            ),
                            buttons: [
                                {
                                    label: 'Cerrar',
                                    value: false,
                                    colorPalette: 'red',
                                    iconLeft: 'ERROR'
                                }
                            ]
                        });

                        if (someDialog) {
                            // console.log('Dialog closed');
                        }
                    }}
                >
                    Hay campos que no están completos
                </MyButton>
            );
        }

        return <BaseSubmitButton {...buttonProps} />;
    };

    if (isFloating) {
        return <FloatingWrapper>{renderButton()}</FloatingWrapper>;
    }

    return <>{renderButton()};</>;
};

export default SubmitButton;
