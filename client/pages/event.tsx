import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/Footer";
import FeedbackModal from "@/components/FeedbackModal";
import Link from "next/link"; // Import the Link component
import { getEvent, getData, getEventProjects, getClaims } from "@/lib/operator";
import router, { useRouter } from "next/router";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
const EventPage = () => {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [eventData, setEventData] = useState(undefined);
  const [projects, setProjects] = useState([]);
  const [hypercerts, setHypercerts] = useState([]);

  const router = useRouter();

  const handleLeaveFeedback = (project: any) => {
    setSelectedProject(project);
    setFeedbackModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedProject(null);
    setFeedbackModalOpen(false);
  };

  useEffect(() => {
    async function fetchFunderDetails() {
      let event = await getEvent(router.query.id);
      console.log(event);
      let metadata = await getData(event[0].cid);
      metadata.host = event[0].name;
      setEventData(metadata);
      console.log(metadata);
      let EventProjects = await getEventProjects(router.query.id);
      console.log(EventProjects);
      let temp = [];
      for (const project of EventProjects) {
        temp.push(project.claimID);
      }
      setProjects(temp);
      console.log(projects);
      if (hypercerts.length == 0) {
        const hypercertList = [];

        for (const id of projects) {
          const claimTokens = await getClaims(
            "0x822f17a9a5eecfd66dbaff7946a8071c265d1d07-" + id
          );
          const metadataUri = claimTokens?.claimTokens[0]?.claim?.uri;
          const metadata = await getData(metadataUri);

          // metadata.hypercert.categories = id?.categories.map(
          //   (item: any) => item.category
          // );
          metadata.id = id ? id : undefined;
          hypercertList.push(metadata);
        }
        // @ts-ignore
        setHypercerts(hypercertList);
        console.log(hypercerts);
      }
    }
    fetchFunderDetails();
  }, [router.query.id, hypercerts]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="container mx-auto py-8 flex flex-col items-center">
        {eventData && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md w-80 text-center">
            <div className="flex items-center justify-center mb-4">
              <img
                src={`data:image/png;base64,${eventData.fileBase64}`}
                alt="Event Image"
                className="w-24 h-24 rounded-full"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">
                name: {eventData.name}
              </h2>
              <p className="text-gray-600 mb-2">
                description: {eventData.description}
              </p>
              <p className="text-gray-600 mb-2">eventHost: {eventData.host}</p>
              <p className="text-gray-600 mb-2">type: {eventData.type}</p>
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              <Link href="#">
                <p className="text-blue-500 hover:underline">View Details</p>
              </Link>
            </div>
          </div>
        )}

        <Tabs value="projects" className="max-w-[40rem] mt-10">
          <TabsHeader
            className="bg-transparent"
            indicatorProps={{
              className: "bg-gray-900/10 shadow-none !text-gray-900 ",
            }}
          >
            {/* Render tabs */}
            <Tab value="projects">Projects</Tab>{" "}
            <Tab value="Fundings">Fundings</Tab>
            <Tab value="Verifiers">Verifiers</Tab>
          </TabsHeader>
          <TabsBody>
            <TabPanel value="projects">
              {hypercerts.length > 0 ? (
                hypercerts.map((hypercert) => (
                  <div
                    key={hypercert.id}
                    className="bg-blue-100 p-4 rounded mb-4"
                  >
                    <Link
                      href={`/project?id=0x822f17a9a5eecfd66dbaff7946a8071c265d1d07-${hypercert.id}`}
                    >
                      <h3 className="text-md font-semibold mb-1">
                        {hypercert.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">
                      {hypercert.description.slice(0, 50) + "..."}
                    </p>
                    {/* <div className="flex space-x-2">
                      {hypercert.hypercert.categories.map(
                        (category, categoryIndex) => (
                          <span
                            key={categoryIndex}
                            className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap"
                          >
                            {category}
                          </span>
                        )
                      )}
                    </div> */}
                  </div>
                ))
              ) : (
                <p>Loading projects...</p>
              )}
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>
      <div className="flex-grow"></div>

      <Footer />
    </div>
  );
};

export default EventPage;
