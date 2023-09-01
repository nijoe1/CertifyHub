import React, { useState, useEffect } from "react";
import Link from "next/link"; // Import the Link component
import { getFunders } from "@/lib/operator/index"; // Import the API function to fetch funders data
import { Navbar } from "@/components/layout";
import Footer from "@/components/Footer";
import { storeImage } from "@/lib/operator/index";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { CONTRACTS } from "@/constants/contracts";
import { useAccount } from "wagmi";
interface Funder {
  company: string;
  description: string;
  image: Blob;
  // ... other properties
}
const FundersPage = () => {
  const [funders, setFunders] = useState<Funder[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState("");
  const [added, setAdded] = useState(false);
  const [cid, setCID] = useState("");
  const { address } = useAccount();
  const [newFunder, setNewFunder] = useState({
    company: "",
    description: "",
    image: "",
  });

  const { config } = usePrepareContractWrite({
    address: CONTRACTS.verifierRegistry[5].contract,
    abi: CONTRACTS.verifierRegistry[5].abi,
    functionName: "registerCompany",
    args: [newFunder.company, cid, newFunder.description, address],
  });
  const { write } = useContractWrite(config);
  useEffect(() => {
    // Fetch funders data from your API or source
    async function fetch() {
      const fetchedFunders = await getFunders(); // Replace with your API call

      console.log(fetchedFunders);
      let funderss = [];
      for (const funder of fetchedFunders) {
        let temp = funder;
        temp.image = "https://ipfs.io/ipfs/" + funder.image;
        funderss.push(temp);
      }
      setFunders(funderss);
    }
    if (funders.length == 0 && !added) {
      fetch();
    }
  }, [funders, cid]);
  const handleCreateFunder = async () => {
    if (newFunder.company && newFunder.image) {
      setAdded(true);
      const CID = await storeImage(newFunder.image);
      console.log(CID);
      setCID(`${CID}/image.png`);
      console.log(cid);

      // Call your contract write function
      // @ts-ignore
      write();
      setAdded(false);

      // Clear the new funder data and close the modal
      setNewFunder({
        company: "",
        description: "",
        image: "",
      });
      setShowCreateModal(false);

      // Fetch the updated list of funders
      const updatedFunders = await getFunders();
      setFunders(updatedFunders);
    }
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Convert the data URL to a Blob
        // @ts-ignore
        const blob = new Blob([event.target.result], { type: file.type });

        // Update the newFunder state with the Blob
        // @ts-ignore

        setNewFunder({ ...newFunder, image: blob });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* Include the Navbar component */}
      <div className="container mx-auto p-4">
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowCreateModal(true)}
        >
          Create Funder
        </button>
        <h1 className="text-3xl font-bold mb-4">Funders</h1>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {funders &&
            (funders as any[]).map((funder) => (
              <li
                key={funder?.company}
                className="bg-white rounded-lg shadow-md p-4"
              >
                {/* <Link href={`/company/${funder.company}`}> */}
                <Link href={`/Funder?name=${funder.company}`}>
                  <p className="block text-xl font-semibold mb-2 hover:underline">
                    {funder.company}
                  </p>
                </Link>
                <p className="text-gray-600">{funder.description}</p>
                <img
                  src={funder.image}
                  alt={funder.company}
                  className="mt-4 rounded-lg w-full"
                />
              </li>
            ))}
        </ul>
      </div>
      {showCreateModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowCreateModal(false)} // Close modal when clicking outside
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
          >
            <h2 className="text-xl font-semibold mb-2">Create New Funder</h2>
            <input
              type="text"
              placeholder="Company Name"
              className="block w-full border rounded py-2 px-3 mb-2"
              value={newFunder.company}
              onChange={(e) =>
                setNewFunder({ ...newFunder, company: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              className="block w-full border rounded py-2 px-3 mb-2"
              value={newFunder.description}
              onChange={(e) =>
                setNewFunder({ ...newFunder, description: e.target.value })
              }
            />
            <input
              type="file"
              accept="image/*"
              className="mb-2"
              onChange={handleImageChange}
            />
            <div className="flex justify-center mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleCreateFunder}
              >
                Create
              </button>
              <button
                className="text-gray-600 px-4 py-2 rounded"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
            </div>
            {notification && (
              <p className="mt-2 text-sm text-green-500">{notification}</p>
            )}
          </div>
        </div>
      )}
      <div className="flex-grow"></div>
      <Footer /> {/* Include the Footer component */}
    </div>
  );
};

export default FundersPage;
