import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { ErrorMessage, type FieldProps } from 'formik';
import { useState, type FC } from 'react';
import {
    MyBox,
    MyButton,
    MyFlex,
    MyInputPassword,
    MyInputText,
    MyText,
    MyTooltip
} from '../../ui';

interface CustomInputProps {
    label?: string;
    Icon?: string;
    typeError?: 'top' | 'bottom' | 'none';
}

export const FormikInputPassword: FC<CustomInputProps & FieldProps> = ({
    label = '',
    Icon,
    typeError = 'top',
    field,
    form,
    ...props
}) => {
    const isError = form.touched[field.name] && form.errors[field.name];
    const [isVisible, setIsVisible] = useState(false);

    const renderErrorMessage = (position?: 'top' | 'bottom') => {
        if (!isError) return null;

        if (typeError === 'none') return null;

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
                py={1}
            >
                <SelectedIcons iconName="Alert" />
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
            {Icon && <SelectedIcons iconName={Icon} />}
            {label}
        </ChakraField.Label>
    );

    if (typeError === 'top') {
        return (
            <ChakraField.Root gap={1} {...props}>
                <MyBox pos="relative" w="full">
                    <MyInputPassword
                        className="peer"
                        border={isError ? '1px solid #921313' : ''}
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
            <MyFlex
                gap={1}
                direction={'row'}
                w="full"
                align={'center'}
                px={0}
                m={0}
            >
                <MyBox pos="relative" w="full" p={0} m={0}>
                    <MyInputText
                        className="peer"
                        placeholder=""
                        type={isVisible ? 'text' : 'password'}
                        border={isError ? '1px solid #921313' : ''}
                        {...field}
                    />

                    {renderLabel()}
                </MyBox>
                <MyButton
                    aria-label="toggle password visibility"
                    onClick={() => setIsVisible(!isVisible)}
                    size={'xs'}
                    right={'0px'}
                    colorPalette={'gray'}
                >
                    {isVisible ? (
                        <SelectedIcons iconName={'Unlock'} />
                    ) : (
                        <SelectedIcons iconName={'Lock'} />
                    )}
                </MyButton>
            </MyFlex>
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
    top: '-4',
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
        top: '-4',
        insetStart: '2'
    }
});
