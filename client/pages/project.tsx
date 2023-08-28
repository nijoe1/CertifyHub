import React, { useEffect, useState } from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/Footer";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { UserCircleIcon } from "@heroicons/react/outline";
import HypercertProfile from "@/components/HypercertProfile"; // Import your HypercertProfile component
import { getData, getClaims } from "../lib/operator/index";
import { useRouter } from 'next/router';




  // Tabs data

  
  const ProjectPage = () => {
    const router = useRouter();
    const [hypercertData, setHypercertData] = useState(null);
  
    // Fetch hypercert information based on the claimID from the router query
    useEffect(() => {
      const claimID = router?.query?.id;
      async function fetchHypercerts(claimID: string) {
        const claimTokens = await getClaims(claimID);
        const metadataUri = claimTokens?.claimTokens[0]?.claim.uri;
        const metadata = await getData(metadataUri);
        metadata.id = claimID;
        console.log(metadata);
        if (metadata) {
          setHypercertData(metadata);
          console.log(metadata);
        }
      }
      fetchHypercerts(claimID as string);
    }, [router.query.id]);
    const tabsData = [
      {
        label: "Received Fundings",
        value: "received-fundings",
        icon: UserCircleIcon,
        desc: "Funder, Company, Found Amount",
      },
      {
        label: "Project Updates",
        value: "project-updates",
        icon: UserCircleIcon,
        desc: "Update Name, Update Description, IPFS CID Metadata",
      },
      {
        label: "Project Feedback",
        value: "Project Feedback",
        icon: UserCircleIcon,
        desc: "Project Feedback",
      },
      {
        label: "Registered Events",
        value: "registered-events",
        icon: UserCircleIcon,
        desc: "List of registered events",
      },
    ];
  
    const receivedFundings = [
      { funder: "Funder 1", company: "Company A", amount: "$10000" },
      { funder: "Funder 2", company: "Company B", amount: "$7500" },
      // Add more received fundings data
    ];
  
    const projectUpdates = [
      {
        updateName: "Update 1",
        updateDescription: "This is update 1 description.",
        ipfsCID: "Qm12345",
      },
      {
        updateName: "Update 2",
        updateDescription: "This is update 2 description.",
        ipfsCID: "Qm67890",
      },
      // Add more project updates data
    ];
  
    const projectOwners = [
      "Owner 1",
      "Owner 2",
      "Owner 3",
      // Add more project owners data
    ];
  
    const registeredEvents = [
      "Event 1",
      "Event 2",
      "Event 3",
      // Add more registered events data
    ];
  
    const [activeTab, setActiveTab] = useState("received-fundings");

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow p-4">
        {hypercertData && <HypercertProfile hypercert={hypercertData} />}
  
        <Tabs value={activeTab} className="max-w-[40rem] mx-auto">
          <TabsHeader
            className="bg-transparent"
            indicatorProps={{
              className: "bg-gray-900/10 shadow-none !text-gray-900",
            }}
          >
            {tabsData.map(({ label, value }) => (
              <Tab key={value} value={value}>
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {tabsData.map(({ value }) => (
              <TabPanel
                key={value}
                value={value}
                className={`flex justify-center items-center ${
                  value === activeTab ? "" : "hidden"
                }`}
              >
                <div className="text-center">
                  {/* Render the content for each tab */}
                </div>
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </div>
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
}

export default ProjectPage;