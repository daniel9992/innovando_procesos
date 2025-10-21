import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';

import { ErrorMessage, type FieldProps } from 'formik';
import { type FC } from 'react';
import { MyBox, MyFlex, MyText, MyTooltip } from '../../ui';
import { MyInputTextArea } from '../../ui/myInputTextArea';

interface CustomInputProps {
    label?: string;
    icon?: string;
    typeError?: 'top' | 'bottom';
    height?: string;
    isDisabled?: boolean;
    placeHolder?: string;
}

export const FormikInputTextArea: FC<CustomInputProps & FieldProps> = ({
    label = '',
    icon,
    typeError = 'top',
    height = '100px',
    isDisabled = false,
    placeHolder = '',
    field,
    form,
    ...props
}) => {
    const isError = form.touched[field.name] && form.errors[field.name];

    const renderErrorMessage = (position?: 'top' | 'bottom') => {
        if (!isError) return null;

        if (position === 'top') {
            return (
                <MyTooltip
                    showArrow={true}
                    portalled={true}
                    content={form.errors[field.name] as string}
                    positioning={{ placement: 'left' }}
                >
                    <MyFlex
                        position={'absolute'}
                        top={'-15px'}
                        right={'-15px'}
                        borderRadius={'10px'}
                        bg={'red'}
                        p={1.5}
                        gap={2}
                        align={'center'}
                        color={'#ffff'}
                        boxShadow={'0 0 0 1px #921313'}
                    >
                        <SelectedIcons iconName="Alert" />
                    </MyFlex>
                </MyTooltip>
            );
        }

        return (
            <MyFlex
                direction={'row'}
                gap={2}
                align={'center'}
                color={'#921313'}
                bg={'rgba(255, 255, 255, 0.1)'}
                borderRadius={'0px'}
                p={0}
                px={2}
            >
                <MyFlex px={0} mx={0}>
                    <SelectedIcons iconName="Alert" />
                </MyFlex>
                <ErrorMessage name={field.name}>
                    {(msg) => (
                        <MyText fontSize={'0.8rem'} fontWeight={'semibold'}>
                            {msg}
                        </MyText>
                    )}
                </ErrorMessage>
            </MyFlex>
        );
    };

    const renderLabel = () => (
        <ChakraField.Label css={floatingStyles} truncate>
            {icon && <SelectedIcons iconName={icon} />}
            {label}
        </ChakraField.Label>
    );

    if (typeError === 'top') {
        return (
            <ChakraField.Root gap={1} {...props}>
                <MyBox pos="relative" w="full" p={0} m={0}>
                    <MyInputTextArea
                        id={field.name}
                        data-testid={field.name}
                        key={'key-input-' + field.name}
                        className="peer"
                        isDisabled={isDisabled}
                        placeholder={placeHolder}
                        height={height}
                        border={
                            isError ? '1px solid #921313' : '1px solid blue.100'
                        }
                        {...field}
                    />
                    {renderLabel()}
                </MyBox>

                {renderErrorMessage('top')}
            </ChakraField.Root>
        );
    }

    return (
        <ChakraField.Root gap={1} {...props}>
            <MyBox pos="relative" w="full" p={0} m={0}>
                <MyInputTextArea
                    id={field.name}
                    data-testid={field.name}
                    key={'key-input-' + field.name}
                    className="peer"
                    isDisabled={isDisabled}
                    placeholder={placeHolder}
                    height={height}
                    border={
                        isError ? '1px solid #921313' : '1px solid blue.100'
                    }
                    {...field}
                />

                {renderLabel()}
            </MyBox>
            {renderErrorMessage('bottom')}
        </ChakraField.Root>
    );
};

const floatingStyles = defineStyle({
    pos: 'absolute',
    // bg: 'bg',
    bg: 'bg.muted',
    px: '0.5rem',
    borderRadius: '5px',
    top: '-3',
    insetStart: '2',
    fontWeight: 'normal',
    pointerEvents: 'none',
    transition: 'position',
    _peerPlaceholderShown: {
        color: 'fg.muted',
        top: '2.5',
        insetStart: '3'
    },
    _peerFocusVisible: {
        color: 'fg',
        top: '-3',
        insetStart: '2'
    }
});
