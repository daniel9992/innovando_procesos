import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { CapitalizeFirstLetter } from '@src/customAgencyTool/utils/stringUtils/capitalizeFirstLetter';
import { useMemo, type FC } from 'react';
import { allowedMIMETypes } from '../../../utils/fileToBase64';

interface ShowIconByMINETypeProps {
    mineType: string;
    size?: string;
}

const ShowIconByMINEType: FC<ShowIconByMINETypeProps> = ({
    mineType,
    size = '1.2rem'
}) => {
    const iconName = useMemo(() => {
        const fileExtension = '.' + mineType.split('/')[1];

        const mimeTypeConfig = Array.from(allowedMIMETypes).find(
            (config) => config.type === fileExtension
        );

        if (mimeTypeConfig) {
            return CapitalizeFirstLetter(
                mimeTypeConfig.extension.split('/')[1]
            );
        }
    }, [mineType]);

    if (!iconName) return null;

    return (
        <>
            <SelectedIcons iconName={iconName} size={size} />
        </>
    );
};

export default ShowIconByMINEType;
