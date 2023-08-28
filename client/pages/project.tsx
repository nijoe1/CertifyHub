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
import ReceivedFundingsItem from "@/components/ReceivedFundingsItem";
import ProjectUpdatesItem from "@/components/ProjectUpdatesItem";
import ProjectFeedbackItem from "@/components/ProjectFeedbackItem";
import EventItem from "@/components/EventItem";
import { getData, getClaims } from "../lib/operator/index";
import { useRouter } from 'next/router';
import Link from 'next/link'; // Import the Link component

const ProjectPage = () => {
  const router = useRouter();
  const [hypercertData, setHypercertData] = useState(null);

  // Fetch hypercert information based on the claimID from the router query
  useEffect(() => {
    const claimID = router?.query?.id;
    async function fetchHypercerts(claimID) {
      const claimTokens = await getClaims(claimID);
      const metadataUri = claimTokens?.claimTokens[0]?.claim.uri;
      const metadata = await getData(metadataUri);
      metadata.id = claimID || undefined;
      if (metadata) {
        setHypercertData(metadata);
      }
    }
    fetchHypercerts(claimID);
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

  const projectFeedbacks = [
    {
      fromAddress: "0xAddress1",
      fromEvent: "Event 1",
      rating: 4,
      comment: "Great project!",
    },
    {
      fromAddress: "0xAddress2",
      fromEvent: "Event 2",
      rating: 5,
      comment: "Awesome work!",
    },
    // Add more project feedback data
  ];

  const eventDetails = {
    name: "Event Name",
    description: "This is event description.",
    eventID: "eventID123",
    image: "event_image.jpg",
  };

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
                  {value === "received-fundings" && (
                    <div>
                      {receivedFundings.map((funding, index) => (
                        <ReceivedFundingsItem
                          eventID={undefined}
                          fundingAmount={undefined}
                          companyName={undefined}
                          key={index}
                          {...funding}
                        />
                      ))}
                    </div>
                  )}
                  {value === "project-updates" && (
                    <div>
                      {projectUpdates.map((update, index) => (
                        <ProjectUpdatesItem
                          name={undefined}
                          description={undefined}
                          fromAddress={undefined}
                          cidMetadata={undefined}
                          key={index}
                          {...update}
                        />
                      ))}
                    </div>
                  )}
                  {value === "Project Feedback" && (
                    <div>
                      {projectFeedbacks.map((feedback, index) => (
                        <ProjectFeedbackItem key={index} {...feedback} />
                      ))}
                    </div>
                  )}
                  {value === "registered-events" && (
                    <div>
                      <EventItem {...eventDetails} />
                      {/* Add more EventItem components for each registered event */}
                    </div>
                  )}
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