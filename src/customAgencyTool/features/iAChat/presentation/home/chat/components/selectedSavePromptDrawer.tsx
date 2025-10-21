import {
    useAppDispatch,
    useAppSelector
} from '@src/customAgencyTool/app/hooks';
import {
    MyButton,
    MyDrawer,
    MyFlex,
    MyMenu,
    MyText
} from '@src/customAgencyTool/components/ui';
import {
    createPrompt,
    deletePrompt,
    readPrompt,
    selectChatPrompts,
    selectStatusPrompt,
    updatePrompt
} from '@src/customAgencyTool/features/iAChat/infrastructure/chat.reducer';
import { useCallback, useEffect, useMemo, useState, type FC } from 'react';

import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import type { IPrompt } from '@src/customAgencyTool/features/iAChat/domain/chatConfig.model';
import { GetToday } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { GetRamdom } from '@src/customAgencyTool/utils/stringUtils/getRamdom';
import DialogToRename from './dialogToRename';

interface IManagePrompt {
    showRenameDialog: boolean;
    suggestPrompt?: IPrompt;
}
const initialStateManagePrompt: IManagePrompt = {
    showRenameDialog: false,
    suggestPrompt: undefined
};

interface ISelectedSavePromptDrawer {
    showDrawer: boolean;
    onClose: () => void;
    onSelectPrompt: (prompt: IPrompt) => void;
    suggestPrompt?: IPrompt;
}

const SelectedSavePromptDrawer: FC<ISelectedSavePromptDrawer> = ({
    showDrawer,
    onClose,
    onSelectPrompt,
    suggestPrompt
}) => {
    /**
     *  ? -----------------------------
     *  *  Variables
     *  ? -----------------------------
     */
    const [showDrawerLocal, setShowDrawerLocal] = useState(false);

    const dispatch = useAppDispatch();

    const statusRedux = useAppSelector(selectStatusPrompt);

    const selectedPrompt = useAppSelector(selectChatPrompts);

    const prompts = useMemo(() => {
        if (!selectedPrompt) {
            return [];
        }

        return selectedPrompt;
    }, [selectedPrompt]);

    const [managePrompt, setManagePrompt] = useState<IManagePrompt>(
        initialStateManagePrompt
    );

    /**
     *  ? -----------------------------
     *  *  Handle Drawer
     *  ? -----------------------------
     */
    const handleOnClose = useCallback(() => {
        setShowDrawerLocal(false);
        onClose();
    }, [onClose]);

    const handleOnOpen = useCallback(() => {
        setShowDrawerLocal(true);
    }, []);

    /**
     *  ? -----------------------------
     *  *  State
     *  ? -----------------------------
     */
    useEffect(() => {
        // 1. Si existe un prompt sugerido, muestra el diálogo de renombrado

        if (showDrawer === false && suggestPrompt) {
            setManagePrompt((prev) => {
                return {
                    ...prev,
                    showRenameDialog: true,
                    suggestPrompt: suggestPrompt
                };
            });
        }
        // 2. Si no existe un prompt sugerido, muestra el diálogo de creación
        else if (showDrawer) {
            dispatch(
                readPrompt({
                    action: 'readPrompt'
                })
            );
            handleOnOpen();
        }
    }, [showDrawer, suggestPrompt, handleOnOpen, dispatch]);

    /**
     *  ? -----------------------------
     *  *  Handle Events
     *  ? -----------------------------
     */
    const onSelectPromptClick = (prompt: IPrompt) => {
        onSelectPrompt(prompt);

        handleOnClose();
    };

    const onCreatePrompt = async (prompt: IPrompt) => {
        // 1. Guarda el prompt
        dispatch(
            createPrompt({
                prompt
            })
        );

        // 2. Cierra el diálogo renombrado
        setManagePrompt(initialStateManagePrompt);
    };

    const onRenamePrompt = async (prompt: IPrompt) => {
        setManagePrompt((prev) => {
            return {
                ...prev,
                showRenameDialog: true,
                suggestPrompt: prompt
            };
        });
    };

    const onDeletePrompt = async (prompt: IPrompt) => {
        const temp = prompts.filter((item) => item.id !== prompt.id);

        // console.log('temp', temp);
        // return;
        dispatch(
            deletePrompt({
                values: temp
            })
        );
    };

    const onCopyPrompt = async (prompt: IPrompt) => {
        const textToCopy = prompt.prompt;
        navigator.clipboard.writeText(textToCopy);
    };

    const onUpdatePrompt = async (prompt: IPrompt) => {
        const temp = prompts.map((item) => {
            if (item.id === prompt.id) {
                return prompt;
            }
            return item;
        });

        dispatch(
            updatePrompt({
                values: temp
            })
        );

        // 2. Cierra el diálogo renombrado
        setManagePrompt(initialStateManagePrompt);
    };

    /**
     *  ? -----------------------------
     *  *  Submit Rename Prompt
     *  ? -----------------------------
     */
    const handledOnSumbitPrompt = async (newTitle: string) => {
        const newPrompt = managePrompt.suggestPrompt;
        if (!newPrompt) {
            return;
        }
        const renamedPrompt: IPrompt = {
            ...newPrompt,
            title: newTitle
        };
        if (newPrompt.id === '') {
            renamedPrompt.id = GetRamdom();
            onCreatePrompt(renamedPrompt);
        } else {
            onUpdatePrompt(renamedPrompt);
        }
    };

    /**
     *  ? -----------------------------
     *  *  Render
     *  ? -----------------------------
     */
    const ShowStatusRender = () => {
        if (statusRedux === ReduxStatus.LOADING) {
            return (
                <MyFlex
                    direction={'column'}
                    align={'center'}
                    justifyContent={'center'}
                    minHeight={'20vh'}
                    gap={5}
                >
                    <LoadingWithText text={'Cargando...'} />
                </MyFlex>
            );
        }
        if (prompts.length === 0) {
            return (
                <MyFlex
                    direction={'column'}
                    align={'center'}
                    justifyContent={'center'}
                    minHeight={'20vh'}
                    gap={5}
                >
                    <SelectedIcons iconName={'INFO'} size={'40px'} />
                    <MyText color={'gray'}>No hay Prompts Guardados</MyText>
                </MyFlex>
            );
        }
    };

    return (
        <>
            <MyDrawer
                isOpen={showDrawerLocal}
                onOpenChange={handleOnClose}
                header={'Prompts Guardados'}
                placement={'end'}
            >
                {ShowStatusRender()}

                {prompts.map((item, index) => (
                    <MyFlex
                        key={`key-save-prompt-${index}`}
                        bg={'bg.muted'}
                        direction={'column'}
                        mb={2}
                        _hover={{
                            boxShadow: 'md'
                        }}
                        gap={1}
                        p={2}
                        pb={3}
                    >
                        <MyFlex
                            direction={'row'}
                            justifyContent={'space-between'}
                            align={'center'}
                            p={0}
                        >
                            <MyText
                                fontSize={'0.8rem'}
                                fontWeight={'semibold'}
                                color={'gray'}
                                className={'noSelect'}
                            >
                                {item.title}
                            </MyText>
                            <MyMenu
                                withOutPortal={true}
                                triggerAsChild={
                                    <MyButton
                                        size={'xs'}
                                        leftIcon={'MENU_DOTS'}
                                        variant={'plain'}
                                        aria-label={'Menu ' + item.title}
                                    />
                                }
                                verticalMenuItems={[
                                    {
                                        id: 'rename',
                                        leftIcon: 'EDIT',
                                        label: 'Renombrar',
                                        type: 'item',
                                        isActive: item.title.length > 0,
                                        allowRoles: [],
                                        onClick: () => {
                                            onRenamePrompt(item);
                                        }
                                    },
                                    {
                                        id: 'copy',
                                        leftIcon: 'COPY',
                                        label: 'Copiar',
                                        type: 'item',
                                        isActive: item.title.length > 0,
                                        allowRoles: [],
                                        onClick: () => {
                                            onCopyPrompt(item);
                                        }
                                    },
                                    {
                                        id: 'delete',
                                        leftIcon: 'TRASH',
                                        label: 'Eliminar',
                                        color: 'red',
                                        type: 'item',
                                        isActive: item.title.length > 0,
                                        allowRoles: [],
                                        onClick: () => {
                                            onDeletePrompt(item);
                                        }
                                    }
                                ]}
                            />
                        </MyFlex>
                        <MyText
                            truncate={true}
                            lineClamp={4}
                            cursor={'pointer'}
                            onClick={() => {
                                onSelectPromptClick(item);
                            }}
                        >
                            {item.prompt}
                        </MyText>
                    </MyFlex>
                ))}
            </MyDrawer>

            <DialogToRename
                showDialog={managePrompt.showRenameDialog}
                onClose={() => {
                    setManagePrompt(initialStateManagePrompt);
                }}
                title={managePrompt.suggestPrompt?.title}
                headerDialog={'Renombrar Prompt'}
                fileToRename={'Nombre del Prompt'}
                onSubmit={handledOnSumbitPrompt}
            />
        </>
    );
};

export default SelectedSavePromptDrawer;

export const SomeExample = () => {
    interface IManagePront {
        showDrawer: boolean;
        suggestPrompt?: IPrompt;
    }
    const initialStateManagePrompt: IManagePront = {
        showDrawer: false,
        suggestPrompt: undefined
    };

    const [mangePrompt, setIsMangePrompt] = useState<IManagePront>(
        initialStateManagePrompt
    );

    return (
        <div>
            <h2>Home</h2>
            <MyButton
                leftIcon={'SAVE'}
                onClick={() => {
                    const temp: IManagePront = {
                        showDrawer: false,
                        suggestPrompt: {
                            id: '',
                            title: 'New Prompt',
                            prompt: 'New Prompt',
                            createdAt: GetToday()
                        }
                    };
                    setIsMangePrompt(temp);
                }}
            >
                Test New Prompt
            </MyButton>
            <MyButton
                leftIcon={'SAVE'}
                onClick={() => {
                    const temp: IManagePront = {
                        showDrawer: true
                    };
                    setIsMangePrompt(temp);
                }}
            >
                Test Selected
            </MyButton>

            <SelectedSavePromptDrawer
                showDrawer={mangePrompt.showDrawer}
                suggestPrompt={mangePrompt.suggestPrompt}
                onClose={() => {
                    setIsMangePrompt(initialStateManagePrompt);
                }}
                onSelectPrompt={(selectedPrompt) => {
                    console.log('selectedPrompt', selectedPrompt);

                    setIsMangePrompt(initialStateManagePrompt);
                }}
            />
        </div>
    );
};
