import React from "react";
// @ts-ignore
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

type ChosenCategoriesBoxProps = {
  chosenCategories: string[];
};

const ChosenCategoriesBox: React.FC<ChosenCategoriesBoxProps> = ({ chosenCategories }) => {
  return (
    <div className="bg-blue-100 p-2 rounded">
      <h4 className="text-sm font-semibold">Chosen Categories:</h4>
      <div className="mt-2">
        {chosenCategories.map((category, index) => (
          <span key={index} className="bg-blue-300 text-black px-2 py-1 rounded-full mr-2 mb-2">
            {category}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ChosenCategoriesBox;