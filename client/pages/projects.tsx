import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout';
import Footer from '@/components/Footer';
import HypercertCard from '@/components/HypercertCard'; // Make sure to adjust the path based on your project structure
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {getData} from "../lib/operator/index"
// Define the type for the props
type ProjectsProps = {
  hypercerts: Array<any>; // Update this type to match your hypercert data structure
};

//SUPPORT FOR MORE NETWORKS IS POSSIBLE AS LONG AS THE GRAPH SUPPORTS IT.
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


  const Projects = () => {
    // @ts-ignore
    const [hypercerts, setHypercerts] = useState([]); // Initialize the state

    useEffect(() => {
      async function fetchHypercerts() {
        // Fetch the hypercert IDs
        const hypercertIdsResponse = await fetch(
          'https://testnets.tableland.network/api/v1/query?format=objects&statement=SELECT%20DISTINCT(claimID)%20FROM%20hypercert_categories_5_1486'
        );
        const hypercertIdsData = await hypercertIdsResponse.json();
            console.log(hypercertIdsData)
        const hypercertIds = hypercertIdsData.map((item) => item.claimID);
  
        const hypercertList = [];
  
        // Fetch hypercert details for each ID
        for (const claimId of hypercertIds) {
          let id = "0x822f17a9a5eecfd66dbaff7946a8071c265d1d07-" + claimId.toString()
          const claimTokens = await getClaims(id);
            const metadataUri = claimTokens?.claimTokens[0].claim.uri;
            const metadata = await getData(metadataUri);
            metadata.id = id;
            console.log(metadata)
            if (metadata) {
              hypercertList.push(metadata);
              console.log(metadata)
            }
        }
        // @ts-ignore
        setHypercerts(hypercertList); // Update the state with fetched data
      }
  
      fetchHypercerts();
    }, []);
    return (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="container mx-auto py-8">
            <h1 className="text-2xl font-semibold mb-4">Projects Page</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Map through hypercerts and display in grid */}
              {hypercerts.map(hypercert => (
                <HypercertCard
                  key={hypercert?.id}
                  hypercert={hypercert}
                  onDetailsClick={undefined}
                />
              ))}
            </div>
          </div>
          <div className="flex-grow"></div>
          <Footer />
        </div>
      );
    };
    
    export default Projects;
