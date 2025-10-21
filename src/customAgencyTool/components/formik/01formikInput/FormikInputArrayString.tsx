import type { typeIcons } from '@src/customAgencyTool/utils/iconSelected/iconTypes';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import type { FieldProps } from 'formik';
import type { FC, ReactNode } from 'react';
import { MyButton, MyFlex, MyInputText } from '../../ui';
import { RenderErrorMessage } from '../utils/renderErrorMessage';

interface CustomInputProps {
    titleNode?: ReactNode;
    label?: string;
    icon?: typeIcons;
    isReadOnly?: boolean;
    maxItems?: number;
    maxHeight?: string;
    placeholder?: string;
}

export const FormikInputArrayString: FC<CustomInputProps & FieldProps> = ({
    titleNode,
    label = '',
    icon,
    isReadOnly = false,
    maxItems = 10,
    maxHeight = '100px',
    placeholder = 'Escriba...',
    field,
    form,
    ...props
}) => {
    const { name, value } = field;
    const { setFieldValue, touched, errors } = form;

    const isError = touched[name] && errors[name];
    const pointerStyle = isReadOnly ? 'cursor-not-allowed' : 'cursor-text';

    // Usar el valor de Formik directamente en lugar de un estado local
    const arrayString = Array.isArray(value) ? value : [];

    const HandledOnAdd = () => {
        if (arrayString.length < maxItems) {
            setFieldValue(name, [...arrayString, '']);
        }
    };

    const HandledOnRemove = (index: number) => {
        const newArray = arrayString.filter((_, i) => i !== index);
        setFieldValue(name, newArray);
    };

    const HandledOnChange = (index: number, newValue: string) => {
        const newArray = arrayString.map((item, i) =>
            i === index ? newValue : item
        );
        setFieldValue(name, newArray);
    };

    const renderLabel = () => (
        <MyFlex direction={'row'} gap={1} alignItems={'center'}>
            {icon && <SelectedIcons iconName={icon} />}
            {label}
        </MyFlex>
    );

    return (
        <MyFlex direction={'column'} p={0}>
            <MyFlex
                direction={'row'}
                p={0}
                justifyContent={'space-between'}
                alignItems={'center'}
                borderRadius={'md'}
            >
                {titleNode ? titleNode : renderLabel()}
                <MyButton
                    aria-label="Add new item"
                    size="xs"
                    icon={'PLUS'}
                    variant={'plain'}
                    border={'2px dashed #7f8691'}
                    onClick={HandledOnAdd}
                    isDisabled={isReadOnly || arrayString.length >= maxItems}
                    title={
                        arrayString.length >= maxItems
                            ? 'Maximum items reached'
                            : 'Add new item'
                    }
                />
            </MyFlex>
            <MyFlex direction={'row'} p={0} position={'relative'}>
                <MyFlex
                    direction="row"
                    gap={2}
                    wrap="wrap"
                    alignItems="center"
                    mb={2}
                    borderRadius={'md'}
                    maxHeight={maxHeight}
                    overflow="auto"
                    width={'full'}
                    p={0}
                    {...props}
                >
                    {arrayString.map((item, index) => (
                        <MyFlex
                            key={`${name}-${index}`}
                            data-testid={`input-${name}-${index}`}
                            alignItems="center"
                            borderRadius="0.5rem"
                            overflow="hidden"
                            width={'full'}
                            p={0}
                            gap={0}
                        >
                            <MyInputText
                                data-testid={`input-${name}-${index}`}
                                value={item}
                                onChange={(e) =>
                                    HandledOnChange(index, e.target.value)
                                }
                                isDisabled={isReadOnly}
                                placeholder={`${index + 1}. ${placeholder}`}
                                // size="xs"
                                borderRightRadius={0}
                                borderLeftRadius={'0.5rem'}
                                cursor={pointerStyle}
                            />
                            <MyButton
                                aria-label="Remove item"
                                colorPalette={'danger'}
                                // size="xs"
                                icon={'CLOSE'}
                                onClick={() => HandledOnRemove(index)}
                                isDisabled={isReadOnly}
                                borderLeftRadius={0}
                            />
                        </MyFlex>
                    ))}
                </MyFlex>
                {/* {renderLabel()} */}
            </MyFlex>

            <MyFlex
                direction={'row'}
                gap={2}
                justifyContent={'center'}
                width={'100%'}
                p={0}
            >
                {arrayString.length >= maxItems && (
                    <small
                        style={{
                            color: 'red',
                            fontSize: '0.7em',
                            marginTop: '0.5em',
                            textAlign: 'center',
                            padding: '0px'
                        }}
                    >
                        <b>Máximo {maxItems} elementos permitidos</b>
                    </small>
                )}
            </MyFlex>
            <RenderErrorMessage
                name={field.name}
                position={'bottom'}
                isError={isError ? true : false}
                errorMessage={form.errors[field.name] as string}
            />
        </MyFlex>
    );
};
