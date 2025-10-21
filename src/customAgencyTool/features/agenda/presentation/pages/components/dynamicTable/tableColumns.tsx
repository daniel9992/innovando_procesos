import { MyFlex, MyText } from '@src/customAgencyTool/components/ui';
import type { ColumnDefinition } from '@src/customAgencyTool/components/virtualizedTable/model';
import type { InterfaceClient } from '@src/customAgencyTool/features/agenda/domain/agendaModel';

export const TableColumnsAgenda: ColumnDefinition<InterfaceClient>[] = [
    {
        key: 'legalIdentity',
        header: 'ID',
        headerStyle: {
            textAlign: 'center'
        },
        headerOnClick: () => {
            console.log('Header on click');
        },
        width: '10%',
        renderCell: (item) => (
            <MyFlex direction={'column'} width={'100%'} gap={0} p={0}>
                <MyText
                    textAlign={'center'}
                    fontSize={'0.8rem'}
                    truncate
                    lineClamp="1"
                >
                    {item.legalIdentity}
                </MyText>
            </MyFlex>
        )
    },
    {
        key: 'clientName',
        header: 'Nombre',
        headerOnClick: () => {
            console.log('Header on click');
        },
        width: '40%',
        renderCell: (item) => (
            <MyFlex direction={'column'} width={'100%'} gap={0} p={0}>
                <MyText
                    //fontSize={'0.8rem'}
                    truncate
                    lineClamp="1"
                >
                    {item.clientName}
                </MyText>
            </MyFlex>
        )
    },
    {
        key: 'phone',
        header: 'Teléfono Empresarial',
        headerOnClick: () => {
            console.log('Header on click');
        },
        width: '25%',
        renderCell: (item) => (
            <MyFlex direction={'column'} width={'100%'} gap={0} p={0}>
                <MyText fontSize={'0.8rem'} truncate lineClamp="1">
                    {item.phone}
                </MyText>
            </MyFlex>
        )
    },
    {
        key: 'email',
        header: 'Correo Empresarial',
        headerOnClick: () => {
            console.log('Header on click');
        },
        width: '25%',
        renderCell: (item) => (
            <MyFlex direction={'column'} width={'100%'} gap={0} p={0}>
                <MyText fontSize={'0.8rem'} truncate lineClamp="1">
                    {item.emailForInvoicing}
                </MyText>
            </MyFlex>
        )
    }
];
