import React, { useState } from "react";

type EthereumAddressProps = {
  address: string;
  className?: string; // Allow the className prop to be optional
};

const EthereumAddress: React.FC<EthereumAddressProps> = ({
  address,
  className,
}) => {
  const formattedAddress = `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
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
      className={`bg-blue-500 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap ${className} ${
        copied ? "bg-green-500" : ""
      }`}
      onClick={copyToClipboard}
    >
      {copied ? "Copied!" : formattedAddress}
    </span>
  );
};

export default EthereumAddress;
