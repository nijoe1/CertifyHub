import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout";
import Footer from "@/components/Footer";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { UserCircleIcon } from "@heroicons/react/outline";
import AttestationForm from "@/components/AttestationForm";
import UserProfile from "@/components/UserProfile";
import Link from "next/link"; // Import the Link component
import { useAccount } from "wagmi";
import {
  getProfile,
  getUserProjects,
  getRegisteredProjects,
  getData,
  getClaims,
  getCompaniesVerifier,
} from "@/lib/operator/index";

const DashboardPage = () => {
  const [hypercerts, setHypercerts] = useState();
  const [verifierCompanies, setVerifierCompanies] = useState([]);
  const { address } = useAccount();

  useEffect(() => {
    async function fetchHypercerts() {
      if (!hypercerts) {
        const registeredProjects = await getRegisteredProjects(
          "All Categories"
        );

        let tokens = await getUserProjects(address);
        let filteredClaimIds = registeredProjects.map(
          (project: any) =>
            "0x822f17a9a5eecfd66dbaff7946a8071c265d1d07-" + project.claimID
        );

        filteredClaimIds.categories = registeredProjects.map(
          (project: any) => project.categories
        );

        const filteredClaimIdsInData = filteredClaimIds.filter((claimId: any) =>
          tokens.claimTokens.some((token: any) => token.claim.id === claimId)
        );

        const combinedProjects = filteredClaimIdsInData.map((userProject) => {
          const matchingRegisteredProject = filteredClaimIds.find(
            (regProject) => regProject.claimID == userProject
          );
          console.log(matchingRegisteredProject);

          if (!matchingRegisteredProject) {
            return {
              claimID: userProject,
              categories: [], // If no matching project found, initialize with empty categories
            };
          }

          return {
            claimID: userProject,
            categories: matchingRegisteredProject.categories.map((category) =>
              category.trim()
            ),
          };
        });

        console.log(combinedProjects);

        const hypercertList = [];

        for (const id of combinedProjects) {
          const claimTokens = await getClaims(id.claimID);
          const metadataUri = claimTokens?.claimTokens[0]?.claim?.uri;
          const metadata = await getData(metadataUri);
          console.log(metadata);

          metadata.hypercert.categories = id?.categories.map(
            (item: any) => item.category
          );
          metadata.id = id ? id : undefined;
          hypercertList.push(metadata);
        }
        // @ts-ignore
        setHypercerts(hypercertList);

        let companies = await getCompaniesVerifier(address);
        console.log(companies);
        let temp = [];
        for (const company of companies) {
          console.log(company);
          temp.push(company);
        }
        setVerifierCompanies(temp);
        console.log(verifierCompanies);
      }
    }

    fetchHypercerts();
  }, [hypercerts, verifierCompanies]);

  const data = [
    {
      label: "Projects",
      value: "projects",
      icon: UserCircleIcon,
      desc: "View and manage your projects.",
    },
    {
      label: "Verifier Companies",
      value: "verifier-companies",
      icon: UserCircleIcon,
      desc: "Attest and validate projects as a verifier.",
    },
  ];

  const [activeTab, setActiveTab] = useState("projects");
  const [attestModalOpen, setAttestModalOpen] = useState(false);

  const handleTabChange = (tabValue: any) => {
    setActiveTab(tabValue);
  };

  const handleAttestButtonClick = () => {
    setAttestModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center p-4">
        <UserProfile />
      </div>
      <div className="flex-grow flex items-center justify-center">
        {" "}
        {/* Center content vertically and horizontally */}
        <div className="container mx-auto py-8 max-w-[40rem]">
          <h1 className="items-center justify-center text-2xl font-semibold mb-4">
            Dashboard
          </h1>

          <Tabs value="projects" className="max-w-[40rem]">
            <TabsHeader
              className="bg-transparent"
              indicatorProps={{
                className: "bg-gray-900/10 shadow-none !text-gray-900",
              }}
            >
              {data.map(({ label, value }) => (
                <Tab key={value} value={value}>
                  {label}
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody>
              <TabPanel value="projects">
                <h2 className="text-lg font-semibold mb-2">My Projects</h2>

                {hypercerts?.map((hypercert) => (
                  <div
                    key={hypercert.id}
                    className="bg-blue-100 p-4 rounded mb-4"
                  >
                    <Link href={`/project?id=${hypercert.id.claimID}`}>
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
                            {category.category}
                          </span>
                        )
                      )}
                    </div> */}
                    <button
                      onClick={handleAttestButtonClick}
                      className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                    >
                      Attest Completed Task
                    </button>
                  </div>
                ))}
              </TabPanel>
              <TabPanel value="verifier-companies">
                <h2 className="text-lg font-semibold mb-2">
                  Verifier Companies
                </h2>
                {verifierCompanies.map((company, index) => (
                  <div
                    key={index}
                    className={`bg-blue-100 p-4 rounded mb-4 ${
                      activeTab === "verifier-companies" ? "bg-opacity-80" : ""
                    }`}
                  >
                    <Link href={`/company`}>
                      <h3 className="text-md font-bold mb-1">{company.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">
                      {company.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Admin: {company.admin}
                    </p>
                  </div>
                ))}
              </TabPanel>
            </TabsBody>
            {/* Attest Modal */}
            {attestModalOpen && (
              <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <AttestationForm
                  onClose={() => setAttestModalOpen(false)}
                  // Pass necessary props to the attest modal component
                />
              </div>
            )}
          </Tabs>
        </div>
      </div>
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
