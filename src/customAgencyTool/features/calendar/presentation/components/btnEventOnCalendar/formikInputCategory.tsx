import type { FieldProps } from 'formik';
import { useEffect, useState, type FC } from 'react';

import {
    useAppDispatch,
    useAppSelector
} from '@src/customAgencyTool/app/hooks';
import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
import {
    MyButton,
    MyColorPickUp,
    MyFlex,
    MyInputText,
    MyText
} from '@src/customAgencyTool/components/ui';
import { MyDialog } from '@src/customAgencyTool/components/ui/myDialog';
import type { InterfaceCategory } from '@src/customAgencyTool/features/calendar/domain/calendarEvent.entity';
import {
    readCategory,
    selectCategories,
    updateCategory
} from '../../../infrastructure/calendarSlice';

interface InterfaceFormikInputCategory {
    label?: string;
    maxLength?: number;
}

const FormikInputCategory: FC<InterfaceFormikInputCategory & FieldProps> = ({
    maxLength = 1,
    field,
    form
}) => {
    /**
     *  ? -----------------------------
     *  *  Values
     *  ? -----------------------------
     */
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectCategories);

    const [isLoading, setIsLoading] = useState(false);
    const [isManagerOpen, setIsManagerOpen] = useState(false);
    const [managedCategories, setManagedCategories] = useState<
        InterfaceCategory[]
    >([]);

    // Convertimos selectedCategories en un estado local
    const [selectedCategories, setSelectedCategories] = useState<
        InterfaceCategory[]
    >([]);

    /**
     *  ? -----------------------------
     *  *  State
     *  ? -----------------------------
     */
    useEffect(() => {
        // Actualizamos el estado local cuando cambie el valor del campo
        if (Array.isArray(field.value)) {
            setSelectedCategories(field.value || []);
        } else {
            setSelectedCategories([field.value]);
        }
    }, [field.value]);

    useEffect(() => {
        setIsLoading(true);
        dispatch(readCategory());
        setIsLoading(false);
    }, [dispatch]);

    useEffect(() => {
        //console.log('categories', categories);
        setManagedCategories(categories);
    }, [categories]);

    /**
     *  ? -----------------------------
     *  *  Add Category
     *  ? -----------------------------
     */
    const handleAddCategory = () => {
        setManagedCategories((prev) => [
            ...prev,
            {
                id: Math.random().toString(36).substring(2, 15),
                label: 'Nueva Categoría',
                color: '#4299E1'
            }
        ]);
    };

    /**
     *  ? -----------------------------
     *  *  Update Category
     *  ? -----------------------------
     */
    const handleUpdateCategory = (
        id: string,
        newValues: Partial<InterfaceCategory>
    ) => {
        setSelectedCategories((prev) => {
            const findCategorySelected = prev.find((cat) => cat.id === id);
            if (findCategorySelected) {
                const copySelectedCategories = [...prev];
                copySelectedCategories[
                    copySelectedCategories.indexOf(findCategorySelected)
                ] = { ...findCategorySelected, ...newValues };
                return copySelectedCategories;
            }
            return prev;
        });

        setManagedCategories((prev) => {
            const findManagedCategories = prev.find((cat) => cat.id === id);
            if (findManagedCategories) {
                const copyManagedCategories = [...prev];
                copyManagedCategories[
                    copyManagedCategories.indexOf(findManagedCategories)
                ] = { ...findManagedCategories, ...newValues };
                return copyManagedCategories;
            }
            return prev;
        });
    };

    /**
     *  ? -----------------------------
     *  *  Delete Category
     *  ? -----------------------------
     */
    const handleDeleteCategory = (categoryToDelete: InterfaceCategory) => {
        setManagedCategories((prev) =>
            prev.filter((cat) => cat.id !== categoryToDelete.id)
        );
        const newSelection = selectedCategories.filter(
            (cat) => cat.id !== categoryToDelete.id
        );
        setSelectedCategories(newSelection);
        form.setFieldValue(field.name, newSelection);
    };

    /**
     *  ? -----------------------------
     *  *  Toggle Selection
     *  ? -----------------------------
     */
    const handleToggleSelection = (categoryToToggle: InterfaceCategory) => {
        const isSelected = selectedCategories.some(
            (cat) => cat.id === categoryToToggle.id
        );

        if (isSelected) {
            const newSelection = selectedCategories.filter(
                (cat) => cat.id !== categoryToToggle.id
            );
            setSelectedCategories(newSelection);
            form.setFieldValue(field.name, newSelection);
        } else if (selectedCategories.length < maxLength) {
            const newSelection = [...selectedCategories, categoryToToggle];
            setSelectedCategories(newSelection);
            form.setFieldValue(field.name, newSelection);
        } else {
            console.warn(`Límite de ${maxLength} categorías alcanzado.`);
        }
    };

    /**
     *  ? -----------------------------
     *  *  Accept Changes
     *  ? -----------------------------
     */
    const handleAcceptChanges = () => {
        const currentSelectedIds = selectedCategories.map((c) => c.id);
        const updatedSelectionInFormik = managedCategories.filter((c) =>
            currentSelectedIds.includes(c.id)
        );
        setSelectedCategories(updatedSelectionInFormik);
        form.setFieldValue(field.name, updatedSelectionInFormik);
        setIsManagerOpen(false);

        // Actualizamos las categorías
        dispatch(updateCategory({ categories: managedCategories }));
    };

    /**
     *  ? -----------------------------
     *  *  Render
     *  ? -----------------------------
     */
    if (isLoading) {
        return <LoadingWithText text={'Cargando categorías...'} />;
    }

    return (
        <MyFlex width={'100%'} flexWrap={'wrap'} p={0} m={0}>
            <MyFlex
                direction="row"
                flexWrap={'wrap'}
                align="center"
                gap={2}
                height={'100%'}
                py={0}
            >
                <MyButton
                    aria-label="Manage Categories"
                    icon={'ADD'}
                    height={'30px'}
                    width={'30px'}
                    onClick={() => setIsManagerOpen(true)}
                />
                {selectedCategories.map((category) => (
                    <MyFlex
                        key={category.id}
                        gap={1}
                        align={'center'}
                        direction={'row'}
                    >
                        <MyFlex
                            height={'20px'}
                            width={'10px'}
                            backgroundColor={category.color}
                        />
                        <MyText fontSize={'0.8rem'}>{category.label}</MyText>
                    </MyFlex>
                ))}
            </MyFlex>
            {/* --- CORRECCIÓN APLICADA AQUÍ --- */}
            {/* El diálogo solo se renderiza cuando isManagerOpen es true */}
            {isManagerOpen && (
                <MyDialog
                    isOpen={isManagerOpen}
                    onClose={() => setIsManagerOpen(false)}
                    header={'Control de categorías'}
                    buttons={[]}
                    body={
                        <MyFlex direction={'column'} gap={3}>
                            <MyFlex
                                direction={'column'}
                                gap={3}
                                maxHeight={'50vh'}
                                overflowY={'auto'}
                            >
                                {managedCategories.map((category) => {
                                    const isSelected = selectedCategories.some(
                                        (c) => c.id === category.id
                                    );
                                    return (
                                        <MyFlex
                                            key={category.id}
                                            gap={2}
                                            align={'center'}
                                            direction={'row'}
                                        >
                                            <MyColorPickUp
                                                color={category.color}
                                                onChange={(color) =>
                                                    handleUpdateCategory(
                                                        category.id,
                                                        {
                                                            color
                                                        }
                                                    )
                                                }
                                            />
                                            <MyInputText
                                                value={category.label}
                                                onChange={(e) =>
                                                    handleUpdateCategory(
                                                        category.id,
                                                        {
                                                            label: e.target
                                                                .value
                                                        }
                                                    )
                                                }
                                            />
                                            <MyButton
                                                aria-label="Delete Category"
                                                icon={'TRASH'}
                                                onClick={() =>
                                                    handleDeleteCategory(
                                                        category
                                                    )
                                                }
                                            />
                                            <MyButton
                                                aria-label="Select Category"
                                                icon={
                                                    isSelected
                                                        ? 'CHECK'
                                                        : 'UNCHECK'
                                                }
                                                colorPalette={
                                                    isSelected
                                                        ? 'selected'
                                                        : 'unselected'
                                                }
                                                onClick={() =>
                                                    handleToggleSelection(
                                                        category
                                                    )
                                                }
                                            />
                                        </MyFlex>
                                    );
                                })}
                            </MyFlex>
                            {selectedCategories.length === maxLength && (
                                <MyText
                                    fontSize={'0.8rem'}
                                    fontWeight={'semibold'}
                                    color={'red.500'}
                                >
                                    No se pueden agregar más categorías
                                </MyText>
                            )}
                            <MyFlex
                                justifyContent={'space-between'}
                                gap={3}
                                pt={4}
                            >
                                <MyButton
                                    leftIcon={'ADD'}
                                    border={'1px dashed gray'}
                                    variant={'ghost'}
                                    onClick={handleAddCategory}
                                >
                                    Agregar categoría
                                </MyButton>
                                <MyButton
                                    leftIcon={'SUBMIT'}
                                    variant={'outline'}
                                    onClick={handleAcceptChanges}
                                >
                                    Aceptar
                                </MyButton>
                            </MyFlex>
                        </MyFlex>
                    }
                />
            )}
        </MyFlex>
    );
};

export default FormikInputCategory;
