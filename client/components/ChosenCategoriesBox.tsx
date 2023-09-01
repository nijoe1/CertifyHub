import React from "react";
// @ts-ignore
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

type ChosenCategoriesBoxProps = {
  chosenCategories: string[];
  name: string;
};

const ChosenCategoriesBox: React.FC<ChosenCategoriesBoxProps> = ({
  chosenCategories,
  name,
}) => {
  return (
    <div className="bg-blue-100 p-2 rounded">
      <h4 className="text-sm font-semibold">{name}</h4>
      <div className="mt-2 flex flex-col"> {/* Use "flex" and "flex-col" classes */}
        {chosenCategories.map((category, index) => (
          <span
            key={index}
            className="bg-blue-300 text-black px-2 py-1 rounded-full mb-1" // Remove "mr-2"
          >
            {category.slice(0, 35) + "..."}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ChosenCategoriesBox;