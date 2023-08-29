import React from "react";

type ProjectUpdatesItemProps = {
  name: any; // You should replace 'any' with the actual type of your project
  description: any; // You should replace 'any' with the actual type of your project
  fromAddress: any; // You should replace 'any' with the actual type of your project
  cidMetadata: any; // You should replace 'any' with the actual type of your project
};
const ProjectUpdatesItem: React.FC<ProjectUpdatesItemProps> = ({
  name,
  description,
  fromAddress,
  cidMetadata,
}) => {
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
