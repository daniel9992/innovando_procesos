import {
    FormikInputSelectByItems,
    FormikInputText,
    FormikInputTextArea
} from '@src/customAgencyTool/components/formik';
import type { InterfaceCountry } from '@src/customAgencyTool/components/formik/05formikInputComplex/formikInputSelectedCountry';
import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
import ShowCountry from '@src/customAgencyTool/components/showCountry/showCountry';
import {
    MyButton,
    MyDivider,
    MyDrawer,
    MyFlex,
    MyText
} from '@src/customAgencyTool/components/ui';
import { FastField, Field, Formik, type FormikHelpers } from 'formik';
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type FC,
    type ReactNode
} from 'react';
import {
    EnumContryISO3166Code,
    GenerateInputsContry,
    GetStringPoliticalDivision,
    showSelectedContryList,
    type InterfacePoliticalDivisionFather
} from '../../../domain/contryModel';

const defaultPoliticalDivision: InterfacePoliticalDivisionFather = {
    contry: ''
};

interface ISelectedPloliticalDivision {
    contry: string;
    politicalDivision: InterfacePoliticalDivisionFather;
    clientDireccion: string;
}

interface InterfaceSelectedPoliticalDivisionProps {
    politicalDivision?: InterfacePoliticalDivisionFather;
    clientDireccion: string;

    onChange?: (
        values: InterfacePoliticalDivisionFather,
        clientDireccion: string
    ) => void;
}

const SelectedPoliticalDivision: FC<
    InterfaceSelectedPoliticalDivisionProps
> = ({
    politicalDivision = defaultPoliticalDivision,
    clientDireccion,
    onChange = () => {}
}) => {
    const [showDrawer, setShowDrawer] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const initialFormValues = useMemo((): ISelectedPloliticalDivision => {
        return {
            contry: politicalDivision.contry,
            politicalDivision: politicalDivision,
            clientDireccion: clientDireccion
        };
    }, [politicalDivision, clientDireccion]);

    const [startValues, setStartValues] =
        useState<ISelectedPloliticalDivision>(initialFormValues);

    useEffect(() => {
        setStartValues(initialFormValues);
    }, [initialFormValues]);

    const handledOnSubmit = (
        values: ISelectedPloliticalDivision,
        formik: FormikHelpers<ISelectedPloliticalDivision>
    ) => {
        //  console.log('values', values);

        setShowDrawer(false);

        onChange(values.politicalDivision, values.clientDireccion);

        formik.setSubmitting(false);
    };

    const findPoliticalDivisionByContry = useCallback(
        (country: string): InterfaceCountry => {
            const findCountry = showSelectedContryList.find(
                (item) => item.value === country
            );

            if (findCountry) {
                const result: InterfaceCountry = {
                    name: findCountry.label as string,
                    iso3166Code: findCountry.value as string
                };
                return result;
            } else {
                return {
                    name: '',
                    iso3166Code: country
                };
            }
        },
        []
    );

    return (
        <>
            <MyFlex
                direction={'row'}
                justifyContent={'space-between'}
                align={'center'}
                p={0}
                px={3}
                bg={'bg.muted'}
            >
                <MyFlex
                    direction={'row'}
                    p={0}
                    display={
                        politicalDivision.contry === '' ? 'hidden' : 'flex'
                    }
                >
                    <ShowCountry
                        country={{
                            name: politicalDivision.contryName,
                            iso3166Code: politicalDivision.contry
                        }}
                    />
                    <MyText truncate lineClamp={1} fontSize={'0.8rem'}>
                        <strong>División:</strong>{' '}
                        {GetStringPoliticalDivision(politicalDivision, {
                            withName: false,
                            withOutContry: true,
                            separator: ' '
                        })}
                    </MyText>
                </MyFlex>

                <MyButton
                    aria-label="Editar divición politica"
                    size={'xs'}
                    icon={'FLAG'}
                    variant={'outline'}
                    colorPalette={'blue'}
                    loading={false}
                    onClick={() => {
                        setShowDrawer(true);
                    }}
                />
            </MyFlex>

            <MyDrawer
                withOutPortal={true}
                placement={'end'}
                size={'md'}
                isOpen={showDrawer}
                onOpenChange={() => {
                    setShowDrawer(false);
                }}
                header={'Division Politica'}
            >
                {isRefreshing && (
                    <>
                        <LoadingWithText text={'Cargando...'} />
                    </>
                )}
                {!isRefreshing && (
                    <>
                        <Formik
                            initialValues={startValues}
                            onSubmit={handledOnSubmit}
                            enableReinitialize
                        >
                            {(props) => (
                                <MyFlex
                                    direction={'column'}
                                    gap={5}
                                    p={0}
                                    my={3}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            props.handleSubmit();
                                        }
                                    }}
                                >
                                    <MyFlex
                                        direction={'row'}
                                        justifyContent={'space-between'}
                                        align={'center'}
                                        p={0}
                                    >
                                        <ShowCountry
                                            country={findPoliticalDivisionByContry(
                                                props.values.contry
                                            )}
                                            opctions={{
                                                showText: false
                                            }}
                                        />

                                        <Field
                                            name="contry"
                                            label="País"
                                            icon="FLAG"
                                            showItem={['label']}
                                            items={showSelectedContryList}
                                            component={FormikInputSelectByItems}
                                            onChange={(values: string[]) => {
                                                const firstValue = values[0];
                                                if (!firstValue) return;
                                                setIsRefreshing(true);
                                                const copyValues: ISelectedPloliticalDivision =
                                                    {
                                                        ...props.values,
                                                        contry: firstValue,
                                                        politicalDivision: {
                                                            contry: firstValue as EnumContryISO3166Code
                                                        }
                                                    };
                                                setStartValues(copyValues);
                                                setTimeout(() => {
                                                    setIsRefreshing(false);
                                                }, 100);
                                            }}
                                        />
                                    </MyFlex>

                                    <MyDivider />

                                    <MyFlex direction={'row'} gap={6} p={0}>
                                        <MyText
                                            fontSize={'0.8rem'}
                                            color={'gray'}
                                            fontWeight={'semibold'}
                                        >
                                            División politica:
                                        </MyText>

                                        {/* {props.values.contry === '' && (
                                            <Field
                                                name="contry"
                                                label="País"
                                                icon="COUNTRY"
                                                component={
                                                    FormikInputSelectedCountry
                                                }
                                            />
                                        )} */}
                                    </MyFlex>

                                    <MyFlex direction={'column'} p={0} gap={5}>
                                        <GenerateInputsByPoliticalDivision
                                            contry={props.values.contry}
                                        />
                                    </MyFlex>

                                    <MyDivider />

                                    <MyFlex bento>
                                        <FastField
                                            name="clientDireccion"
                                            label="Dirección pricipal"
                                            icon="DIRECTION"
                                            component={FormikInputTextArea}
                                        />
                                    </MyFlex>

                                    <MyFlex
                                        direction={'row'}
                                        justifyContent={'flex-end'}
                                        align={'center'}
                                        p={0}
                                    >
                                        <MyButton
                                            aria-label="Editar divición politica"
                                            leftIcon={'SAVE'}
                                            colorPalette={'blue'}
                                            loading={
                                                props.isSubmitting ||
                                                props.isValidating
                                            }
                                            onClick={() => {
                                                props.submitForm();
                                            }}
                                        >
                                            Aceptar
                                        </MyButton>
                                    </MyFlex>
                                </MyFlex>
                            )}
                        </Formik>{' '}
                    </>
                )}
            </MyDrawer>
        </>
    );
};

export default SelectedPoliticalDivision;

interface InterfaceGenerateInputs {
    contry: EnumContryISO3166Code | string;
}
const GenerateInputsByPoliticalDivision: FC<InterfaceGenerateInputs> = ({
    contry
}) => {
    const [resultNodos, setResultNodos] = useState<ReactNode>(<></>);

    useEffect(() => {
        const results = GenerateInputsContry(contry as EnumContryISO3166Code);

        if (!results) {
            return;
        }

        const nodes = results.arrayInputs.map((item, index: number) => {
            return (
                <div
                    key={`input-InterfaceInputsContry-key-${index}`}
                    style={{
                        width: '100%'
                    }}
                >
                    <Field
                        icon={item.icon}
                        label={item.label}
                        name={`politicalDivision.${item.name}`}
                        component={FormikInputText}
                    />
                </div>
            );
        });

        setResultNodos(<>{nodes}</>);
    }, [contry]);

    return resultNodos;
};
