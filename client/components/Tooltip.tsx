import React from "react";

type TooltipProps = {
  text: any; // You should replace 'any' with the actual type of your project
  children: any; // You should replace 'any' with the actual type of your project
};
const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative inline-block">
      {children}
      <div className="absolute bg-gray-800 text-white px-2 py-1 rounded-md opacity-0 invisible transition-opacity duration-300 transform -translate-y-2">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
