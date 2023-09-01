import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Navbar } from "@/components/layout";
import Footer from "@/components/Footer";
import {
  getData,
  getFunderDetails,
  getFunderDetails2,
} from "@/lib/operator/index";
import { useAccount } from "wagmi";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
} from "@material-tailwind/react";
import RegisterEventModal from "@/components/RegisterEventModal";
import EventCard from "@/components/EventCard";
import { storeData } from "@/lib/operator";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { CONTRACTS } from "@/constants/contracts";
interface Funder {
  company: string;
  name: string;
  image: string;
  description: string;
  admin: string;
  // ... other properties
}
interface EventMetadata {
  eventID: string; // Change the type to match the actual data type of eventID
  // ... other properties
}
const FunderPage = () => {
  const router = useRouter();
  const [funder, setFunder] = useState<Funder[]>([]);
  const { address } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [eventsMetadata, setEventsMetadata] = useState<EventMetadata[]>([]);
  const [cid, setCID] = useState();
  const [defined, setDefined] = useState(false);

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
    args: [router.query.name, eventData.name, cid, [address], 0],
  });
  const { write } = useContractWrite(config);
  const handleRegisterEventClick = () => {
    setShowRegisterModal(true);
  };

  const handleRegisterEvent = async (eventData: any) => {
    // Handle event registration logic here
    console.log("Event data:", eventData);
    const result = await storeData(eventData);
    setCID(result);

    console.log(cid);
    setEventData(eventData);
    // @ts-ignore
    write();

    setEventData({
      name: "",
      description: "",
      type: "",
      cid: "",
    });
    setShowRegisterModal(false);
  };

  const closeRegisterEventModal = () => {
    setShowRegisterModal(false);
  };

  const getMetadata = async (details: any) => {
    // @ts-ignore

    let metadata = [];
    for (const event of details) {
      if (event.cid != "") {
        let data = await getData(event.cid);
        data.eventID = event.eventID;
        data.type = event.type;
        metadata.push(data);
      }
    }
    // @ts-ignore
    return metadata;
  };

  useEffect(() => {
    async function fetchFunderDetails() {
      const routerFunderName = router.query.name;
      const funderDetails = await getFunderDetails(routerFunderName);
      if (funderDetails.length > 0) {
        const funderDetails = await getFunderDetails(routerFunderName);
        setFunder(funderDetails);
        let metadata = await getMetadata(funderDetails);
        setEventsMetadata(metadata);
        setDefined(true);
      } else {
        const funderDetails2 = await getFunderDetails2(routerFunderName);
        setFunder(funderDetails2);
        console.log(funderDetails2);
        setDefined(true);
      }
    }
    if (!defined) {
      fetchFunderDetails();
    }
  }, [router.query.name, funder, defined, cid]);

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
          {funder[0]?.company && (
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold mb-2">
                {funder[0]?.company}
              </h1>
              <img
                src={"https://nftstorage.link/ipfs/" + funder[0]?.image}
                alt="Funder Logo"
                className="w-32 mx-auto mb-2 rounded"
              />
              <p className="text-gray-600 mb-4">{funder[0]?.description}</p>
              <p className="text-gray-500">Admin: {funder[0]?.admin}</p>
              {funder[0]?.admin == address?.toLowerCase() && (
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
          {/* Tabs */}
          <div className="flex flex-col items-center">
            <Tabs value="events" className="max-w-[40rem] mt-10">
              <TabsHeader
                className="bg-transparent"
                indicatorProps={{
                  className: "bg-gray-900/10 shadow-none !text-gray-900",
                }}
              >
                {/* Render tabs */}
                <Tab value="events">Events</Tab>
                <Tab value="settings">Settings</Tab>
                {/* Add more tabs here */}
              </TabsHeader>
              <TabsBody>
                <TabPanel value="events">
                  {/* Events */}
                  {eventsMetadata.length > 0 && (
                    <div className="grid   gap-2">
                      {" "}
                      {/* Use grid for card layout */}
                      {eventsMetadata.map((event) => (
                        <div
                          key={event.eventID}
                          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4"
                        >
                          {" "}
                          {/* Specify column widths */}
                          <EventCard event={event} />
                        </div>
                      ))}
                    </div>
                  )}
                </TabPanel>
                <TabPanel value="settings">
                  {/* Settings */}
                  <div className="flex flex-col space-y-4">
                    {/* Example settings content */}
                    <div className="border rounded p-4">
                      <h3 className="text-lg font-semibold mb-1">
                        Profile Settings
                      </h3>
                      <p className="text-gray-600 mb-2">Comming Soon.</p>
                      {/* Add your profile settings components or options here */}
                    </div>
                    <div className="border rounded p-4">
                      <h3 className="text-lg font-semibold mb-1">
                        Event Settings
                      </h3>
                      <p className="text-gray-600 mb-2">Comming Soon.</p>
                      {/* Add your notification settings components or options here */}
                    </div>
                  </div>
                </TabPanel>
                {/* Add more tab panels here */}
              </TabsBody>
            </Tabs>
          </div>
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
