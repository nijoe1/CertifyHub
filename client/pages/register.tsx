import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout";
import Footer from "@/components/Footer";
import Tooltip from "@/components/Tooltip";
import HypercertCard from "@/components/HypercertCard";
import ChosenCategoriesBox from "@/components/ChosenCategoriesBox";
import { getData, getClaims } from "../lib/operator/index";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { CONTRACTS } from "@/constants/contracts";

const RegisterPage = () => {
  const [hypercertID, setHypercertID] = useState("");
  const [importedHypercert, setImportedHypercert] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [registeredCategories, setRegisteredCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [fractionIDs, setFractionIDs] = useState([]);
  const [error, setError] = useState<string | null>(null); // Initial value is null

  const { config } = usePrepareContractWrite({
    address: CONTRACTS.fundTheCommons[5].contract,
    abi: CONTRACTS.fundTheCommons[5].abi,
    functionName: "registerHypercertProject",
    args: [hypercertID, fractionIDs, registeredCategories,registeredCategories],
  });
  const { write } = useContractWrite(config);

  useEffect(() => {
    async function fetchHypercert(claimID: any) {
      let id =
        "0x822f17a9a5eecfd66dbaff7946a8071c265d1d07-" + claimID.toString();
      const claimTokens = await getClaims(id);
      let fractions = [];
      if (claimTokens.claimTokens.length > 0) {
        for (const fraction of claimTokens.claimTokens) {
          if (fraction?.tokenID) {
            fractions.push(fraction?.tokenID);
          }
        }
        setFractionIDs(fractions as []);
        const metadataUri = claimTokens?.claimTokens[0].claim.uri;
        const metadata = await getData(metadataUri);
        metadata.hypercert.categories = registeredCategories;
        metadata.id = id;
        console.log(metadata);
        if (metadata) {
          setImportedHypercert(metadata);
          console.log(metadata);
          return;
        }
      } else {
        setError("Non-existent Hypercert or error occurred.");
      }
    }

    if (hypercertID) {
      fetchHypercert(hypercertID);
      setShowCategoryForm(true); // Enable the categories view on successful fetch
      setError(null); // Clear any previous error
    } else {
      setShowCategoryForm(false); // Disable the categories view when no claimID is provided
      setError(null); // Clear any previous error
    }
  }, [hypercertID, registeredCategories]);

  const handleAddCategory = () => {
    // @ts-ignore
    if (selectedCategory && !registeredCategories.includes(selectedCategory)) {
      // @ts-ignore

      setRegisteredCategories([...registeredCategories, selectedCategory]);
      setSelectedCategory("");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg mt-9">
          <h1 className="text-2xl font-semibold ">Register Hypercert</h1>

          {/* Import Hypercert Form */}
          <div className="mb-4 flex items-center">
            {/* Placeholder for Import Hypercert Form elements */}
            <input
              type="text"
              placeholder="Enter Hypercert ID"
              className="border p-2 mr-2"
              value={hypercertID}
              onChange={(e) => setHypercertID(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-3 py-2 rounded"
              onClick={() => setHypercertID(hypercertID)}
            >
              Import Hypercert
            </button>
            <Tooltip text="Click this button to import a hypercert.">
              {/* Children elements go here */}
            </Tooltip>{" "}
          </div>

          {/* Imported Hypercert Info */}
          {importedHypercert && (
            <HypercertCard
              hypercert={importedHypercert}
              // @ts-ignore
              onDetailsClick={undefined}
            />
          )}

          {/* Add Category Form */}
          {showCategoryForm && (
            <div className="mt-4 mb-4 flex items-center">
              {/* Placeholder for Add Category Form elements */}
              <input
                type="text"
                placeholder="Enter Category"
                className="border p-2 mr-2"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-3 py-2 rounded"
                onClick={handleAddCategory}
              >
                Add Category
              </button>
            </div>
          )}

          {/* Display Chosen Categories */}
          {registeredCategories.length > 0 && (
            <div className="mb-4">
              <ChosenCategoriesBox chosenCategories={registeredCategories} />
            </div>
          )}

          {/* Display error message */}
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* Register Project Button */}
          {importedHypercert && (
            <div className="mt-4">
              <button
                className="bg-green-500 text-white px-3 py-2 rounded"
                onClick={write}
              >
                Register Project into Platform
              </button>
            </div>
          )}
        </div>

        <div className="flex-grow"></div>
        <Footer />
      </div>
    </>
  );
};

export default RegisterPage;
