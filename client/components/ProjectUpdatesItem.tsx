import React from 'react';

const ProjectUpdatesItem = ({ name, description, fromAddress, cidMetadata }) => {
  return (
    <div className="bg-blue-100 p-4 rounded mb-4">
      <h3 className="text-md font-semibold mb-1">{name}</h3>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <p className="text-sm text-gray-500">From: {fromAddress}</p>
      <p className="text-sm text-gray-500">CID Metadata: {cidMetadata}</p>
    </div>
  );
};

export default ProjectUpdatesItem;