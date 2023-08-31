import React from "react";
type HypercertFieldProps = {
  label: any; // You should replace 'any' with the actual type of your project
  value: any; // You should replace 'any' with the actual type of your project
};
const HypercertField: React.FC<HypercertFieldProps> = ({ label, value }) => {
  return (
    <div className="p-3 bg-gray-800 rounded-lg">
      <p className="text-white font-semibold mb-1">{label}</p>
      <p className="text-white">{value}</p>
    </div>
  );
};

export default HypercertField;
