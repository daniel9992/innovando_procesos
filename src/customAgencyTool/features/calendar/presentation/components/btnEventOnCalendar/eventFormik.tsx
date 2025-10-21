import { useBreakpointValue } from '@chakra-ui/react';
import { FormikInputText } from '@src/customAgencyTool/components/formik';
import { FormikInputDate } from '@src/customAgencyTool/components/formik/01formikInput/formikInputDate';
import { FormikInputDateHour } from '@src/customAgencyTool/components/formik/01formikInput/formikInputDateHour';
import { FormikInputTextArea } from '@src/customAgencyTool/components/formik/01formikInput/formikInputTextArea';
import {
    MyButton,
    MyFlex,
    MySwitch,
    MyText
} from '@src/customAgencyTool/components/ui';
import FormikInputCategory from '@src/customAgencyTool/features/calendar/presentation/components/btnEventOnCalendar/formikInputCategory';
import FormikInputCurrentUsers from '@src/customAgencyTool/features/userAdmin/presentation/components/formikInputCurrentUsers/formikInputCurrentUsers';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import dayjs from 'dayjs';
import {
    Field,
    Form,
    Formik,
    type FormikHelpers,
    type FormikProps
} from 'formik';
import { useState, type FC } from 'react';
import {
    calendarEventSchema,
    type InterfaceCalendarEvent
} from '../../../domain/calendarEvent.entity';

/**
 *  ? -----------------------------
 *  *  Render - Formik
 *  ? -----------------------------
 */
interface RenderProps {
    initialValues: InterfaceCalendarEvent;
    onSubmit: (
        values: InterfaceCalendarEvent,
        formikHelpers: FormikHelpers<InterfaceCalendarEvent>
    ) => void;
    isShowDeleteBtn: boolean;
    onDelete: (event: InterfaceCalendarEvent) => Promise<void>;
}

const RenderFormik: FC<RenderProps> = ({
    initialValues,
    onSubmit,
    isShowDeleteBtn,
    onDelete
}) => {
    const [isDelete, setIsDelete] = useState(false);

    const textAline = useBreakpointValue({
        base: 'left',
        md: 'right'
    });

    const handledOnSubmit = (
        values: InterfaceCalendarEvent,
        formikHelpers: FormikHelpers<InterfaceCalendarEvent>
    ) => {
        // console.log('values', values);
        // varias reglas
        // 1. el minimo entre startDate y endDate es de 1 hora
        const { startDate, endDate, isAllDay } = values;
        const copyValues = { ...values };

        if (!isAllDay) {
            const start = dayjs(startDate);
            const end = dayjs(endDate);
            if (start.isSame(end)) {
                formikHelpers.setFieldError(
                    'endDate',
                    'Debe ser diferente a la de inicio'
                );
                return;
            }
            if (start.isAfter(end)) {
                formikHelpers.setFieldError(
                    'endDate',
                    'Debe ser posterior a la de inicio'
                );
                return;
            }
        } else {
            // set start like start 00:00
            copyValues.startDate = dayjs(startDate)
                .set('hour', 0)
                .set('minute', 0)
                .set('second', 0)
                .toDate();

            // set end like end 23:59
            copyValues.endDate = dayjs(endDate)
                .set('hour', 23)
                .set('minute', 59)
                .set('second', 59)
                .toDate();
        }

        onSubmit(copyValues, formikHelpers);
    };

    const GoToPage = (path: string) => {
        // console.log('path', path);
        window.open(path, '_blank');
    };

    const handledOnDelete = async (event: InterfaceCalendarEvent) => {
        setIsDelete(true);
        await onDelete(event);
        setIsDelete(false);
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={calendarEventSchema}
                onSubmit={handledOnSubmit}
            >
                {(props: FormikProps<InterfaceCalendarEvent>) => (
                    <Form>
                        <MyFlex gap={3}>
                            <MyText textAlign={textAline} width={'140px'}>
                                Titulo:
                            </MyText>
                            <Field name="title" component={FormikInputText} />
                        </MyFlex>

                        <MyFlex gap={3}>
                            <MyText textAlign={textAline} width={'140px'}>
                                Descripción:
                            </MyText>
                            <Field
                                name="description"
                                height={'150px'}
                                component={FormikInputTextArea}
                            />
                        </MyFlex>

                        <MyFlex gap={3}>
                            <MyText textAlign={textAline} width={'140px'}>
                                Categoría:
                            </MyText>
                            <Field
                                name="category"
                                // label='Categoria'
                                // Icon='CATEGORY'
                                maxLength={3}
                                component={FormikInputCategory}
                            />
                        </MyFlex>

                        <MyFlex gap={3} mb={3} mt={5}>
                            <MyText textAlign={textAline} width={'140px'}>
                                Duración:
                            </MyText>
                            <MyFlex
                                direction={'column'}
                                gap={1}
                                width={'100%'}
                                p={0}
                                m={0}
                            >
                                <MyFlex
                                    direction={{
                                        base: 'column',
                                        md: 'row'
                                    }}
                                    gap={1}
                                    p={0}
                                    m={0}
                                >
                                    {props.values.isAllDay && (
                                        <MyFlex
                                            direction={'row'}
                                            gap={2}
                                            p={0}
                                            m={0}
                                        >
                                            <Field
                                                label="Inicia"
                                                icon={'CALENDAR'}
                                                name="startDate"
                                                component={FormikInputDate}
                                                size={'sm'}
                                                onChange={(date: Date) => {
                                                    console.log('date', date);
                                                    props.setFieldValue(
                                                        'endDate',
                                                        date
                                                    );
                                                }}
                                            />
                                            <Field
                                                label="Fin"
                                                icon={'CALENDAR'}
                                                name="endDate"
                                                size={'sm'}
                                                component={FormikInputDate}
                                            />
                                        </MyFlex>
                                    )}
                                    {!props.values.isAllDay && (
                                        <MyFlex
                                            direction={{
                                                base: 'column',
                                                md: 'row'
                                            }}
                                            gap={2}
                                            p={0}
                                            m={0}
                                        >
                                            <MyFlex flex={1}>
                                                <Field
                                                    label="Día"
                                                    icon={'CALENDAR'}
                                                    name="startDate"
                                                    component={FormikInputDate}
                                                    size={'sm'}
                                                />
                                            </MyFlex>
                                            <MyFlex
                                                flex={1}
                                                direction={'row'}
                                                gap={2}
                                                height={'100%'}
                                            >
                                                <Field
                                                    label="Inicia"
                                                    name="startDate"
                                                    size={'sm'}
                                                    component={
                                                        FormikInputDateHour
                                                    }
                                                    onChange={(date: Date) => {
                                                        console.log(
                                                            'date',
                                                            date
                                                        );
                                                        // sumarle una hora al endDate
                                                        const endDate = dayjs(
                                                            date
                                                        )
                                                            .add(1, 'hour')
                                                            .toDate();
                                                        props.setFieldValue(
                                                            'endDate',
                                                            endDate
                                                        );
                                                    }}
                                                />
                                                <MyFlex
                                                    alignContent={'center'}
                                                    alignItems={'center'}
                                                    bg={'red`'}
                                                >
                                                    <SelectedIcons iconName="ArrowRight" />
                                                </MyFlex>
                                                <Field
                                                    label="Fin"
                                                    name="endDate"
                                                    size={'sm'}
                                                    component={
                                                        FormikInputDateHour
                                                    }
                                                />
                                            </MyFlex>
                                        </MyFlex>
                                    )}
                                </MyFlex>

                                <MySwitch
                                    key="isAllDay"
                                    label="Todo el Día"
                                    checked={props.values.isAllDay}
                                    onCheckedChange={(check: boolean) => {
                                        props.setFieldValue('isAllDay', check);
                                    }}
                                />
                            </MyFlex>
                        </MyFlex>

                        <MyFlex gap={3}>
                            <MyText textAlign={textAline} width={'140px'}>
                                Recordar a:
                            </MyText>
                            <Field
                                name="receiver"
                                isAllButton={true}
                                type={'multiselect'}
                                component={FormikInputCurrentUsers}
                            />
                        </MyFlex>

                        <MyFlex justifyContent={'flex-end'} gap={3}>
                            {props.values.path && (
                                <MyButton
                                    leftIcon={'ARROW_RIGHT'}
                                    colorPalette={'orange'}
                                    onClick={() => {
                                        GoToPage(props.values.path);
                                    }}
                                >
                                    Ir a la Página
                                </MyButton>
                            )}
                            {isShowDeleteBtn && (
                                <MyButton
                                    leftIcon={'TRASH'}
                                    colorPalette={'delete'}
                                    onClick={() => {
                                        handledOnDelete(props.values);
                                    }}
                                    loading={isDelete}
                                >
                                    Eliminar
                                </MyButton>
                            )}
                            <MyButton
                                leftIcon={'SUBMIT'}
                                colorPalette={'submit'}
                                // type={'submit'}
                                onClick={() => {
                                    console.log('submit click');
                                    props.handleSubmit();
                                }}
                                loading={props.isSubmitting}
                            >
                                {isShowDeleteBtn ? 'Editar' : 'Aceptar'}
                            </MyButton>
                        </MyFlex>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default RenderFormik;
