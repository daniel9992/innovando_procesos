import { type BaseImageProps, Image } from '@react-pdf/renderer';
import { GetImgPatyByLogoType } from '@src/customAgencyTool/assets/_imgListToSelected/imgListToSelected_BL';
import type { FC } from 'react';

interface IImgTagProps extends BaseImageProps {
    src: string;
    className?: string;
}

const ImgTag: FC<IImgTagProps> = ({ src, ...props }) => {
    if (src === '') {
        return null;
    }
    return <Image src={GetImgPatyByLogoType(src)} {...props} />;
};

export default ImgTag;
