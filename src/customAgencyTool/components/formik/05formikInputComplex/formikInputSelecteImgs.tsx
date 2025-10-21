import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import type { FieldProps } from 'formik';
import { useEffect, useState, type FC } from 'react';
import LoadingWithText from '../../loading/loadingWithText';
import {
    MyButton,
    MyCenter,
    MyDialog,
    MyFileImgUploadStandalone,
    MyFlex,
    MyImage,
    MyText,
    MyUploadFile
} from '../../ui';

import { GetImgPatyByLogoType } from '@src/customAgencyTool/assets/_imgListToSelected/imgListToSelected_BL';
import { ALLOWED_FILE_TYPES } from '../../ui/myUploadFile';
import { LabelIncon } from '../utils/labelIncon';

export interface InterfaceImgItem {
    id: string;
    src: string;
    alt: string;
    label: string;
}

interface FormikInputSelectByItemsProps {
    label?: string;
    icon?: string;

    isDownloadable?: boolean;
    acceptedFileTypes?: string[];
    startImg?: InterfaceImgItem;
    items: InterfaceImgItem[];
    isClearTrigger?: boolean;
    isMultiple?: boolean;
    maxLength?: number;
    height?: string;
}

export const FormikInputSelectImgs: FC<
    FormikInputSelectByItemsProps & FieldProps
> = ({
    label,
    icon,
    startImg,
    isDownloadable = false,
    isMultiple,
    maxLength = 1,
    height = '150px',
    items,
    field,
    form
}) => {
    const isError = form.touched[field.name] && form.errors[field.name];

    const [isManagerOpen, setIsManagerOpen] = useState(false);

    const [managedItems, setManagedItems] = useState<InterfaceImgItem[]>([
        // ...items
        //...ItemsMock
    ]);

    const [fileToUpload, setFileToUpload] = useState<File[] | null>(null);

    const [selectedItem, setSelectedItem] = useState<InterfaceImgItem[]>([]);

    useEffect(() => {
        setManagedItems([...items]);
    }, [items]);

    useEffect(() => {
        if (field.value) {
            if (isMultiple) {
                const values = field.value as string[];
                setSelectedItem(
                    values.map((value, index) => {
                        const foundItem = items.find(
                            (item) => item.src === value
                        );
                        if (foundItem) {
                            return foundItem as InterfaceImgItem;
                        } else {
                            return {
                                id: value,
                                src: value,
                                alt: 'Img-' + index,
                                label: 'Img ' + index
                            };
                        }
                    })
                );
                return;
            }
            const value = `${field.value}`;
            // search on items
            const foundItem = items.find((item) => item.src === value);

            if (foundItem) {
                setSelectedItem([foundItem]);
            }
        }
    }, [field, items, isMultiple]);

    /**
     *  ? -----------------------------
     *  *  Toggle Selection
     *  ? -----------------------------
     */
    const handleToggleSelection = (itemToToggle: InterfaceImgItem) => {
        const isSelected = selectedItem.some(
            (cat) => cat.id === itemToToggle.id
        );

        if (!isMultiple) {
            if (isSelected) {
                setSelectedItem([]);
            } else {
                setSelectedItem([itemToToggle]);
            }
            return;
        }

        if (isSelected) {
            const newSelection = selectedItem.filter(
                (cat) => cat.id !== itemToToggle.id
            );
            setSelectedItem(newSelection);
            // form.setFieldValue(field.name, newSelection);
        } else if (selectedItem.length < maxLength) {
            const newSelection = [...selectedItem, itemToToggle];

            setSelectedItem(newSelection);
            // form.setFieldValue(field.name, newSelection);
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
        setIsManagerOpen(false);
        if (isMultiple) {
            const currentSelectedIds = selectedItem.map((c) => c.id);
            const updatedSelectionInFormik = managedItems.filter((c) =>
                currentSelectedIds.includes(c.id)
            );
            setSelectedItem(updatedSelectionInFormik);
            form.setFieldValue(field.name, updatedSelectionInFormik);
            return;
        }

        const value = selectedItem[0].src ? selectedItem[0].src : '';

        form.setFieldValue(field.name, value);
    };

    const handledOnClose = () => {
        handleAcceptChanges();
    };

    /**
     *  ? -----------------------------
     *  *  Render
     *  ? -----------------------------
     */
    return (
        <MyFlex
            direction={'column'}
            position={'relative'}
            width={'100%'}
            border={isError ? '2px solid red' : ''}
        >
            <LabelIncon label={label} icon={icon} htmlFor={field.name} />

            <MyFlex
                width={'100%'}
                height={height}
                direction={'row'}
                flexWrap={'wrap'}
                justifyContent={'center'}
                align={'center'}
                bg={'bg.muted'}
                borderRadius={'md'}
                cursor="pointer"
                onClick={() => setIsManagerOpen(true)}
            >
                {selectedItem.length === 0 && !startImg && (
                    <SelectedIcons iconName="Image" size={50} color="gray" />
                )}
                {selectedItem.length === 0 && startImg && (
                    <MyImage
                        src={startImg.src}
                        alt="img"
                        width="100%"
                        height="100%"
                        objectFit="contain"
                    />
                )}
                {selectedItem.length > 0 &&
                    selectedItem.map((item) => {
                        return (
                            <MyImage
                                key={item.id}
                                src={GetImgPatyByLogoType(item.src)}
                                alt="img"
                                height={isMultiple ? '35%' : '90%'}
                                objectFit="contain"
                            />
                        );
                    })}
            </MyFlex>

            <MyDialog
                isOpen={isManagerOpen}
                onClose={handledOnClose}
                header={'Seleccionar una imagen'}
                showCloseButton={false}
                buttons={[]}
                body={
                    <MyFlex direction={'column'} gap={3}>
                        {isDownloadable && (
                            <MyFileImgUploadStandalone
                                type={'image'}
                                height={'8rem'}
                                title={'Foto de perfil'}
                                acceptedFileTypes={[
                                    'image/png',
                                    'image/jpeg',
                                    'image/jpg'
                                ]}
                                onFileChange={async (event: File | null) => {
                                    console.log('File:', event);
                                }}
                            />
                        )}

                        <MyFlex
                            direction={'column'}
                            gap={1}
                            maxHeight={'40vh'}
                            overflowY={'auto'}
                        >
                            {managedItems.map((item) => {
                                const isSelected = selectedItem.some(
                                    (c) => c.id === item.id
                                );
                                return (
                                    <MyFlex
                                        key={item.label}
                                        gap={2}
                                        align={'center'}
                                        direction={'row'}
                                        cursor={'pointer'}
                                        onClick={() =>
                                            handleToggleSelection(item)
                                        }
                                        _hover={{
                                            backgroundColor: 'bg.muted'
                                        }}
                                        me={1}
                                        pe={3}
                                    >
                                        <MyCenter>
                                            <MyImage
                                                src={GetImgPatyByLogoType(
                                                    item.src
                                                )}
                                                alt={item.alt}
                                                boxSize={'80px'}
                                                objectFit={'contain'}
                                            />
                                        </MyCenter>
                                        <MyText
                                            // fontSize={'0.8rem'}
                                            flex={1}
                                        >
                                            {item.label}
                                        </MyText>
                                        <MyButton
                                            aria-label={`Select Image ${item.label}`}
                                            icon={
                                                isSelected ? 'CHECK' : 'UNCHECK'
                                            }
                                            colorPalette={
                                                isSelected
                                                    ? 'selected'
                                                    : 'unselected'
                                            }
                                        />
                                    </MyFlex>
                                );
                            })}
                        </MyFlex>

                        {selectedItem.length === maxLength && (
                            <MyText
                                fontSize={'0.8rem'}
                                fontWeight={'semibold'}
                                color={'red.500'}
                            >
                                No se pueden seleccionar más imágenes.
                            </MyText>
                        )}

                        <MyFlex justifyContent={'space-between'} gap={3} pt={4}>
                            <div></div>
                            <MyUploadFile
                                label="Subir documentos"
                                accept={ALLOWED_FILE_TYPES.PDF}
                                maxFiles={3}
                                display={'none'}
                                onChange={(files) => {
                                    console.log('Files:', files);
                                    setFileToUpload(files);
                                }}
                            />
                            <MyButton
                                leftIcon={'SUBMIT'}
                                variant={'outline'}
                                onClick={handleAcceptChanges}
                            >
                                Aceptar
                            </MyButton>
                        </MyFlex>

                        {fileToUpload && (
                            <MyFlex
                                direction={'column'}
                                gap={1}
                                maxHeight={'200mx'}
                            >
                                {fileToUpload.map((file, index) => (
                                    <MyFlex
                                        key={index}
                                        direction={'row'}
                                        gap={2}
                                        align={'center'}
                                        px={'10px'}
                                        bg={'bg.muted'}
                                    >
                                        <MyFlex
                                            align={'center'}
                                            justifyContent={'center'}
                                        >
                                            {true && (
                                                <MyFlex>
                                                    <MyButton
                                                        aria-label="Refresh Uploaded File"
                                                        icon={'REFRESH'}
                                                        colorPalette={'refresh'}
                                                        size={'2xs'}
                                                    />
                                                </MyFlex>
                                            )}
                                            {false && (
                                                <MyFlex>
                                                    <SelectedIcons
                                                        iconName="CHECK"
                                                        size={15}
                                                        color="green"
                                                    />
                                                </MyFlex>
                                            )}
                                            {false && (
                                                <MyFlex>
                                                    <SelectedIcons
                                                        iconName="PDF"
                                                        size={15}
                                                        color="fg.muted"
                                                    />
                                                </MyFlex>
                                            )}
                                            {false && (
                                                <LoadingWithText
                                                    text={''}
                                                    size={'sm'}
                                                />
                                            )}
                                        </MyFlex>
                                        <MyText
                                            fontSize={'0.8rem'}
                                            fontWeight={'semibold'}
                                        >
                                            {file.name}
                                        </MyText>
                                    </MyFlex>
                                ))}
                            </MyFlex>
                        )}
                    </MyFlex>
                }
            />
        </MyFlex>
    );
};

export const ItemsMock: InterfaceImgItem[] = [
    {
        id: '1',
        src: 'https://picsum.photos/200/300',
        alt: 'img1',
        label: 'img1'
    },
    {
        id: '2',
        src: 'https://picsum.photos/200/300',
        alt: 'img2',
        label: 'img2'
    },
    {
        id: '3',
        src: 'https://picsum.photos/200/300',
        alt: 'img3',
        label: 'img3'
    },
    {
        id: '4',
        src: 'https://picsum.photos/200/300',
        alt: 'img4',
        label: 'img4'
    },
    {
        id: '5',
        src: 'https://picsum.photos/200/300',
        alt: 'img5',
        label: 'img5'
    }
];
