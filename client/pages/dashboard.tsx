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
import Link from "next/link"; // Import the Link component
import { useAccount } from "wagmi";
import { fetchEnsName } from "@wagmi/core";
import { ENS } from "@ensdomains/ensjs";
import { providers } from "ethers";

type UserProfileProps = {
  profileData: any; // You should replace 'any' with the actual type of your project
};



const UserProfile: React.FC<UserProfileProps> = ({ profileData }) => {
  const { address } = useAccount();
  const [ens, setEns] = useState("");
  const _ens = new ENS();
  // const transactions  = {
  //    textSet: resolver.contract.methods.setText(node, "url", "https://ethereum.org/").encodeABI();
  // }
  const provider = new providers.JsonRpcProvider("RPC_URL_HERE");
  useEffect(() => {
    async function fetchHypercerts() {
      await _ens.setProvider(provider);

      let resolvedAddress = await fetchEnsName({
        address: address as `0x{string}`,
      });
      console.log(resolvedAddress);
      if (resolvedAddress) {
        setEns(resolvedAddress.toString());
      }
    }

    fetchHypercerts();
  }, []);

  let hasENS = false;
  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md w-80">
        <div className="flex items-center justify-center mb-4">
          <img
            src={profileData.image}
            alt="User Profile"
            className="w-40 h-40 rounded-full"
          />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-1">{profileData.name}</h2>
          <p className="text-gray-600 mb-2">{profileData.title}</p>
          <div className="flex justify-center space-x-2">
            <a
              href={profileData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              GitHub
            </a>
            <a
              href={profileData.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Twitter
            </a>
          </div>
          <div className="flex justify-center space-x-2">
            {hasENS ? (
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                Update Profile
              </button>
            ) : (
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                RegisterENS
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const DashboardPage = () => {
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
  const verifierCompanies = [
    {
      name: "Company 1",
      description: "This is Company 1 description.",
      admin: "Admin 1",
    },
    {
      name: "Company 2",
      description: "This is Company 2 description.",
      admin: "Admin 2",
    },
  ];

  const [activeTab, setActiveTab] = useState("projects");
  const [attestModalOpen, setAttestModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    title: "Web Developer",
    image:
      "https://gateway.lighthouse.storage/ipfs/QmYuugRzTzN1k6DEFRrNj27pMCah2z1AAJnvNNmnPQJuAY",
    github: "https://github.com/johndoe",
    twitter: "https://twitter.com/johndoe",
  });

  const userHypercerts = [
    {
      id: 1,
      name: "Project 1",
      description: "This is the description of Project 1.",
      hypercert: {
        categories: [{ category: "Category 1" }, { category: "Category 2" }],
      },
    },
    {
      id: 2,
      name: "Project 2",
      description: "This is the description of Project 2.",
      hypercert: {
        categories: [{ category: "Category 3" }, { category: "Category 4" }],
      },
    },
  ];

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
        <UserProfile profileData={profileData} />
      </div>
      <div className="flex-grow flex items-center justify-center">
        {" "}
        {/* Center content vertically and horizontally */}
        <div className="container mx-auto py-8 max-w-[40rem]">
          <h1 className="items-center justify-center text-2xl font-semibold mb-4">
            Dashboard
          </h1>

          <Tabs value="my-projects" className="max-w-[40rem]">
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
              <TabPanel value="my-projects">
                <h2 className="text-lg font-semibold mb-2">My Projects</h2>
                {userHypercerts.map((hypercert) => (
                  <div
                    key={hypercert.id}
                    className="bg-blue-100 p-4 rounded mb-4"
                  >
                    <h3 className="text-md font-semibold mb-1">
                      {hypercert.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {hypercert.description}
                    </p>
                    <div className="flex space-x-2">
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
                    </div>
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
