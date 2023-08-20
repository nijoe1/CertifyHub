import React from 'react';

const HypercertField = ({ label, value }) => {
  return (
    <div className="p-3 bg-gray-800 rounded-lg">
      <p className="text-white font-semibold mb-1">{label}</p>
      <p className="text-white">{value}</p>
    </div>
  );
};

export default HypercertField;