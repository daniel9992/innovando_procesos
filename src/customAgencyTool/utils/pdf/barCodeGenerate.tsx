import { Image } from '@react-pdf/renderer';
import JsBarcode from 'jsbarcode';
import { type FC } from 'react';

interface IBarcodeGenerateProps {
    value: string;
    width: number;
    height?: number;
}

const BarcodeGenerate: FC<IBarcodeGenerateProps> = ({
    value,
    width,
    height = 50
}) => {
    if (!value) {
        return null;
    }

    const canvas = document.createElement('canvas');
    JsBarcode(canvas, value, { width: 2, height, displayValue: false });

    const barcodeData = canvas.toDataURL('image/png');

    return <Image src={barcodeData} style={{ width: width, height: height }} />;
};

export default BarcodeGenerate;
