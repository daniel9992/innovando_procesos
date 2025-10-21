import type { DropResult } from '@hello-pangea/dnd';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import AddNewLine from '@src/customAgencyTool/components/customButtons/addNewLine';
import {
    MyButton,
    MyFlex,
    MyHeading,
    MyText
} from '@src/customAgencyTool/components/ui';
import { ArrayMove } from '@src/customAgencyTool/utils/arraTools/arrayTools';
import { GetToday } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import type { ArrayHelpers } from 'formik';
import { useEffect, useState, type FC } from 'react';
import {
    emptyInterfaceCustomerContact,
    type InterfaceCustomerContact
} from '../../../domain/agendaModel';
import { AdapterCustomerContact } from '../../../domain/utils/adapterCustomerContact';
import AddInterfaceCustomerContact from './addCustomerContact';

interface ManageItem {
    selectedItem?: InterfaceCustomerContact;
    selectedIndex?: number;
    showDialog: boolean;
}

const initialManageItem: ManageItem = {
    selectedItem: undefined,
    selectedIndex: undefined,
    showDialog: false
};

interface Props {
    title: string;
    idBelongsToClient?: string;
    lines: InterfaceCustomerContact[];
    isLoading?: boolean;
    onLineChange?: (lines: InterfaceCustomerContact[]) => void;
}

export const ManageCustomerContact: FC<Props & ArrayHelpers> = ({
    title,
    lines,
    idBelongsToClient = '',
    isLoading = false,
    onLineChange = () => {},
    move,
    remove,
    push,
    replace
}) => {
    const [manageItem, setManageItem] = useState<ManageItem>(initialManageItem);

    const [stateLines, setStateLines] = useState<InterfaceCustomerContact[]>(
        []
    );

    useEffect(() => {
        const linesAdapter = lines.map((item) => {
            return AdapterCustomerContact(item);
        });
        setStateLines(linesAdapter);
    }, [lines]);

    const handleDragEnd = (result: DropResult) => {
        // Si no hay destino o el origen es igual al destino, no hacemos nada
        if (
            !result.destination ||
            result.destination.index === result.source.index
        ) {
            return;
        }

        const newOrder = ArrayMove(
            stateLines,
            result.source.index,
            result.destination.index
        );
        setStateLines(newOrder);

        move(result.source.index, result.destination.index);
        onLineChange(lines);
    };

    const handleAddNewLine = () => {
        const newItem = {
            ...emptyInterfaceCustomerContact,
            id: 'new-' + Math.random().toString(36).substring(2, 15),
            createdAt: GetToday(),
            idBelongsToClient
        };
        setManageItem({
            selectedItem: newItem,
            showDialog: true
        });
    };

    const handleEditLine = (line: InterfaceCustomerContact, index: number) => {
        setManageItem({
            selectedItem: { ...line },
            selectedIndex: index,
            showDialog: true
        });
    };

    const handleSubmitLine = (values: InterfaceCustomerContact) => {
        const findedIndex = stateLines.findIndex(
            (item) => item.id === values.id
        );

        if (findedIndex !== -1) {
            stateLines[findedIndex] = values;
            replace(findedIndex, values);
        } else {
            stateLines.push(values);
            push(values);
        }

        onLineChange(stateLines);
    };

    const handleDeleteLine = (_: InterfaceCustomerContact, index: number) => {
        // Delete from local state
        remove(index);

        // console.log('handleDeleteLine', values);

        // -> la función del repository debe borrar el contacto
        // -> por eso se pasa customerContacts encontrados en el state
        // -> y compara con los valores finales
        // onLineChange(stateLines.filter((item) => item.id !== values.id));
    };

    return (
        <MyFlex direction="column" gap={3} p={0}>
            <MyFlex
                justifyContent={'space-between'}
                alignItems={'center'}
                gap={3}
                p={0}
            >
                <MyHeading fontSize="1.5rem">{title}</MyHeading>

                <AddNewLine
                    label="Agregar Nuevo Contacto"
                    onClick={handleAddNewLine}
                    isDisabled={isLoading}
                />
            </MyFlex>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="lines-list">
                    {(provided, snapshot) => (
                        <MyFlex
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            direction="column"
                            gap={2}
                            minH={
                                snapshot.isDraggingOver
                                    ? `${stateLines.length * 65}px`
                                    : 'auto'
                            }
                            transition="min-height 0.2s"
                            // overflowY={'auto'}
                            overflow={'auto'}
                            maxHeight={'30vh'}
                            pb={5}
                        >
                            {stateLines.map((line, index) => (
                                <Draggable
                                    key={index.toString()}
                                    draggableId={index.toString()}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <MyFlex
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            direction="row"
                                            align="center"
                                            p={2}
                                            bg={
                                                snapshot.isDragging
                                                    ? 'bg.subtle'
                                                    : 'bg.muted'
                                            }
                                            borderWidth="1px"
                                            borderRadius="md"
                                            transition="background 0.2s"
                                            _hover={{ boxShadow: 'sm' }}
                                        >
                                            <MyFlex
                                                {...provided.dragHandleProps}
                                                mr={3}
                                                cursor="grab"
                                            >
                                                <SelectedIcons iconName="Grabber" />
                                            </MyFlex>

                                            <MyFlex
                                                direction={'row'}
                                                flexWrap={'wrap'}
                                                flex={1}
                                                p={0}
                                                align={'center'}
                                                gap={5}
                                            >
                                                <MyText fontWeight={'semibold'}>
                                                    {line.name}{' '}
                                                    <span
                                                        style={{
                                                            color: '#919aa7',
                                                            fontWeight:
                                                                'semibold'
                                                        }}
                                                    >
                                                        {line.department === ''
                                                            ? ''
                                                            : `(${line.department})`}
                                                    </span>
                                                </MyText>

                                                <MyFlex
                                                    direction={'column'}
                                                    p={0}
                                                    gap={0}
                                                >
                                                    <MyText fontSize={'0.8rem'}>
                                                        {line.email.join(', ')}
                                                    </MyText>
                                                    <MyText
                                                        fontSize={'0.8rem'}
                                                        color={'gray'}
                                                    >
                                                        {line.phone.join(', ')}
                                                    </MyText>
                                                </MyFlex>
                                            </MyFlex>

                                            <MyFlex gap={2} p={0}>
                                                <MyButton
                                                    data-label="Editar"
                                                    icon="EDIT"
                                                    size={'xs'}
                                                    colorPalette="edit"
                                                    onClick={() =>
                                                        handleEditLine(
                                                            line,
                                                            index
                                                        )
                                                    }
                                                    isDisabled={isLoading}
                                                />
                                                <MyButton
                                                    data-label="Eliminar"
                                                    icon="DELETE"
                                                    colorPalette="delete"
                                                    size={'xs'}
                                                    onClick={() =>
                                                        handleDeleteLine(
                                                            line,
                                                            index
                                                        )
                                                    }
                                                    isDisabled={isLoading}
                                                />
                                            </MyFlex>
                                        </MyFlex>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </MyFlex>
                    )}
                </Droppable>
            </DragDropContext>
            <AddInterfaceCustomerContact
                selectedLine={manageItem.selectedItem}
                showDialog={manageItem.showDialog}
                onClose={() => setManageItem(initialManageItem)}
                onSubmit={handleSubmitLine}
                isEdit={manageItem.selectedIndex !== undefined}
            />
        </MyFlex>
    );
};
