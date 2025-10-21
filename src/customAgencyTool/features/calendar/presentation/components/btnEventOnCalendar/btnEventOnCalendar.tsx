import {
    useAppDispatch,
    useAppSelector
} from '@src/customAgencyTool/app/hooks';
import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
import { MyDialog } from '@src/customAgencyTool/components/ui/myDialog';
import { selectCurrentUser } from '@src/customAgencyTool/features/auth/infrastructure/authSlice';
import { GetToday } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import dayjs from 'dayjs';
import { type FormikHelpers } from 'formik';
import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import {
    initialCalendarEvent,
    type InterfaceCalendarEvent,
    type InterfaceReceive
} from '../../../domain/calendarEvent.entity';
import {
    createEvent,
    deleteEvent,
    updateEvent
} from '../../../infrastructure/calendarSlice';
import RenderFormik from './eventFormik';
import ShowCalendarBtn from './showCalendarBtn';

interface InterfaceCreateEventOptions {
    title?: string;
    description?: string;
    path?: string;
    receiver?: Array<InterfaceReceive>;
}

interface Props {
    showEventModal?: boolean;
    selectedDate?: Date;
    selectedEvent?: InterfaceCalendarEvent;
    createOnEvent?: InterfaceCreateEventOptions;

    callBackOnClose?: () => void;
    typeBtn?: 'IconButton' | 'Button' | 'none';
}

const BtnEventOnCalendar: FC<Props> = ({
    typeBtn = 'IconButton',
    showEventModal,
    selectedDate,
    selectedEvent,
    createOnEvent,
    callBackOnClose = () => {}
}) => {
    const [showModalLocal, setShowModalLocal] = useState(false);

    const [isRefresh, setIsRefresh] = useState(false);

    const [modalTitle, setModalTitle] = useState(
        'Crear evento en el calendario'
    );

    const dispatch = useAppDispatch();

    const currentUser = useAppSelector(selectCurrentUser);

    const startValues = useMemo(() => {
        setModalTitle(`Nuevo Recordatorio`);

        const endDate = dayjs().add(1, 'hour');

        const initialValuesLocal: InterfaceCalendarEvent = {
            ...initialCalendarEvent,
            ...createOnEvent,
            sender: {
                uid: currentUser.uid,
                name: currentUser.name,
                email: currentUser.email
            },
            whoCreated: currentUser.name,
            startDate: GetToday(),
            endDate: endDate.toDate(),
            isAllDay: true
        };
        return initialValuesLocal;
    }, [currentUser, createOnEvent]);

    const [initialValues, setInitialValues] =
        useState<InterfaceCalendarEvent>(startValues);

    /**
     *  ? -----------------------------
     *  *  Handled - Initial Values
     *  ? -----------------------------
     */
    useEffect(() => {
        if (createOnEvent) {
            return;
        }
        if (selectedEvent) {
            return;
        }
        setIsRefresh(true);
        if (selectedDate) {
            const startValue: InterfaceCalendarEvent = {
                ...initialCalendarEvent,
                startDate: selectedDate,
                endDate: selectedDate,
                sender: {
                    uid: currentUser.uid,
                    name: currentUser.name,
                    email: currentUser.email
                }
            };
            setInitialValues(startValue);
        }
        setTimeout(() => {
            setIsRefresh(false);
        }, 100);
    }, [selectedDate, currentUser, selectedEvent, createOnEvent]);

    /**
     *  ? -----------------------------
     *  *  Handled - Initial selectedEvent
     *  ? -----------------------------
     */
    useEffect(() => {
        if (selectedDate) {
            return;
        }

        setIsRefresh(true);
        if (selectedEvent) {
            setModalTitle('Editar evento');
            setInitialValues(selectedEvent);
        } else {
            setModalTitle('Crear evento en el calendario');
        }
        setTimeout(() => {
            setIsRefresh(false);
        }, 100);
    }, [selectedEvent, selectedDate]);

    /**
     *  ? -----------------------------
     *  *  Handled - Modal
     *  ? -----------------------------
     */
    const handledOnOpen = useCallback(() => {
        setShowModalLocal(true);
    }, []);

    const handledOnClose = useCallback(() => {
        setShowModalLocal(false);
        callBackOnClose();
    }, [callBackOnClose]);

    useEffect(() => {
        if (showEventModal === undefined) {
            return;
        }

        if (showEventModal) {
            handledOnOpen();
        } else {
            handledOnClose();
        }
    }, [showEventModal, handledOnOpen, handledOnClose]);

    /**
     *  ? -----------------------------
     *  *  Handled - OnSubmit
     *  ? -----------------------------
     */
    const onSubmit = (
        values: InterfaceCalendarEvent,
        formikHelpers: FormikHelpers<InterfaceCalendarEvent>
    ) => {
        // console.log('copyValues', values);
        // formikHelpers.setSubmitting(false);
        // return;

        if (values.id === '') {
            dispatch(
                createEvent({
                    event: values
                })
            ).finally(() => {
                formikHelpers.setSubmitting(false);
                formikHelpers.resetForm();
                setShowModalLocal(false);
            });
        } else {
            dispatch(
                updateEvent({
                    event: values
                })
            ).finally(() => {
                formikHelpers.setSubmitting(false);
                formikHelpers.resetForm();
                setShowModalLocal(false);
            });
        }
    };

    /**
     *  ? -----------------------------
     *  *  Handled - On Delete
     *  ? -----------------------------
     */
    const handledOnDelete = (event: InterfaceCalendarEvent): Promise<void> => {
        return new Promise((resolve) => {
            dispatch(deleteEvent({ event: event }));
            setShowModalLocal(false);
            handledOnClose();
            resolve();
        });
    };

    /**
     *  ? -----------------------------
     *  * Render
     *  ? -----------------------------
     */
    return (
        <>
            <ShowCalendarBtn typeBtn={typeBtn} onClick={handledOnOpen} />

            <MyDialog
                isOpen={showModalLocal}
                onClose={handledOnClose}
                showCloseButton={true}
                size={'lg'}
                header={modalTitle}
                iconHeader={'CALENDAR'}
                body={
                    <>
                        {!isRefresh && (
                            <RenderFormik
                                initialValues={initialValues}
                                onSubmit={onSubmit}
                                isShowDeleteBtn={selectedEvent ? true : false}
                                onDelete={handledOnDelete}
                            />
                        )}
                        {isRefresh && <LoadingWithText text={'Cargando...'} />}
                    </>
                }
                buttons={[]}
            />
        </>
    );
};

export default BtnEventOnCalendar;
