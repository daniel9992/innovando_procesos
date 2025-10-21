import type { IconType } from 'react-icons/lib';

interface IBtnColor extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    Icon: IconType;
    text: string;
}

const BtnColor: React.FC<IBtnColor> = ({ Icon, text, ...props }) => {
    return (
        <button className="brutalist-button" {...props}>
            <div className="ms-logo">
                <Icon size={'30px'} />
            </div>
            <div className="button-text">
                <span>{text}</span>
            </div>
        </button>
    );
};

export default BtnColor;
