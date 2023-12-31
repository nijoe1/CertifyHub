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
import UserProfile from "@/components/UserProfile";
import { useAccount } from "wagmi";
import {
  getUserProjects,
  getRegisteredProjects,
  getData,
  getClaims,
  getCompaniesVerifier,
} from "@/lib/operator/index";
import { useRouter } from "next/router";
import HypercertCard from "@/components/HypercertCard";
import { data } from "autoprefixer";

type Hypercert = {
  id: string;
  name: string;
  description: string;
  image: string;
  external_url: string;
  hypercert: {
    contributors: {
      value: string[];
    };
    categories: string[];
  };
};

const DashboardPage = () => {
  const [hypercerts, setHypercerts] = useState<Hypercert[]>([]);
  const [verifierCompanies, setVerifierCompanies] = useState([]);
  const { address } = useAccount();
  const router = useRouter();
  const [id, setID] = useState(router.query.address || address);

  useEffect(() => {
    async function fetchHypercerts() {
      if (hypercerts.length === 0) {
        const registeredProjects = await getRegisteredProjects(
          "All Categories"
        );
        let tokens = await getUserProjects(id);
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

        const combinedProjects = filteredClaimIds.map((userProject: any) => {
          const matchingRegisteredProject = filteredClaimIdsInData.find(
            (regProject: any) => userProject.claimID === regProject
          );

          if (!matchingRegisteredProject) {
            return {
              claimID: userProject,
              categories: userProject.categories,
            };
          }

          return {
            claimID: userProject,
            categories: userProject.categories,
          };
        });

        const hypercertList: Hypercert[] = [];

        for (const id of combinedProjects) {
          const claimTokens = await getClaims(id.claimID);
          const metadataUri = claimTokens?.claimTokens[0]?.claim?.uri;
          const metadata = await getData(metadataUri);
          console.log(id.categories);
          metadata.hypercert.categories = id?.categories || [];
          metadata.id = id.claimID;
          hypercertList.push(metadata);
        }

        setHypercerts(hypercertList);

        let companies = await getCompaniesVerifier(id);
        console.log(companies);
        let temp = [];
        for (const company of companies) {
          console.log(company);
          temp.push(company);
        }
      }
    }

    fetchHypercerts();
  }, []);

  const verifierCompaniesTable = [
    { name: "Filecoin", link: "/Funder?name=Filecoin" },
    { name: "Company B", link: "/Funder?name=AnotherCompany" },
    // Add more companies as needed
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center p-4">
        <UserProfile user={id} />
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="container mx-auto py-8 max-w-[40rem]">
          <h1 className="text-2xl font-semibold mb-4 text-center">Dashboard</h1>

          <Tabs value="projects" className="max-w-[40rem]">
            <TabsHeader
              className="bg-transparent"
              indicatorProps={{
                className: "bg-gray-900/10 shadow-none !text-gray-900",
              }}
            >
              {data &&
                // @ts-ignore
                [data].map(({ label, value }) => (
                  <Tab key={value} value={value}>
                    {label}
                  </Tab>
                ))}
            </TabsHeader>
            <TabsBody>
              <TabPanel value="projects">
                <h2 className="text-lg font-semibold mb-2">My Projects</h2>

                <div className="grid-cols-1">
                  {hypercerts.map((hypercert:any) => (
                    <HypercertCard
                      key={hypercert.id}
                      hypercert={hypercert}
                      // @ts-ignore
                      onDetailsClick={undefined}
                    />
                  ))}
                </div>
              </TabPanel>
              <TabPanel value="verifier-companies">
                <h2 className="text-lg font-semibold mb-2 flex justify-center items-center">
                  Verifier in Companies
                </h2>
                <table className="ml-40">
                  <thead>
                    <tr>
                      <th>Company Name</th>
                      <th>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifierCompaniesTable.map((company, index) => (
                      <tr key={index}>
                        <td>{company.name}</td>
                        <td>
                          <a href={company.link}>Go to Funder</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
