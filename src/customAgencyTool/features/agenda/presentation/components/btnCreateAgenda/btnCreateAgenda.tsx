import { Document, pdf } from '@react-pdf/renderer';
import {
    useAppDispatch,
    useAppSelector
} from '@src/customAgencyTool/app/hooks';
import LoadingSpinnerWithText from '@src/customAgencyTool/components/loading/loadingSpinnerWithText';
import {
    MyButton,
    MyDialog,
    MyFlex
} from '@src/customAgencyTool/components/ui';
import {
    GenerateExcelFile,
    type IGenericData,
    type IWorkSheet
} from '@src/customAgencyTool/components/xlsx/write/writeXlsx';
import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import { useSettingHook } from '@src/customAgencyTool/features/settings/infrastructure/settingHook';
import { saveAs } from 'file-saver';
import type { FormikHelpers } from 'formik';
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type FC,
    type ReactNode
} from 'react';
import type { InterfaceClient } from '../../../domain/agendaModel';
import { GetStringPoliticalDivision } from '../../../domain/contryModel';
import {
    createAgenda,
    readCustomerContacts,
    selectCustomerContacts,
    selectStatus,
    updateAgenda
} from '../../../infrastructure/agendaSlice';
import { AgendaPDF } from '../generatePDF/agendaPDF';
import BtnCreateAgendaForm from './btnCreateAgendaForm';

interface Props {
    selectedClient?: InterfaceClient;
    showModal?: boolean;
    onClose?: () => void;
    showBtn?: boolean;
    onChangeClient?: (client: InterfaceClient) => void;
}

const BtnCreateAgenda: FC<Props> = ({
    selectedClient,
    showModal = false,
    onClose = () => {},
    showBtn = true,
    onChangeClient = () => {}
}) => {
    const dispatch = useAppDispatch();

    const selectStatusRedux = useAppSelector(selectStatus);

    const selectCustCont = useAppSelector(selectCustomerContacts);

    const header = selectedClient ? 'Editar Cliente' : 'Crear Cliente';

    const [showModalLocal, setShowModalLocal] = useState(false);

    const { getSetting } = useSettingHook();

    useEffect(() => {
        if (!selectedClient) {
            return;
        }
        if (selectedClient.id === '') {
            return;
        }

        dispatch(
            readCustomerContacts({
                idBelongsToClient: selectedClient.id
            })
        );
    }, [selectedClient, dispatch]);

    const starClient = useMemo(() => {
        if (!selectedClient) {
            return;
        }
        if (selectedClient.id === '') {
            return;
        }
        if (selectCustCont) {
            const copyClient = { ...selectedClient };
            copyClient.customerContact = selectCustCont;
            return copyClient;
        } else {
            return selectedClient;
        }
    }, [selectedClient, selectCustCont]);

    useEffect(() => {
        setShowModalLocal(showModal);
    }, [showModal]);

    const handleOnClose = useCallback(() => {
        onClose();
        setShowModalLocal(false);
    }, [onClose]);

    const handleOnOpen = useCallback(() => {
        setShowModalLocal(true);
    }, []);

    const handleOnChangeClient = (client: InterfaceClient) => {
        onChangeClient(client);
    };

    const handledOnNewClient = () => {
        handleOnOpen();
    };

    const handledOnSubmit = async (
        values: InterfaceClient,
        formikHelpers: FormikHelpers<InterfaceClient>
    ) => {
        if (values.id === '') {
            await dispatch(
                createAgenda({
                    client: values
                })
            )
                .then((result) => {
                    const payload = result.payload as InterfaceClient;

                    if (!payload) return;

                    handleOnChangeClient(payload);
                })
                .finally(() => {
                    formikHelpers.setSubmitting(false);
                    handleOnClose();
                });
        } else {
            handleOnChangeClient(values);
            await dispatch(
                updateAgenda({
                    client: values,
                    customerContacts: selectCustCont
                })
            ).finally(() => {
                formikHelpers.setSubmitting(false);
                handleOnClose();
            });
        }
    };

    const handledOnPrint = async (client: InterfaceClient) => {
        // to generate the pdf
        const arrayOfPages: ReactNode[] = [];

        const generalConfig = await getSetting('data-id-configGeneral');

        const formatData = {
            ...client,
            internalNumber: '',
            accountRecord: []
        };

        const coverPDF = AgendaPDF({
            title: 'Cliente',
            companyInfo: generalConfig,
            agendaInfo: formatData
        }) as ReactNode;

        arrayOfPages.push(coverPDF);

        // descargar el pdf
        const blob = await pdf(<Document>{arrayOfPages}</Document>)
            .toBlob()
            .then((blob) => {
                return blob;
            })
            .catch((error) => {
                return error;
            })
            .finally(() => {
                console.log('finally');
            });

        const url = URL.createObjectURL(blob);

        const pdfName = client.clientName;

        saveAs(url, `Info - ${pdfName}.pdf`);

        // save
        await dispatch(
            updateAgenda({
                client: client,
                customerContacts: selectCustCont
            })
        );
    };

    const handledOnXLSXExport = async (client: InterfaceClient) => {
        if (client.id === '') {
            return;
        }

        const sheets: IWorkSheet[] = [];

        const iClientData: IGenericData[] = [];

        const stringPoliticalDivision = GetStringPoliticalDivision(
            client.politicalDivision,
            {
                withOutContry: false,
                withName: true
            }
        );

        const infoClientTable = [
            {
                'Información del cliente': `Tipo de identificación:`,
                Cliente: client.typeLegalIdentity
            },
            {
                'Información del cliente': `Cédula Juridica:`,
                Cliente: client.legalIdentity
            },
            {
                'Información del cliente': `Nombre completo:`,
                Cliente: client.clientName
            },
            {
                'Información del cliente': `Número de Actividad Económica:`,
                Cliente: client.economicActivityNumber
            },
            {
                'Información del cliente': `Teléfono principal:`,
                Cliente: client.phone
            },
            {
                'Información del cliente': `Correo Empresarial: `,
                Cliente: client.emailForInvoicing
            },
            {
                'Información del cliente': `División politica:`,
                Cliente: stringPoliticalDivision
            },
            {
                'Información del cliente': `Dirección:`,
                Cliente: client.clientDireccion
            }
        ];

        iClientData.push(...infoClientTable);

        const iCustomerContactData: IGenericData[] = [];

        client.customerContact.map((item) => {
            const infoCustomerContact = {
                Nombre: item.name,
                'Departamento o Rol': item.department,
                Email: item.email.join(', '),
                Teléfono: item.phone.join(', ')
            };
            iCustomerContactData.push(infoCustomerContact);
        });

        const sheet: IWorkSheet = {
            name: 'Proveedor de Servicios',
            data: iClientData
        };
        sheets.push(sheet);

        if (iCustomerContactData.length > 0) {
            const sheet3: IWorkSheet = {
                name: 'Lista de Contactos',
                data: iCustomerContactData
            };
            sheets.push(sheet3);
        }

        // create xlsx name
        const xlsxName = client.clientName;

        // export xlsx
        await GenerateExcelFile(sheets, `${xlsxName}.xlsx`);

        // save
        await dispatch(
            updateAgenda({
                client: client,
                customerContacts: selectCustCont
            })
        );
    };

    return (
        <div>
            {showBtn && (
                <MyButton
                    onClick={handledOnNewClient}
                    leftIcon={'PersonAdd'}
                    colorPalette={'edit'}
                >
                    Crear Cliente
                </MyButton>
            )}

            <MyDialog
                isOpen={showModalLocal}
                onClose={handleOnClose}
                header={header}
                placement="top"
                withOutPortal={true}
                body={
                    <>
                        {selectStatusRedux === ReduxStatus.LOADING ? (
                            <MyFlex
                                justify={'center'}
                                align={'center'}
                                direction={'column'}
                                minHeight={'25vh'}
                            >
                                <LoadingSpinnerWithText
                                    text={'Cargando contactos...'}
                                />
                            </MyFlex>
                        ) : (
                            <BtnCreateAgendaForm
                                selectedClient={starClient}
                                onSubmit={handledOnSubmit}
                                onPrint={handledOnPrint}
                                onXLSXExport={handledOnXLSXExport}
                            />
                        )}
                    </>
                }
            />
        </div>
    );
};

export default BtnCreateAgenda;
