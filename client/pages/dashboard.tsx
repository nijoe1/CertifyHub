import React, { useState } from 'react';
import { Navbar } from '@/components/layout';
import Footer from '@/components/Footer';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import {  UserCircleIcon } from "@heroicons/react/outline";

// Assume you have a custom Modal component for the attest form
import AttestationForm from '@/components/AttestationForm';

const DashboardPage = () => {
  const data = [
    {
      label: "My Projects",
      value: "my-projects",
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

  const [activeTab, setActiveTab] = useState("my-projects");
  const [attestModalOpen, setAttestModalOpen] = useState(false);

  // Dummy data for user projects and verifier companies
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

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  const handleAttestButtonClick = () => {
    setAttestModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

        <Tabs value={activeTab} onChange={handleTabChange}>
          <TabsHeader>
            {data.map(({ label, value, icon }) => (
              <Tab key={value} value={value}>
                <div className="flex items-center gap-2">
                  {React.createElement(icon, { className: "w-5 h-5" })}
                  {label}
                </div>
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            <TabPanel value="my-projects">
              <h2 className="text-lg font-semibold mb-2">My Projects</h2>
              {userHypercerts.map((hypercert) => (
                <div key={hypercert.id} className="bg-blue-100 p-4 rounded mb-4">
                  <h3 className="text-md font-semibold">{hypercert.name}</h3>
                  <p className="mb-2">{hypercert.description}</p>
                  <div className="flex space-x-2">
                    {hypercert.hypercert.categories.map((category, categoryIndex) => (
                      <span
                        key={categoryIndex}
                        className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap"
                      >
                        {category.category}
                      </span>
                    ))}
                  </div>
                  <button onClick={handleAttestButtonClick} className="bg-blue-500 text-white px-2 py-1 rounded mt-2">
                    Attest Completed Task
                  </button>
                </div>
              ))}
            </TabPanel>
            <TabPanel value="verifier-companies">
              <h2 className="text-lg font-semibold mb-2">Verifier Companies</h2>
              {/* Render verifier companies and the attestation/validation process */}
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>

      <div className="flex-grow"></div>
      <Footer />

      {/* Attest Modal */}
      {attestModalOpen && (
        <AttestationForm
          onClose={() => setAttestModalOpen(false)}
          // Pass necessary props to the attest modal component
        />
      )}
    </div>
  );
};

export default DashboardPage;
