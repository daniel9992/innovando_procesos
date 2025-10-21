import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
import { RenderErrorMessage } from '@src/customAgencyTool/components/formik/utils/renderErrorMessage';
import {
    MyBox,
    MyButton,
    MyDialog,
    MyFlex,
    MyInputText,
    MySwitch,
    MyText
} from '@src/customAgencyTool/components/ui';
import type { InterfaceCurrentUser } from '@src/customAgencyTool/features/auth/domain/user.entity';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { type FieldProps } from 'formik';
import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import { userAdminObservableRepository } from '../../../infrastructure/compositionRoot';

interface IGeneric {
    [key: string]: string | number | boolean | undefined | null;
}
export const isValidParticipant = (participant: unknown) => {
    if (participant === undefined || participant === null) {
        return false;
    }
    if (typeof participant === 'string') {
        return false;
    }
    const tempParticipant = participant as IGeneric;

    if (
        'uid' in tempParticipant &&
        'name' in tempParticipant &&
        'email' in tempParticipant
    ) {
        return true;
    }
    return false;
};

export const ShowSelectedParticipants = (
    participants: InterfaceParticipant | InterfaceParticipant[] | string
) => {
    if (typeof participants === 'string') {
        return participants;
    }
    if (Array.isArray(participants)) {
        return participants
            .filter((item) => item.name !== '')
            .map((item) => item.name)
            .join(', ');
    }

    return participants.name;
};

export interface InterfaceParticipant {
    uid: string;
    name: string;
    email: string;
    phone: string;
}

interface InterfaceFormikInputParticipants {
    label?: string;
    icon?: string;
    callbackOnChange?: (user: InterfaceParticipant[]) => void;
    typeError?: 'top' | 'bottom';
    type?: 'multiselect' | 'select';
    placeholder?: string;
    maxLength?: number;
    isAllButton?: boolean;
    isDisabled?: boolean;
}

/**
 *   FormikInputCurrentUsers
 *   @param label Some text to show in the label
 *   @param icon Some icon to show in the label
 *   @param callbackOnChange Function to call when the value changes
 *   @param typeError 'top' | 'bottom'
 *   @param type 'multiselect' | 'select'
 *   @param maxLength Maximum number of participants
 *   @param isAllButton If true, a button to select all participants is shown
 *   @param isDisabled If true, the input is disabled
 *
 *   @example Multiselect
 *   <Filed
 *      name="selectedUser"
 *      label="Nombre"
 *      icon="USER"
 *      isAllButton={true}
 *      type={'multiselect'}
 *      component={FormikInputCurrentUsers}
 *      callbackOnChange={(users: InterfaceCurrentUser[]) => {
 *          console.log('users', users);
 *      }}
 *      />
 *
 *   @example Select
 *   <Filed
 *      name="selectedUser"
 *      label="Nombre"
 *      icon="USER"
 *      type={'select'}
 *      component={FormikInputCurrentUsers}
 *      callbackOnChange={(users: InterfaceCurrentUser[]) => {
 *          console.log('users', users);
 *      }}
 */
const FormikInputCurrentUsers: FC<
    InterfaceFormikInputParticipants & FieldProps
> = ({
    label,
    icon,
    callbackOnChange = () => {},
    typeError = 'top',
    type = 'multiselect',
    maxLength = 3,
    isAllButton = false,
    isDisabled = false,
    field,
    form
}) => {
    /**
     *  ? -----------------------------
     *  *  Values
     *  ? -----------------------------
     */
    const userAdminRepo = userAdminObservableRepository;

    const isError = form.touched[field.name] && form.errors[field.name];

    const [showDialog, setShowDialog] = useState(false);

    const [usersList, setUsersList] = useState<InterfaceCurrentUser[]>([]);

    /**
     *  ? -----------------------------
     *  *  State
     *  ? -----------------------------
     */
    const startInitial = useMemo(() => {
        try {
            const value = field.value;

            const result: InterfaceParticipant[] = [];

            if (typeof value === 'string') {
                const temp: InterfaceParticipant = {
                    uid: '',
                    name: value,
                    email: '',
                    phone: ''
                };

                return [temp];
            }

            if (Array.isArray(value)) {
                value.forEach((item) => {
                    if (isValidParticipant(item)) {
                        const temp: InterfaceParticipant = {
                            uid: item.uid,
                            name: item.name,
                            email: item.email,
                            phone: item.phone
                        };
                        result.push(temp);
                    }
                });
            } else {
                if (isValidParticipant(value)) {
                    const temp: InterfaceParticipant = {
                        uid: value.uid,
                        name: value.name,
                        email: value.email,
                        phone: value.phone
                    };
                    result.push(temp);
                }
            }

            return result;
        } catch (err) {
            console.log('err', err);
            return [];
        }
    }, [field.value]);

    const [selectedCurrentUsers, setSelectedCurrentUsers] = useState<
        InterfaceParticipant[]
    >([]);

    useEffect(() => {
        if (field.value) {
            setSelectedCurrentUsers(startInitial);
        }
    }, [field.value, startInitial]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [hasMore, setHasMore] = useState<boolean>(true);

    const loadMoreItems = useCallback(async () => {
        userAdminRepo.loadMore();
    }, [userAdminRepo]);

    useEffect(() => {
        const dataSub = userAdminRepo.data$.subscribe(setUsersList);
        const loadingSub = userAdminRepo.loading$.subscribe(setIsLoading);
        const hasMoreSub = userAdminRepo.hasMore$.subscribe(setHasMore);

        return () => {
            dataSub.unsubscribe();
            loadingSub.unsubscribe();
            hasMoreSub.unsubscribe();
        };
    }, [userAdminRepo]);

    useEffect(() => {
        if (!showDialog) {
            return;
        }

        userAdminRepo.get([]);
    }, [userAdminRepo, showDialog]);

    /**
     *  ? -----------------------------
     *  *  Toggle Selection
     *  ? -----------------------------
     */
    const adapterCurrentUserToInterfaceParticipant = (
        currentUser: InterfaceCurrentUser
    ): InterfaceParticipant => {
        return {
            uid: currentUser.uid,
            name: currentUser.name,
            email: currentUser.email,
            phone: currentUser.phone
        };
    };

    const handleToggleSelection = useCallback(
        (categoryToToggle: InterfaceCurrentUser) => {
            const adapter =
                adapterCurrentUserToInterfaceParticipant(categoryToToggle);

            if (type === 'select') {
                const isSelected = selectedCurrentUsers.find(
                    (item) => item.uid === adapter.uid
                );

                if (isSelected) {
                    setSelectedCurrentUsers([]);
                    // Usar setTimeout para evitar actualización durante renderizado
                    setTimeout(() => {
                        form.setFieldValue(field.name, '');
                        callbackOnChange([]);
                    }, 0);
                } else {
                    setSelectedCurrentUsers([adapter]);
                    setTimeout(() => {
                        form.setFieldValue(field.name, adapter);
                        callbackOnChange([adapter]);
                    }, 0);
                }

                setShowDialog(false);
                return;
            }

            const isSelected = selectedCurrentUsers.some(
                (cat) => cat.uid === adapter.uid
            );

            if (isSelected) {
                const newSelection = selectedCurrentUsers.filter(
                    (cat) => cat.uid !== adapter.uid
                );
                setSelectedCurrentUsers(newSelection);
                setTimeout(() => {
                    form.setFieldValue(field.name, newSelection);
                    callbackOnChange(newSelection);
                }, 0);
            } else if (selectedCurrentUsers.length < maxLength) {
                const newSelection = [...selectedCurrentUsers, adapter];
                setSelectedCurrentUsers(newSelection);
                setTimeout(() => {
                    form.setFieldValue(field.name, newSelection);
                    callbackOnChange(newSelection);
                }, 0);
            }
        },
        [
            selectedCurrentUsers,
            form,
            field.name,
            type,
            maxLength,
            callbackOnChange
        ]
    );

    /**
     *  ? -----------------------------
     *  *  Render
     *  ? -----------------------------
     */
    const renderLabel = () => (
        <ChakraField.Label css={floatingStyles} truncate>
            {icon && <SelectedIcons iconName={icon} />}
            {label}
        </ChakraField.Label>
    );

    const renderOptions = () => {
        if (type === 'select') {
            return (
                <MyFlex
                    //
                    direction={'row'}
                    align={'center'}
                    gap={1}
                    width={'100%'}
                    p={0}
                    m={0}
                >
                    {typeError === 'top' && (
                        <ChakraField.Root gap={1}>
                            <MyBox pos="relative" w="full">
                                <MyInputText
                                    id={field.name}
                                    data-testid={field.name}
                                    key={'key-input-' + field.name}
                                    className="peer"
                                    placeholder=""
                                    border={isError ? '1px solid #921313' : ''}
                                    disabled={true}
                                    value={selectedCurrentUsers
                                        .filter((item) => item.name !== '')
                                        .map((item) => item.name)
                                        .join(', ')}
                                    // {...field}
                                />
                                {renderLabel()}
                            </MyBox>

                            <RenderErrorMessage
                                name={field.name}
                                position={'top'}
                                isError={isError ? true : false}
                                errorMessage={form.errors[field.name] as string}
                            />
                        </ChakraField.Root>
                    )}
                    {typeError === 'bottom' && (
                        <ChakraField.Root gap={1}>
                            <MyBox pos="relative" w="full" p={0} m={0}>
                                <MyInputText
                                    id={field.name}
                                    data-testid={field.name}
                                    key={'key-input-' + field.name}
                                    className="peer"
                                    placeholder=""
                                    border={isError ? '1px solid #921313' : ''}
                                    disabled={true}
                                    // {...field}
                                    value={selectedCurrentUsers
                                        .filter((item) => item.name !== '')
                                        .map((item) => item.name)
                                        .join(', ')}
                                />

                                {renderLabel()}
                            </MyBox>
                            <RenderErrorMessage
                                name={field.name}
                                position={'bottom'}
                                isError={isError ? true : false}
                                errorMessage={form.errors[field.name] as string}
                            />
                        </ChakraField.Root>
                    )}
                    <MyButton
                        aria-label="Add Participant"
                        icon={'ArrowDown'}
                        size={'xs'}
                        isDisabled={isDisabled}
                        onClick={() => {
                            setShowDialog(true);
                        }}
                    />
                </MyFlex>
            );
        }
        return (
            <MyFlex
                width={'100%'}
                p={0}
                m={0}
                border={isError ? '1px solid #921313' : ''}
            >
                <MyButton
                    aria-label="Add Participant"
                    icon={'PersonAdd'}
                    height={'30px'}
                    width={'30px'}
                    onClick={() => {
                        setShowDialog(true);
                    }}
                />

                <MyFlex
                    p={0}
                    direction="row"
                    flexWrap={'wrap'}
                    align="center"
                    gap={1}
                >
                    {selectedCurrentUsers
                        .filter((item) => item.name !== '')
                        .map((participant, index) => (
                            <MyFlex
                                key={`${participant.uid}-${index}`}
                                gap={1}
                                align={'center'}
                                direction={'row'}
                                borderRadius={'10px'}
                                bg={'bg.muted'}
                                // py={0}
                                px={3}
                            >
                                <MyText fontSize={'0.8rem'}>
                                    {participant.name}
                                </MyText>
                            </MyFlex>
                        ))}
                </MyFlex>
            </MyFlex>
        );
    };

    return (
        <MyFlex width={'100%'} p={0} m={0}>
            {renderOptions()}

            <MyDialog
                isOpen={showDialog}
                closeOnOverlayClick={false}
                onClose={() => setShowDialog(false)}
                header={`Seleccionar: ${label}`}
                placement={'center'}
                isScreenLoading={isLoading}
                body={
                    <MyFlex
                        display={isLoading ? 'none' : 'flex'}
                        direction={'column'}
                        gap={2}
                        p={0}
                    >
                        <MyFlex
                            display={isAllButton ? 'flex' : 'none'}
                            p={0}
                            pb={3}
                        >
                            <MySwitch
                                key="isAllParticipants"
                                label="Todos los participantes"
                                checked={
                                    selectedCurrentUsers.find(
                                        (p) => p.uid === 'todo'
                                    ) !== undefined
                                }
                                onCheckedChange={(check: boolean) => {
                                    const todoParticipant: InterfaceParticipant =
                                        {
                                            uid: 'todo',
                                            name: 'Todos',
                                            email: 'todo@todo.com',
                                            phone: ''
                                        };

                                    setTimeout(() => {
                                        if (check) {
                                            setSelectedCurrentUsers((prev) => [
                                                todoParticipant,
                                                ...prev
                                            ]);
                                            form.setFieldValue(field.name, [
                                                todoParticipant,
                                                ...selectedCurrentUsers
                                            ]);
                                        } else {
                                            setSelectedCurrentUsers((prev) =>
                                                prev.filter(
                                                    (p) => p.uid !== 'todo'
                                                )
                                            );
                                            form.setFieldValue(
                                                field.name,
                                                selectedCurrentUsers.filter(
                                                    (p) => p.uid !== 'todo'
                                                )
                                            );
                                        }
                                    }, 0);
                                }}
                            />
                        </MyFlex>

                        <MyFlex
                            direction={'column'}
                            gap={1}
                            maxH={'50vh'}
                            overflowY={'auto'}
                        >
                            {usersList.map((participant, index) => {
                                if (participant.uid === 'todo') {
                                    return null;
                                }
                                return (
                                    <MyFlex
                                        key={`${participant.uid}-${index}`}
                                        direction={'row'}
                                        gap={2}
                                        py={2}
                                        px={3}
                                        me={1}
                                        align={'center'}
                                        justifyContent={'space-between'}
                                        _hover={{
                                            bg: 'bg.muted'
                                        }}
                                        cursor={
                                            selectedCurrentUsers.length ===
                                            maxLength
                                                ? 'not-allowed'
                                                : 'pointer'
                                        }
                                        onClick={() => {
                                            handleToggleSelection(participant);
                                        }}
                                    >
                                        <MyText
                                            //   fontSize={'0.8rem'}
                                            fontWeight={'semibold'}
                                        >
                                            {participant.name}
                                        </MyText>

                                        <MyButton
                                            aria-label={`Toggle Selection ${participant.uid}`}
                                            size={'xs'}
                                            icon={
                                                selectedCurrentUsers.some(
                                                    (p) =>
                                                        p.uid ===
                                                        participant.uid
                                                )
                                                    ? 'CHECK'
                                                    : 'UNCHECK'
                                            }
                                            colorPalette={
                                                selectedCurrentUsers.some(
                                                    (p) =>
                                                        p.uid ===
                                                        participant.uid
                                                )
                                                    ? 'selected'
                                                    : 'unselected'
                                            }
                                        />
                                    </MyFlex>
                                );
                            })}
                        </MyFlex>

                        {selectedCurrentUsers.length === maxLength && (
                            <MyText
                                fontSize={'0.8rem'}
                                fontWeight={'semibold'}
                                color={'red.500'}
                            >
                                {`Limite de ${maxLength} participantes alcanzado.`}
                            </MyText>
                        )}

                        {hasMore && (
                            <MyButton
                                aria-label="Add Participant"
                                leftIcon={'Download'}
                                size={'xs'}
                                variant={'outline'}
                                onClick={() => {
                                    loadMoreItems();
                                }}
                            >
                                Cargar más
                            </MyButton>
                        )}
                    </MyFlex>
                }
            />
        </MyFlex>
    );
};

export default FormikInputCurrentUsers;

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
