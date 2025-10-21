import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

interface IBtnAction extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  background?: string;
}

const BtnAction: React.FC<IBtnAction> = ({
  text,
  background = "#6225e6",
  ...props
}) => {
  return (
    <button className="cta" style={{ background: background }} {...props}>
      <span className="span">{text}</span>
      <span className="second">
        <MdKeyboardArrowRight />
      </span>
    </button>
  );
};

export default BtnAction;
