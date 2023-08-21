import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import HypercertProfile from "@/components/HypercertProfile";
import Navbar from "@/components/layout/Navbar"; // Import your NavBar component
import Footer from "@/components/Footer"; // Import your Footer component
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import {
  Square3Stack3DIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { getData } from "../lib/operator/index";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const thegraph = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-testnet",
  cache: new InMemoryCache(),
});

async function getClaims(claimId: string) {
  let query = gql`{
    claimTokens (where: { claim: "${claimId}" }) {
      id
      owner
      tokenID
      units
      claim {
        id
        uri
        owner
      } 
    }
  }`;

  const response = await thegraph.query({
    query,
    fetchPolicy: "no-cache",
  });
  console.log(response.data);
  return response.data;
}

export default function Project() {
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

  // Tabs data
  const tabsData = [
    {
      label: "Fundings",
      value: "fundings",
      icon: Square3Stack3DIcon,
      desc: "Funding information and details.",
    },
    {
      label: "Owners",
      value: "owners",
      icon: UserCircleIcon,
      desc: "Owners and contributors to the hypercert.",
    },
    {
      label: "Feedback",
      value: "feedback",
      icon: Cog6ToothIcon,
      desc: "Feedback and comments related to the hypercert.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* Render the NavBar component */}
      <div className="flex-grow p-4">
        {/* Display Hypercert Profile */}
        {hypercertData && <HypercertProfile hypercert={hypercertData} />}

        {/* Tabs */}
        <Tabs value="fundings">
          <TabsHeader>
            {tabsData.map(({ label, value, icon }) => (
              <Tab key={value} value={value}>
                <div className="flex items-center gap-2">
                  {React.createElement(icon, { className: "w-5 h-5" })}
                  {label}
                </div>
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {tabsData.map(({ value, desc }) => (
              <TabPanel key={value} value={value}>
                {desc}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </div>
      <div className="flex-grow"></div>
      <Footer /> {/* Render the Footer component */}
    </div>
  );
}