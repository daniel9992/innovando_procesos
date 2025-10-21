import { MyFlex, MyText } from '@src/customAgencyTool/components/ui';
import type { ColumnDefinition } from '@src/customAgencyTool/components/virtualizedTable/model';
import {
    GetRoleName,
    type InterfaceCurrentUser
} from '@src/customAgencyTool/features/auth/domain/user.entity';

export const TableColumnsCurrentUser: ColumnDefinition<InterfaceCurrentUser>[] =
    [
        {
            key: 'name',
            header: 'Nombre',
            headerOnClick: () => {
                console.log('Header on click');
            },
            width: '60%',
            renderCell: (item) => {
                return (
                    <MyFlex direction={'column'} width={'100%'} gap={0} p={0}>
                        <MyText fontWeight={'semibold'}>{item.name}</MyText>
                    </MyFlex>
                );
            }
        },
        {
            key: 'role',
            header: 'Rol',
            headerStyle: {
                textAlign: 'center'
            },
            headerOnClick: () => {
                console.log('Header on click');
            },
            width: '20%',
            renderCell: (item) => {
                return (
                    <MyFlex
                        justifyContent={'center'}
                        alignItems={'center'}
                        width={'100%'}
                        gap={0}
                        p={0}
                    >
                        <MyText>{GetRoleName(item.role)}</MyText>
                    </MyFlex>
                );
            }
        },
        {
            key: 'phone',
            header: 'Teléfono',
            headerOnClick: () => {
                console.log('Header on click');
            },
            width: '20%',
            renderCell: (item) => {
                return (
                    <MyFlex direction={'column'} width={'100%'} gap={0} p={0}>
                        <MyText>{item.phone}</MyText>
                    </MyFlex>
                );
            }
        }
    ];

export const TableColumnsCurrentUserSTR: ColumnDefinition<InterfaceCurrentUser>[] =
    [
        {
            key: 'name',
            header: 'Nombre',
            headerOnClick: () => {
                console.log('Header on click');
            },
            width: '100%',
            renderCell: (item) => {
                return (
                    <MyFlex direction={'column'} width={'100%'} gap={0} p={0}>
                        <MyText fontWeight={'semibold'}>{item.name}</MyText>
                    </MyFlex>
                );
            }
        }
    ];
