import React from 'react';
import Badge from './Badge';
import EthereumAddress from './EthereumAddress';

const HypercertInfo = ({ name, description, contributors }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 w-1/2">
      <h2 className="text-2xl font-semibold text-blue-600 mb-2">{name}</h2>
      <p className="text-gray-800 mb-4">{description}</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Badge text="Work Scope" />
          <Badge text="Impact Scope" />
        </div>
        <div>
          {contributors.map((contributor, index) => (
            <EthereumAddress key={index} address={contributor} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Dummy data
const dummyData = {
  name: 'Hypercert Example',
  description: 'This is an example hypercert description.',
  contributors: ['0xAddress1', '0xAddress2', '0xAddress3'],
};

export default function HypercertInfoWithDummyData() {
  return <HypercertInfo {...dummyData} />;
}
