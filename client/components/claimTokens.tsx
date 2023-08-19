import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useEffect } from "react";
import {HypercertForm,HypercertFormData} from './form';

// NOTE: you should replace this with your own JSON-RPC provider to the network
// This should have signing abilities and match the `chainId` passed into HypercertClient
const nftStorageToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDAyYTBDMUE4NjVDYUQ2QjRkNThBMmQ3ZTczM2QxQmZlODExMGI1MTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1Mzc2MzE0NjQ2NiwibmFtZSI6Im5mdHMifQ.muYCOBPi5WGkwgsQIxNe2GOSpgVxzZf_4Dv5jiEq9Dk";
const web3StorageToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEZDNERkMDNkNDAwYjE5OEIzODY0YjdiNDhmOTNjNTJDODNkMjk4OTQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjEwODYxNjIzNjAsIm5hbWUiOiJtb29nIn0.SRskVSLYJ-lHDRcnl0KO6Eb4XuPyg5UaQq5BpvMeuwM";


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
}

function ClaimTokensComponent() {
  // @ts-ignore

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // You can await here
    const claimId =
      "0x822f17a9a5eecfd66dbaff7946a8071c265d1d07-4051401860560693345994938076082632325595136"; // Replace with your claim ID
    getClaims(claimId);
  }, []);

    function handleFormSubmit(formData: HypercertFormData): void {
        console.log(formData)
    }

  return (
    <div>
            <HypercertForm onSubmit={handleFormSubmit} />

    </div>
  );
}

export default ClaimTokensComponent;
