import {
    ActionBar,
    Badge,
    Box,
    Button,
    Flex,
    Portal,
    Text
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ColumnDefinition } from './model';
import { VirtualizedTable } from './virtualizedTable';

// Supongamos que esta es la estructura de datos que recibes de tu API
interface User {
    id: string;
    fullName: string;
    email: string;
    role: 'Admin' | 'Member' | 'Guest';
    isActive: boolean;
}

export const JustTableExample = () => {
    // Aquí iría tu lógica para obtener los datos (items, hasNextPage, etc.)
    const [users, setUsers] = useState<User[]>([
        {
            id: '1',
            fullName: 'John Doe',
            email: 'john@example.com',
            role: 'Admin',
            isActive: true
        },
        {
            id: '2',
            fullName: 'Jane Doe',
            email: 'jane@example.com',
            role: 'Member',
            isActive: true
        }
    ]); // Simulación
    const [hasNextPage, setHasNextPage] = useState(true); // Simulación
    const [isNextPageLoading, setIsNextPageLoading] = useState(false); // Simulación
    const [isEnabledClickOutside, setIsEnabledClickOutside] =
        useState(false);

    const [selectedItems, setSelectedItems] = useState<
        ReadonlySet<string>
    >(new Set());

    const hasSelection = selectedItems.size > 0;
    const LOADING_DELAY = 1000;

    useEffect(() => {
        if (selectedItems.size > 0) {
            setIsEnabledClickOutside(false);
        }
    }, [selectedItems]);

    const loadMoreItems = useCallback(async () => {
        try {
            // Simular una llamada a API
            await new Promise((resolve) =>
                setTimeout(resolve, LOADING_DELAY)
            );

            const newItems: User[] = Array.from({ length: 50 }, (_, i) => {
                const tempUser: User = {
                    id: `item-${users.length + i}`,
                    fullName: `Item ${users.length + i}`,
                    email: `Email for item ${users.length + i}`,
                    role: Math.random() > 0.5 ? 'Admin' : 'Member',
                    isActive: Math.random() > 0.5
                };
                return tempUser;
            });

            setUsers((prev) => [...prev, ...newItems]);

            // Simular que no hay más items después de 100
            if (users.length + newItems.length >= 10000) {
                setHasNextPage(false);
                setIsNextPageLoading(false);
            }
        } catch (error) {
            console.error('Error loading more items:', error);
        } finally {
            // setIsLoading(false);
        }
    }, [users.length]);

    // --- El "Gestor de Celdas" se define aquí ---
    const columns: ColumnDefinition<User>[] = useMemo(
        () => [
            {
                key: 'fullName',
                header: 'Usuario',
                headerOnClick: () => {
                    console.log('Header on click');
                },
                width: '40%',
                renderCell: (user) => (
                    <Flex align="center">
                        <Box>
                            <Text fontWeight="medium">
                                {user.fullName}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                {user.email}
                            </Text>
                        </Box>
                    </Flex>
                )
            },
            {
                key: 'role',
                header: 'Rol',
                headerOnClick: () => {
                    console.log('Header on click');
                },
                width: '30%',
                renderCell: (user) => (
                    <Text fontWeight={'semibold'}>{user.role}</Text>
                )
            },
            {
                key: 'isActive',
                header: 'Estado',
                headerOnClick: () => {
                    console.log('Header on click');
                },
                width: '30%',
                renderCell: (user) => (
                    <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                )
            }
        ],
        []
    );

    return (
        // Dale a la tabla un contenedor con altura definida
        <>
            <Box
                //
                height="50vh"
                // height="70vh"
                // minWidth={'800px'}
                // overflow={'auto'}
            >
                <VirtualizedTable
                    items={users}
                    columns={columns}
                    hasNextPage={hasNextPage}
                    isNextPageLoading={isNextPageLoading}
                    loadNextPage={loadMoreItems}
                    callBackSelectedItems={setSelectedItems}
                    ceanOutside={isEnabledClickOutside}
                    setCleanOutside={setIsEnabledClickOutside}
                    isEnabledClickOutside={false}
                />
            </Box>

            <ActionBar.Root open={hasSelection}>
                <Portal>
                    <ActionBar.Positioner>
                        <ActionBar.Content>
                            <ActionBar.SelectionTrigger>
                                {selectedItems.size} seleccionados
                            </ActionBar.SelectionTrigger>
                            <ActionBar.Separator />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    console.log('Limpiar selección');
                                    setIsEnabledClickOutside(true);
                                }}
                            >
                                Limpiar selección
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    console.log('Generar PDF');
                                    console.log(selectedItems);

                                    // setIsEnabledClickOutside(true);
                                }}
                            >
                                Generar PDF
                            </Button>
                        </ActionBar.Content>
                    </ActionBar.Positioner>
                </Portal>
            </ActionBar.Root>
        </>
    );
};

export const JustTableExample1 = () => {
    // Aquí iría tu lógica para obtener los datos (items, hasNextPage, etc.)
    const [users, setUsers] = useState<User[]>([]); // Simulación
    const [hasNextPage, setHasNextPage] = useState(true); // Simulación
    const [isNextPageLoading, setIsNextPageLoading] = useState(false); // Simulación
    const [isEnabledClickOutside, setIsEnabledClickOutside] =
        useState(false);

    const [selectedItems, setSelectedItems] = useState<
        ReadonlySet<string>
    >(new Set());

    const hasSelection = selectedItems.size > 0;
    const LOADING_DELAY = 1000;

    useEffect(() => {
        if (selectedItems.size > 0) {
            setIsEnabledClickOutside(false);
        }
    }, [selectedItems]);

    const loadMoreItems = useCallback(async () => {
        try {
            // Simular una llamada a API
            await new Promise((resolve) =>
                setTimeout(resolve, LOADING_DELAY)
            );

            const newItems: User[] = Array.from({ length: 50 }, (_, i) => {
                const tempUser: User = {
                    id: `item-${users.length + i}`,
                    fullName: `Item ${users.length + i}`,
                    email: `Email for item ${users.length + i}`,
                    role: Math.random() > 0.5 ? 'Admin' : 'Member',
                    isActive: Math.random() > 0.5
                };
                return tempUser;
            });

            setUsers((prev) => [...prev, ...newItems]);

            // Simular que no hay más items después de 100
            if (users.length + newItems.length >= 10000) {
                setHasNextPage(false);
                setIsNextPageLoading(false);
            }
        } catch (error) {
            console.error('Error loading more items:', error);
        } finally {
            // setIsLoading(false);
        }
    }, [users.length]);

    // --- El "Gestor de Celdas" se define aquí ---
    const columns: ColumnDefinition<User>[] = useMemo(
        () => [
            {
                key: 'fullName',
                header: 'Usuario',
                headerOnClick: () => {
                    console.log('Header on click');
                },
                width: '40%',
                renderCell: (user) => (
                    <Flex align="center">
                        <Box>
                            <Text fontWeight="medium">
                                {user.fullName}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                {user.email}
                            </Text>
                        </Box>
                    </Flex>
                )
            },
            {
                key: 'role',
                header: 'Rol',
                headerOnClick: () => {
                    console.log('Header on click');
                },
                width: '30%',
                renderCell: (user) => (
                    <Text fontWeight={'semibold'}>{user.role}</Text>
                )
            },
            {
                key: 'isActive',
                header: 'Estado',
                headerOnClick: () => {
                    console.log('Header on click');
                },
                width: '30%',
                renderCell: (user) => (
                    <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                )
            }
        ],
        []
    );

    return (
        // Dale a la tabla un contenedor con altura definida
        <>
            <Box
                //
                height="50vh"
                // height="70vh"
                // minWidth={'800px'}
                // overflow={'auto'}
            >
                <VirtualizedTable
                    items={users}
                    columns={columns}
                    hasNextPage={hasNextPage}
                    isNextPageLoading={isNextPageLoading}
                    loadNextPage={loadMoreItems}
                    callBackSelectedItems={setSelectedItems}
                    ceanOutside={isEnabledClickOutside}
                    setCleanOutside={setIsEnabledClickOutside}
                    isEnabledClickOutside={false}
                />
            </Box>

            <ActionBar.Root open={hasSelection}>
                <Portal>
                    <ActionBar.Positioner>
                        <ActionBar.Content>
                            <ActionBar.SelectionTrigger>
                                {selectedItems.size} seleccionados
                            </ActionBar.SelectionTrigger>
                            <ActionBar.Separator />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    console.log('Limpiar selección');
                                    setIsEnabledClickOutside(true);
                                }}
                            >
                                Limpiar selección
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    console.log('Generar PDF');
                                    console.log(selectedItems);

                                    // setIsEnabledClickOutside(true);
                                }}
                            >
                                Generar PDF
                            </Button>
                        </ActionBar.Content>
                    </ActionBar.Positioner>
                </Portal>
            </ActionBar.Root>
        </>
    );
};
