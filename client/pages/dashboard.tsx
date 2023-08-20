import React from 'react';
import { Navbar } from '@/components/layout';
import Footer from '@/components/Footer';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import { Square3Stack3DIcon, UserCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import ChosenCategoriesBox from "@/components/ChosenCategoriesBox";

const DashboardPage = () => {
  const data = [
    {
      label: "My Projects",
      value: "my-projects",
      icon: Square3Stack3DIcon,
      desc: "View and manage your projects.",
    },
    {
      label: "Verifier Companies",
      value: "verifier-companies",
      icon: UserCircleIcon,
      desc: "Attest and validate projects as a verifier.",
    }
  ];

  // Dummy data for projects and verifier companies
  const myProjects = [
    // ... your projects data
  ];

  const verifierCompanies = [
    // ... verifier companies data
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

        <Tabs value="my-projects">
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
              {/* Render your projects using the MyProjects component or a similar approach */}
            </TabPanel>
            <TabPanel value="verifier-companies">
              <h2 className="text-lg font-semibold mb-2">Verifier Companies</h2>
              {/* Render verifier companies and the attestation/validation process */}
              {verifierCompanies.map((company, index) => (
                <div key={index} className="bg-blue-100 p-4 rounded mb-4">
                  <h3 className="text-md font-semibold">{company.name}</h3>
                  {/* Render the attestation/validation process */}
                </div>
              ))}
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>

      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default DashboardPage;