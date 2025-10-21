import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { ErrorMessage } from 'formik';
import type { FC } from 'react';
import { MyFlex, MyText, MyTooltip } from '../../ui';

interface ErrorMessageProps {
    name: string;
    position?: 'top' | 'bottom';
    isError?: boolean;
    errorMessage?: string;
}
export const RenderErrorMessage: FC<ErrorMessageProps> = ({
    name,
    position = 'top',
    isError = false,
    errorMessage
}) => {
    if (!isError) return null;

    if (position === 'top') {
        return (
            <MyTooltip
                showArrow={true}
                portalled={true}
                content={errorMessage}
                positioning={{ placement: 'left' }}
            >
                <MyFlex
                    position={'absolute'}
                    top={'-15px'}
                    right={'-15px'}
                    borderRadius={'10px'}
                    bg={'red'}
                    p={1.5}
                    gap={2}
                    align={'center'}
                    color={'#ffff'}
                    boxShadow={'0 0 0 1px #921313'}
                    zIndex={10}
                >
                    <SelectedIcons iconName="Alert" />
                </MyFlex>
            </MyTooltip>
        );
    }

    return (
        <MyFlex
            direction={'row'}
            gap={2}
            align={'center'}
            color={'#921313'}
            bg={'rgba(255, 255, 255, 0.1)'}
            p={0}
            px={2}
            borderRadius={'0px'}
        >
            <MyFlex px={0} mx={0}>
                <SelectedIcons iconName="Alert" />
            </MyFlex>
            <ErrorMessage name={name}>
                {(msg) => (
                    <MyText fontSize={'0.8rem'} fontWeight={'semibold'}>
                        {msg}
                    </MyText>
                )}
            </ErrorMessage>
        </MyFlex>
    );
};
