import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout";
import Footer from "@/components/Footer";
import Tooltip from "@/components/Tooltip";
import HypercertCard from "@/components/HypercertCard";
import ChosenCategoriesBox from "@/components/ChosenCategoriesBox";
import { getData, getClaims, getEvents } from "../lib/operator/index";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { CONTRACTS } from "@/constants/contracts";
import { Select, Option } from "@material-tailwind/react"; // Import the Select and Option components
import Link from "next/link";

const RegisterPage = () => {
  const [hypercertID, setHypercertID] = useState("");
  const [importedHypercert, setImportedHypercert] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [registeredCategories, setRegisteredCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [eventOptions, setEventOptions] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [fractionIDs, setFractionIDs] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(0);
  const categoryOptions = [
    { value: "", label: "Select Category" }, // Added a default option
    { value: "CO2.Storage", label: "CO2.Storage" },
    { value: "DEFI", label: "DEFI" },
    { value: "NFTs", label: "NFTs" },
    { value: "DAOs", label: "DAOs" },
  ];
  const [options, setOptions] = useState(categoryOptions);

  const templateOptions = [
    { value: "", label: "Select Category" }, // Added a default option
    { value: "intrinsic methods", label: "intrinsic methods" },
    {
      value: "Oceanography - Data Conversion",
      label: "Oceanography - Data Conversion",
    },
    { value: "prov-filgreen-community", label: "prov-filgreen-community" },
    { value: "rapaygo examples", label: "rapaygo examples" },
    { value: "Reneun", label: "Reneun" },
    { value: "Research Data Validation", label: "Research Data Validation" },
    { value: "SP Audits", label: "SP Audits" },
    { value: "Stable Diffusion on a GPU", label: "Stable Diffusion on a GPU" },
    { value: "CO2 Boss Fight", label: "CO2 Boss Fight" },
    { value: "EVP Results", label: "EVP Results" },
    { value: "Footprint", label: "Footprint" },
    { value: "ForestWatch", label: "ForestWatch" },
    {
      value: "Gas Emissions Measurements - Hypen",
      label: "Gas Emissions Measurements - Hypen",
    },
    { value: "Green Carbon Calculator", label: "Green Carbon Calculator" },
    { value: "GreenPower", label: "GreenPower" },
  ];
  const { config } = usePrepareContractWrite({
    address: CONTRACTS.fundTheCommons[5].contract,
    abi: CONTRACTS.fundTheCommons[5].abi,
    functionName: "registerHypercertProject",
    args: [hypercertID, fractionIDs, registeredCategories, registeredEvents],
  });
  const { write } = useContractWrite(config);

  useEffect(() => {
    async function fetchHypercert(claimID: any) {
      let id =
        "0x822f17a9a5eecfd66dbaff7946a8071c265d1d07-" + claimID.toString();
      const claimTokens = await getClaims(id);
      let fractions = [];
      let events = await getEvents();
      const options = [];
      for (const event of events) {
        if (event.cid != "") {
          const metadata = await getData(event.cid);
          console.log(metadata);
          options.push({
            value: event.eventID,
            label: `${event.company}/${metadata?.name}`,
          });
        }
      }
      // @ts-ignore
      setEventOptions(options);
      console.log(events);
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
      setShowEventForm(true);
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
      if (added == 2) {
        // @ts-ignore
        setRegisteredCategories(["CO2.Storage", selectedCategory]);
        setSelectedCategory(selectedCategory); // Clear selected category after adding
      } else {
        // @ts-ignore
        setRegisteredCategories([...registeredCategories, selectedCategory]);
        setSelectedCategory(""); // Clear selected category after adding
      }
    }
  };

  const handleAddEvent = () => {
    // @ts-ignore
    if (selectedEvent && !registeredEvents.includes(selectedEvent)) {
      // @ts-ignore
      setRegisteredEvents([...registeredEvents, selectedEvent]);
      setSelectedCategory(""); // Clear selected category after adding
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col text-center items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg mt-9">
          <h1 className="text-2xl font-semibold mb-5">Register Hypercert</h1>

          {/* Import Hypercert Form */}
          <div className="mb-4 flex flex-col items-center">
            {/* Placeholder for Import Hypercert Form elements */}
            <input
              type="text"
              placeholder="Enter Hypercert ID"
              className="border p-2 mr-2 mb-2"
              value={hypercertID}
              onChange={(e) => setHypercertID(e.target.value)}
            />
            {!showCategoryForm && (
              <button
                className="bg-blue-500 text-white px-3 py-2 mt-3 rounded"
                onClick={() => setHypercertID(hypercertID)}
              >
                Import Hypercert
              </button>
            )}
            {!showCategoryForm && (
              <Link
                className="bg-blue-500 text-white px-3 py-2 rounded mt-3 mb-0"
                href={
                  "https://testnet.hypercerts.org/app/create#name=The%20name%20of%20your%20hypercert&logoUrl=https%3A%2F%2Fi.imgur.com%2FsDQhp3Y.png&bannerUrl=https%3A%2F%2Fi.imgur.com%2FwsM3fWd.jpeg&impactScopes%5B0%5D=all&impactTimeEnd=indefinite&workScopes=your%20project&workTimeStart=2023-01-01&rights%5B0%5D=Public%20Display&backgroundColor=blue&backgroundVectorArt=contours"
                }
              >
                <button>Create Hypercert</button>
              </Link>
            )}
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
              {added == 0 ? <h4>Add category</h4> : <h4>Add Template</h4>}
              <Select
                value={selectedCategory}
                // @ts-ignore
                onChange={(value) => {
                  if (added == 0) {
                    if (value == "CO2.Storage") {
                      // @ts-ignore

                      setRegisteredCategories([value]);
                      setOptions(templateOptions);
                      setAdded(1);
                    } else {
                      // @ts-ignore

                      setSelectedCategory(value);
                      handleAddCategory();
                    }
                  } else if (added == 1) {
                    // @ts-ignore

                    setSelectedCategory(value);
                    // @ts-ignore

                    setSelectedTemplate([value]);
                    // @ts-ignore

                    setRegisteredCategories([value, "CO2.Storage"]);

                    setAdded(2);
                  } else {
                    // @ts-ignore

                    setSelectedCategory(value);
                    // @ts-ignore

                    setSelectedTemplate([value]);

                    // @ts-ignore
                    setRegisteredCategories([value, "CO2.Storage"]);
                  }
                }}
                className=" md:w-69 py-5" // Adjust width as needed
              >
                {options.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
          )}
          {showEventForm && (
            <div className="mt-4 mb-4 flex items-center">
              <h4>Add Event</h4>
              <Select
                value={selectedEvent}
                onChange={(value: any) => {
                  setSelectedEvent(value);
                  handleAddEvent();
                }}
                className=" md:w-69 py-5" // Adjust width as needed
              >
                {eventOptions.map((option) => (
                  // @ts-ignore
                  <Option key={option.value} value={option.value}>
                    {/*  @ts-ignore */}
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
          )}

          {/* Display Chosen Categories */}
          {registeredCategories.length > 0 && added == 0 ? (
            <div className="mb-4">
              <ChosenCategoriesBox
                name="Choosen Categories:"
                chosenCategories={registeredCategories}
              />
            </div>
          ) : registeredCategories.length > 0 ? (
            <div className="mb-4">
              <ChosenCategoriesBox
                name="Choosen Categories:"
                chosenCategories={["CO2.Storage"]}
              />
            </div>
          ) : (
            <div></div>
          )}
          {/* Display Chosen Categories */}
          {added > 0 && (
            <div className="mb-4">
              <ChosenCategoriesBox
                name="Choosen Template:"
                chosenCategories={selectedTemplate}
              />
            </div>
          )}
          {registeredEvents.length > 0 && (
            <div className="mb-4">
              <ChosenCategoriesBox
                name="Choosen Events: "
                chosenCategories={registeredEvents}
              />
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
