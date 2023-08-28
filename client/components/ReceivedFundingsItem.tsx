import React from 'react';
import Link from 'next/link';

const ReceivedFundingItem = ({ funder, eventID, fundingAmount, companyName }) => {
  return (
    <div className="bg-blue-100 p-4 rounded mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-semibold">Funder: {funder}</h3>
        {/* <Link href={`/event?id=${encodeURIComponent(eventID)}`}> */}
        <Link href={`/event}`}>

          <p className="text-blue-500 hover:underline">Event Details</p>
        </Link>
      </div>
      <p className="text-sm text-gray-600 mb-2">Funding Amount: {fundingAmount}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Company: </span>
        <Link href={`/company`}>
          <p className="text-blue-500 hover:underline">{companyName}</p>
        </Link>
      </div>
    </div>
  );
};

export default ReceivedFundingItem;