import React, { useState } from 'react';

const EthereumAddress = ({ address }) => {
  const formattedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <span
      className={`inline-block bg-gray-300 text-gray-800 px-2 py-1 rounded mr-2 mb-2 cursor-pointer ${
        copied ? 'bg-green-500' : ''
      }`}
      onClick={copyToClipboard}
    >
      {copied ? 'Copied!' : formattedAddress}
    </span>
  );
};

export default EthereumAddress;