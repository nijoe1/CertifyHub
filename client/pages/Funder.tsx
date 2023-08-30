import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Navbar } from "@/components/layout";
import Footer from "@/components/Footer";
import { getData, getFunderDetails } from "@/lib/operator/index";
import { useAccount } from "wagmi";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import RegisterEventModal from "@/components/RegisterEventModal";
import EventCard from "@/components/EventCard";
import { storeData } from "@/lib/operator";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { CONTRACTS } from "@/constants/contracts";

const FunderPage = () => {
  const router = useRouter();
  const [funder, setFunder] = useState([]);
  const { address } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [eventsMetadata, setEventsMetadata] = useState([]);
  const [updated, setUpdated] = useState(false);

  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    type: "",
    cid: "",
  });
  const { config } = usePrepareContractWrite({
    address: CONTRACTS.verifierRegistry[5].contract,
    abi: CONTRACTS.verifierRegistry[5].abi,
    functionName: "registerEvent",
    args: [
      router.query.name,
      eventData.description,
      eventData.type,
      eventData.cid,
      [address],
      0,
    ],
  });
  const { write } = useContractWrite(config);
  const handleRegisterEventClick = () => {
    setShowRegisterModal(true);
  };

  const handleRegisterEvent = async (eventData: any) => {
    // Handle event registration logic here
    console.log("Event data:", eventData);
    let result = await storeData(eventData);
    eventData.cid = result;
    setEventData(eventData);
    // @ts-ignore
    write();
    console.log(result);
    setShowRegisterModal(false);
  };

  const closeRegisterEventModal = () => {
    setShowRegisterModal(false);
  };

  const getMetadata = async (details: any) => {
    // @ts-ignore

    let metadata = [];
    details.events.map(async (event) => {
      let data = await getData(event.cid);
      data.eventID = event.eventID;
      data.type = event.type;
      metadata.push(data);
    });
    // @ts-ignore
    return metadata;
  };

  useEffect(() => {
    async function fetchFunderDetails() {
      setUpdated(false);
      const routerFunderName = router.query.name;
      const funderDetails = await getFunderDetails(routerFunderName);
      setFunder(funderDetails);
      let metadata = await getMetadata(funderDetails[0]);
      // @ts-ignore
      setEventsMetadata(metadata);
      setUpdated(true);
    }

    if (!updated) {
      fetchFunderDetails();
    }
  }, [router.query.name]);

  const handleDetailsClick = () => {
    setIsModalOpen(true); // Open the modal when "register event" is clicked
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center">
        <div className="container mx-auto py-8">
          {/* Funder Details */}
          {updated && (
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold mb-2">{funder[0].name}</h1>
              <img
                src={funder[0]?.image}
                alt="Funder Logo"
                className="w-32 mx-auto mb-2"
              />
              <p className="text-gray-600 mb-4">{funder[0].description}</p>
              <p className="text-gray-500">Admin: {funder[0].admin}</p>
              {funder[0].admin == address?.toLowerCase() && (
                <Button
                  onClick={handleRegisterEventClick}
                  className="mt-2 w-42"
                  color="blue"
                  ripple
                >
                  Register Event
                </Button>
              )}
            </div>
          )}

          {/* Events */}
          {updated && (
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4">Events</h2>
              <div className="w-full flex flex-wrap justify-center">
                {eventsMetadata.map((event) => (
                  <EventCard key={event.eventID} event={event} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-grow"></div>
      <Footer />
      {showRegisterModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <RegisterEventModal
              onClose={closeRegisterEventModal}
              onRegister={handleRegisterEvent}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FunderPage;
