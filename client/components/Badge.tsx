import React from 'react';

const Badge = ({ text }) => {
  return (
    <span className="inline-block bg-blue-300 text-gray-800 px-2 py-1 rounded-full mr-2 mb-2">
      {text}
    </span>
  );
};

export default Badge;
