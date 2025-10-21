import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
import {
    DragDropContext,
    Draggable,
    Droppable,
    type DropResult
} from '@hello-pangea/dnd';
import { FormikInputText } from '@src/customAgencyTool/components/formik';
import {
    MyButton,
    MyDrawer,
    MyFlex,
    MyText
} from '@src/customAgencyTool/components/ui';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { Field, FieldArray, Formik, type FormikHelpers } from 'formik';
import { useCallback, useMemo, useState, type FC } from 'react';
import * as Yup from 'yup';
import type { InterfaceEconomicActivity } from '../../../domain/agendaModel';

export const InterfaceEconomicActivitySchema = Yup.object().shape({
    activities: Yup.array().of(
        Yup.object().shape({
            activityName: Yup.string(),
            activityNumber: Yup.string()
        })
    )
});

interface Props {
    name: string;
    label: string;
    icon: string;
    isReadOnly?: boolean;
    maxItems?: number;
    maxHeight?: string;
}

export const InputEconomicActivityNumber: FC<Props> = ({
    name,
    label,
    icon,
    isReadOnly = false,
    maxItems = 10,
    ...props
}) => {
    const pointerStyle = isReadOnly ? 'cursor-not-allowed' : 'cursor-text';
    const [showDrawer, setShowDrawer] = useState(false);

    const [activitiesList, setActivitiesList] = useState<
        InterfaceEconomicActivity[]
    >([]);

    const handledOnOpenDrawer = useCallback(() => {
        setShowDrawer(true);
    }, []);

    const handledOnCloseDrawer = useCallback(() => {
        setShowDrawer(false);
    }, []);

    const handledOnSubmit = useCallback(
        (values: InterfaceEconomicActivity[]) => {
            console.log('values', values);

            setActivitiesList(values);
        },
        []
    );

    const renderLabel = () => (
        <ChakraField.Label css={floatingStyles} truncate>
            {icon && <SelectedIcons iconName={icon} />}
            {label}
        </ChakraField.Label>
    );

    return (
        <MyFlex
            direction={'row'}
            p={0}
            width={'100%'}
            justifyContent={'space-between'}
            alignItems={'center'}
        >
            <ChakraField.Root gap={1} {...props}>
                <MyFlex
                    direction={'column'}
                    pos="relative"
                    w="full"
                    gap={0}
                    borderRadius={'5px'}
                    border={'1px solid #7f8691'}
                >
                    {renderLabel()}
                    {activitiesList.length === 0 && (
                        <MyText fontSize={'0.8rem'} color={'gray'}>
                            No hay actividades registradas.
                        </MyText>
                    )}
                    {activitiesList.map((item, index) => (
                        <MyText
                            key={`${name}-${index}`}
                            fontSize={'0.8rem'}
                            color={'gray'}
                            fontWeight={'semibold'}
                            truncate
                            lineClamp="1"
                        >
                            <span
                                style={{
                                    color: '#919aa7',
                                    fontWeight: 'bold'
                                }}
                            >
                                {`${item.activityName} :`}
                            </span>{' '}
                            {item.activityNumber}
                        </MyText>
                    ))}
                </MyFlex>
            </ChakraField.Root>
            <MyButton
                aria-label="Add new item"
                size="xs"
                icon={'PLUS'}
                variant={'plain'}
                border={'2px dashed #7f8691'}
                onClick={handledOnOpenDrawer}
                isDisabled={isReadOnly || activitiesList.length >= maxItems}
                cursor={pointerStyle}
            />
            <ManageActivity
                label={label}
                isReadOnly={isReadOnly}
                activities={activitiesList}
                onSubmit={handledOnSubmit}
                showDialog={showDrawer}
                onClose={handledOnCloseDrawer}
            />
        </MyFlex>
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
        top: '-3',
        insetStart: '2'
    }
});

interface InterfaceFormValues {
    activities: InterfaceEconomicActivity[];
}

const emptyEconomicActivity: InterfaceEconomicActivity = {
    activityName: '',
    activityNumber: ''
};

interface InterfaceManageActivityProps {
    label: string;
    isReadOnly?: boolean;
    maxItems?: number;
    activities: InterfaceEconomicActivity[];
    onSubmit: (values: InterfaceEconomicActivity[]) => void;
    showDialog: boolean;
    onClose: () => void;
}
const ManageActivity: FC<InterfaceManageActivityProps> = ({
    label,
    isReadOnly = false,
    maxItems = 5,
    activities,
    onSubmit,
    showDialog,
    onClose
}) => {
    const initialFormValues = useMemo(() => {
        const initialValues: InterfaceFormValues = {
            activities:
                activities.length > 0 ? activities : [emptyEconomicActivity]
        };

        return initialValues;
    }, [activities]);

    const handledOnSubmit = (
        values: InterfaceFormValues,
        formikHelpers: FormikHelpers<InterfaceFormValues>
    ) => {
        onSubmit(values.activities);

        setTimeout(() => {
            onClose();
            formikHelpers.setSubmitting(false);
        }, 200);
    };

    return (
        <MyDrawer
            withOutPortal={true}
            isOpen={showDialog}
            size={'md'}
            placement="end"
            onOpenChange={onClose}
            header={label}
        >
            <Formik
                initialValues={initialFormValues}
                onSubmit={handledOnSubmit}
                validationSchema={InterfaceEconomicActivitySchema}
            >
                {(props) => (
                    <MyFlex
                        direction={'column'}
                        p={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                e.preventDefault();
                                onClose();
                            }
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                props.handleSubmit();
                            }
                        }}
                    >
                        <FieldArray
                            name="activities"
                            render={(arrayHelpers) => {
                                const handleDragEnd = (result: DropResult) => {
                                    // Si no hay destino o el origen es igual al destino, no hacemos nada
                                    if (
                                        !result.destination ||
                                        result.destination.index ===
                                            result.source.index
                                    ) {
                                        return;
                                    }
                                    arrayHelpers.move(
                                        result.source.index,
                                        result.destination.index
                                    );
                                };

                                const handleDeleteLine = (
                                    _: InterfaceEconomicActivity,
                                    index: number
                                ) => {
                                    arrayHelpers.remove(index);
                                };

                                return (
                                    <MyFlex direction={'column'} gap={2}>
                                        <MyFlex
                                            direction={'row'}
                                            justifyContent={'flex-end'}
                                            p={0}
                                        >
                                            <MyButton
                                                aria-label="Add new item"
                                                size="xs"
                                                leftIcon={'PLUS'}
                                                variant={'plain'}
                                                border={'2px dashed #7f8691'}
                                                onClick={() => {
                                                    arrayHelpers.push(
                                                        emptyEconomicActivity
                                                    );
                                                }}
                                                isDisabled={
                                                    isReadOnly ||
                                                    props.values.activities
                                                        .length >= maxItems
                                                }
                                            >
                                                Agregar Nueva Actividad
                                            </MyButton>
                                        </MyFlex>
                                        <DragDropContext
                                            onDragEnd={handleDragEnd}
                                        >
                                            <Droppable droppableId="lines-list">
                                                {(provided, snapshot) => (
                                                    <MyFlex
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                        direction="column"
                                                        gap={2}
                                                        minH={
                                                            snapshot.isDraggingOver
                                                                ? `${
                                                                      props
                                                                          .values
                                                                          .activities
                                                                          .length *
                                                                      65
                                                                  }px`
                                                                : 'auto'
                                                        }
                                                        transition="min-height 0.2s"
                                                        // overflowY={'auto'}
                                                        pb={5}
                                                    >
                                                        {props.values.activities.map(
                                                            (line, index) => (
                                                                <Draggable
                                                                    key={index.toString()}
                                                                    draggableId={index.toString()}
                                                                    index={
                                                                        index
                                                                    }
                                                                >
                                                                    {(
                                                                        provided,
                                                                        snapshot
                                                                    ) => (
                                                                        <MyFlex
                                                                            ref={
                                                                                provided.innerRef
                                                                            }
                                                                            {...provided.draggableProps}
                                                                            direction="row"
                                                                            align="center"
                                                                            pt={
                                                                                4
                                                                            }
                                                                            pb={
                                                                                1
                                                                            }
                                                                            bg={
                                                                                snapshot.isDragging
                                                                                    ? 'bg.emphasized'
                                                                                    : 'bg.panel'
                                                                            }
                                                                            borderWidth="1px"
                                                                            borderRadius="md"
                                                                            transition="background 0.2s"
                                                                            _hover={{
                                                                                boxShadow:
                                                                                    'sm'
                                                                            }}
                                                                        >
                                                                            <MyFlex
                                                                                {...provided.dragHandleProps}
                                                                                mr={
                                                                                    3
                                                                                }
                                                                                cursor="grab"
                                                                            >
                                                                                <SelectedIcons iconName="Grabber" />
                                                                            </MyFlex>

                                                                            <MyFlex
                                                                                direction={
                                                                                    'column'
                                                                                }
                                                                                flex={
                                                                                    1
                                                                                }
                                                                                align={
                                                                                    'center'
                                                                                }
                                                                                gap={
                                                                                    4
                                                                                }
                                                                            >
                                                                                <Field
                                                                                    name={`activities.${index}.activityName`}
                                                                                    label="Nombre de actividad"
                                                                                    icon="CUSTOMER"
                                                                                    component={
                                                                                        FormikInputText
                                                                                    }
                                                                                />
                                                                                <Field
                                                                                    name={`activities.${index}.activityNumber`}
                                                                                    label="Número de actividad"
                                                                                    icon="NUMBER"
                                                                                    component={
                                                                                        FormikInputText
                                                                                    }
                                                                                />
                                                                            </MyFlex>

                                                                            <MyFlex
                                                                                gap={
                                                                                    2
                                                                                }
                                                                                p={
                                                                                    0
                                                                                }
                                                                            >
                                                                                <MyButton
                                                                                    data-label="Eliminar"
                                                                                    icon="DELETE"
                                                                                    colorPalette="delete"
                                                                                    size={
                                                                                        'xs'
                                                                                    }
                                                                                    onClick={() =>
                                                                                        handleDeleteLine(
                                                                                            line,
                                                                                            index
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </MyFlex>
                                                                        </MyFlex>
                                                                    )}
                                                                </Draggable>
                                                            )
                                                        )}
                                                        {provided.placeholder}
                                                    </MyFlex>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    </MyFlex>
                                );
                            }}
                        />

                        <MyFlex
                            justifyContent={'center'}
                            alignItems={'center'}
                            p={0}
                        >
                            <MyButton
                                colorPalette={'submit'}
                                leftIcon={isReadOnly ? 'SAVE' : 'SAVE'}
                                loading={
                                    props.isSubmitting || props.isValidating
                                }
                                onClick={() => {
                                    props.submitForm();
                                }}
                            >
                                {isReadOnly ? 'Aceptar' : 'Guardar'}
                            </MyButton>
                        </MyFlex>
                    </MyFlex>
                )}
            </Formik>
        </MyDrawer>
    );
};
