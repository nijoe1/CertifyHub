import React, { useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { CONTRACTS } from "@/constants/contracts";
import { Switch } from "@material-tailwind/react"; // Import the Switch component
import Link from "next/link";
import EthereumAddress from "@/components/EthereumAddress";
import { useAccount } from "wagmi";
type FeedbackModalProps = {
  project: any; // Replace 'any' with the actual type of your project
  split: string;
  onClose: () => void;
};

const FundModal: React.FC<FeedbackModalProps> = ({
  project,
  split,
  onClose,
}) => {
  const [amount, setAmount] = useState<BigInt>(BigInt(0));
  const [value, setValue] = useState("");
  const [showForm, setShowForm] = useState(false); // State to manage form display
  const ZERO_BYTES32 =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  const { address } = useAccount();
  const[splitet,setSplit] = useState(split)
  const { config } = usePrepareContractWrite({
    address: CONTRACTS.fundTheCommons[5].contract,
    abi: CONTRACTS.fundTheCommons[5].abi,
    functionName: "fundProject",
    args: [project, ZERO_BYTES32],
    // @ts-ignore
    value: amount,
  });
  const { write } = useContractWrite(config);
  const handleAmountChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    let num = Number(event.target.value); // Use the updated value
    setAmount(BigInt(num * 10 ** 18));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // TODO: Handle feedback submission, e.g., send feedback to server
    // @ts-ignore
    write();

    // Clear form inputs
    setAmount(BigInt(0));
    onClose();
  };
  const handleToggle = () => {
    setShowForm(!showForm);
  };

  const handleButtonClick = () => {
    if(splitet){
      const url = `https://goerli.drips.network/app/${splitet}`;
      window.location.href = url;
    }
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">FundProject</h2>
        <div className="mb-4">
          {/* Add the toggle switch */}
          <label className="block text-sm font-medium text-gray-700">
            Display Fund Form
          </label>
          <div>
            <input
              className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
              type="checkbox"
              role="switch"
              checked={showForm}
              onChange={handleToggle}
              id="flexSwitchCheckDefault"
            />
          </div>
        </div>
        {showForm && ( // Display the form if showForm is true
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700"
              >
                Fund Amount
              </label>
              <input
                type="string"
                id="rating"
                className="mt-1 px-3 py-2 border rounded-md w-full"
                value={value}
                onChange={handleAmountChanged}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Fund
              </button>
              <button
                type="button"
                className="ml-2 text-gray-500"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {!showForm && ( // Display the external link button if showForm is false
          <form>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700"
            >
              Stream using Drips to
            </label>
            <EthereumAddress
              address={splitet}
              className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap"
              // @ts-ignore
              style={{
                width: `${50}px`,
                marginRight: "8px", // Add space between badges
              }}
            />
            <div className="flex justify-end">
            <button
      type="button"
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={handleButtonClick}
    >
      Go to Drips
    </button>

              <button
                type="button"
                className="ml-2 text-gray-500"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FundModal;
