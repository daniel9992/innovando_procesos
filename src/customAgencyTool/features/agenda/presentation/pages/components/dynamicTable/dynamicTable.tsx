import { Menu, Portal } from '@chakra-ui/react';
import { useAppDispatch } from '@src/customAgencyTool/app/hooks';
import { MyFlex } from '@src/customAgencyTool/components/ui';
import { VirtualizedTable } from '@src/customAgencyTool/components/virtualizedTable/virtualizedTable';
import { useDialog } from '@src/customAgencyTool/context/appAlertDialog/useDialog';
import type { InterfaceClient } from '@src/customAgencyTool/features/agenda/domain/agendaModel';
import { deleteAgenda } from '@src/customAgencyTool/features/agenda/infrastructure/agendaSlice';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { useState, type FC } from 'react';
import BtnCreateAgenda from '../../../components/btnCreateAgenda/btnCreateAgenda';
import { TableColumnsAgenda } from './tableColumns';

interface ISelectedClient {
    selectedClient?: InterfaceClient;
    showModal?: boolean;
}
const initialSelectedClient: ISelectedClient = {
    selectedClient: undefined,
    showModal: false
};

interface Props {
    clients: InterfaceClient[];
    isLoading?: boolean;
    hasMore?: boolean;
    loadMoreItems?: () => Promise<void>;
}

const DynamicTable: FC<Props> = ({
    clients,
    isLoading = false,
    hasMore = false,
    loadMoreItems
}) => {
    const dispatch = useAppDispatch();

    const { showDialog } = useDialog();

    const [isEnabledClickOutside, setIsEnabledClickOutside] = useState(false);

    const [selectedClient, setSelectedClient] = useState<ISelectedClient>(
        initialSelectedClient
    );

    const [contextSelectedItem, setContextSelectedItem] =
        useState<InterfaceClient>();

    const handledOnContextMenu = (item: InterfaceClient) => {
        setContextSelectedItem(item);
    };

    const handleCleanOutside = () => {
        setTimeout(() => {
            setContextSelectedItem(undefined);
        }, 500);
    };

    /**
     *  ? -----------------------------
     *  * Doble Click
     *  ? -----------------------------
     */
    const handledOnDobleClick = (item: InterfaceClient) => {
        // console.log('handledOnDobleClick');
        // console.log(item);

        setSelectedClient({
            selectedClient: item,
            showModal: true
        });
        // persistLocalStorage(
        //     SESSION_STORAGE_BILLOFLANDING,
        //     JSON.stringify(item)
        // );

        // const path = GeneratePathBL({ item });

        // if (path) {
        //     navigate(path);
        // }
    };

    /**
     *  ? -----------------------------
     *  * Edit
     *  ? -----------------------------
     */
    const handledOnEdit = (item: InterfaceClient | undefined) => {
        if (!item) return;

        console.log('handledOnEdit');
        console.log(item);

        // persistLocalStorage(
        //     SESSION_STORAGE_BILLOFLANDING,
        //     JSON.stringify(item)
        // );

        // const path = GeneratePathBL({ item });

        // if (path) {
        //     const newTap =
        //         PrivateRoutePath.DASHBOARD_PAGE +
        //         '/' +
        //         PrivateRoutePath.BILLOFLANDING_PAGE +
        //         '/' +
        //         path;

        //     navigate(newTap);
        // }
    };

    /**
     *  ? -----------------------------
     *  * Delete
     *  ? -----------------------------
     */
    const handledOnDelete = async (item: InterfaceClient | undefined) => {
        if (!item) return;

        const result = await showDialog({
            title: `¿Deseas eliminar ${item.clientName}?`,
            message: (
                <>
                    <p>
                        Esta acción no se puede deshacer, luego de eliminar se
                        borrará el registro.
                    </p>
                    <p>
                        <strong>Nota:</strong> está acción no borrara los
                        contactos asociados a este contacto.
                    </p>
                    <br />
                    <p>¿Estás seguro?</p>
                </>
            ),
            buttons: [
                {
                    label: 'Cancelar',
                    //colorPalette: 'green',
                    value: false
                },
                {
                    label: 'Confirmar',
                    colorPalette: 'red',
                    iconLeft: 'TRASH',
                    value: true
                }
            ]
        });

        if (result) {
            dispatch(
                deleteAgenda({
                    values: item
                })
            );
        }
    };

    /**
     *  ? -----------------------------
     *  * Render
     *  ? -----------------------------
     */
    return (
        <div>
            <Menu.Root>
                <Menu.ContextTrigger asChild>
                    <MyFlex
                        direction={'column'}
                        height="75vh" //76
                        width={'100%'}
                        pb={5}
                        overflow={'auto'}
                    >
                        <VirtualizedTable
                            minWidth={'1000px'}
                            items={clients}
                            columns={TableColumnsAgenda}
                            hasNextPage={hasMore}
                            isNextPageLoading={isLoading}
                            loadNextPage={loadMoreItems}
                            callBackClickOutside={handleCleanOutside}
                            ceanOutside={isEnabledClickOutside}
                            setCleanOutside={setIsEnabledClickOutside}
                            onRowDoubleClick={handledOnDobleClick}
                            onRowContextMenu={handledOnContextMenu}
                        />
                    </MyFlex>
                </Menu.ContextTrigger>

                <Portal>
                    <Menu.Positioner>
                        <Menu.Content
                            display={contextSelectedItem ? 'block' : 'none'}
                        >
                            <Menu.ItemGroup>
                                <Menu.ItemGroupLabel textAlign={'center'}>
                                    {contextSelectedItem?.clientName}
                                </Menu.ItemGroupLabel>

                                <Menu.Item
                                    value="edit"
                                    onClick={() => {
                                        handledOnEdit(contextSelectedItem);
                                    }}
                                >
                                    <SelectedIcons iconName={'EDIT'} />
                                    Editar
                                </Menu.Item>

                                <Menu.Item
                                    value="delete"
                                    onClick={() => {
                                        handledOnDelete(contextSelectedItem);
                                    }}
                                >
                                    <SelectedIcons iconName={'DELETE'} />
                                    Eliminar
                                </Menu.Item>
                            </Menu.ItemGroup>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>

            <BtnCreateAgenda
                showBtn={false}
                showModal={selectedClient.showModal}
                selectedClient={selectedClient.selectedClient}
                onClose={() => setSelectedClient(initialSelectedClient)}
            />
        </div>
    );
};

export default DynamicTable;
