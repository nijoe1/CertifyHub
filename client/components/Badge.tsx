import React from "react";

type BadgeProps = {
  text: string; // Specify the type of the 'text' prop
};

const Badge: React.FC<BadgeProps> = ({ text }) => {
  return (
    <span className="inline-block bg-blue-300 text-gray-800 px-2 py-1 rounded-full mr-2 mb-2">
      {text}
    </span>
  );
};

export default Badge;
