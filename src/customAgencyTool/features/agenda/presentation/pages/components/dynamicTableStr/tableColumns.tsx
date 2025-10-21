import { MyButton, MyFlex, MyText } from '@src/customAgencyTool/components/ui';
import type { ColumnDefinition } from '@src/customAgencyTool/components/virtualizedTable/model';
import type { InterfaceClient } from '@src/customAgencyTool/features/agenda/domain/agendaModel';

export const TableColumnsAgenda: ColumnDefinition<InterfaceClient>[] = [
    {
        key: 'clientName',
        header: 'Cliente',
        width: '100%',
        renderCell: (item) => (
            <MyFlex
                direction={'row'}
                width={'100%'}
                gap={0}
                p={0}
                justifyContent={'space-between'}
                align={'center'}
            >
                <MyText
                    //
                    fontSize={'0.8rem'}
                >
                    {item.clientName}
                </MyText>
                <MyButton
                    variant={'plain'}
                    size={'xs'}
                    icon={'EDIT'}
                    aria-label={'Editar'}
                    zIndex={10}
                    onClick={() => {
                        console.log('clicked');
                    }}
                />
            </MyFlex>
        )
    }
];

/*
<MyButton
    variant={'plain'}
>{item.clientName}</MyButton>
*/
