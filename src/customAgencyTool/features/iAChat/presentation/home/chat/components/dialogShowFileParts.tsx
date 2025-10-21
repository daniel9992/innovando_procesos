import { MyDialog, MyFlex } from '@src/customAgencyTool/components/ui';
import { GetRamdom } from '@src/customAgencyTool/utils/stringUtils/getRamdom';
import { type FC, useCallback, useEffect, useState } from 'react';

interface ISelectedFilePart {
    url?: string;
    showDialog?: boolean;
    onClose?: () => void;
}
const DialogShowFileParts: FC<ISelectedFilePart> = ({
    url,
    showDialog = false,
    onClose = () => {}
}) => {
    const [showDialogLocal, setShowDialogLocal] = useState(showDialog);

    const handleOnOpenDialog = useCallback(() => {
        setShowDialogLocal(true);
    }, []);

    const handleOnCloseDialog = useCallback(() => {
        setShowDialogLocal(false);
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (showDialog) {
            handleOnOpenDialog();
        } else {
            handleOnCloseDialog();
        }
    }, [showDialog, handleOnCloseDialog, handleOnOpenDialog]);

    return (
        <MyDialog
            isOpen={showDialogLocal}
            size="full"
            onClose={handleOnCloseDialog}
            header={'Archivo de la conversación'}
            maxHeight={'90vh'}
            body={
                <MyFlex direction={'column'} gap={2} p={0} height={'100%'}>
                    <iframe
                        src={url}
                        style={{ width: '100%', height: '85vh' }}
                        title={`${GetRamdom()}`}
                    ></iframe>
                </MyFlex>
            }
        />
    );
};

export default DialogShowFileParts;
