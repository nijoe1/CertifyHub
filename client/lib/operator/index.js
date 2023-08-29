import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { NFTStorage, Blob } from "nft.storage";
import axios from "axios";

const tables = {
    categories:"hypercert_categories_5_1527",
    fundings:"hypercert_fundings_5_1528",
    attestations:"hypercert_attestations_5_1529",
    tasks:"hypercert_completed_tasks_5_1530",
    project_events:"hypercert_events_5_1531",
    project_splitters:"hypercert_splitters_5_1532",
    company:"company_5_1533",
    company_event:"event_5_1534",
    company_event_verifiers:"event_verifiers_5_1535"
}

export const getIpfsGatewayUri = (cidOrIpfsUri) => {
    const NFT_STORAGE_IPFS_GATEWAY = "https://nftstorage.link/ipfs/{cid}";
    // const cid = cidOrIpfsUri.replace("ipfs://", "");
    return NFT_STORAGE_IPFS_GATEWAY.replace("{cid}", cidOrIpfsUri);
};

const defaultNftStorageClient = new NFTStorage({ token: process.env.NFT_STORAGE_TOKEN });

export const storeMetadata = async(data) => {
    console.log('Storing metadata: ', data);
    const client = defaultNftStorageClient; // Update this if you have a custom NFT storage client
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    return await client.storeBlob(blob);
};

export const getMetadata = async(cidOrIpfsUri) => {
    const nftStorageGatewayLink = getIpfsGatewayUri(cidOrIpfsUri);
    console.log(`Getting metadata ${cidOrIpfsUri} at ${nftStorageGatewayLink}`);
    const link = nftStorageGatewayLink.replace("ipfs://", "")
    try {
        const result = await axios.get(link);
        return result.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const storeData = async(data) => {
    const client = defaultNftStorageClient; // Update this if you have a custom NFT storage client
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    console.log('Storing blob of: ', data);
    return await client.storeBlob(blob);
};

export const getData = async(cidOrIpfsUri) => {
    const nftStorageGatewayLink = getIpfsGatewayUri(cidOrIpfsUri);
    console.log(`Getting data ${cidOrIpfsUri} at ${nftStorageGatewayLink}`);
    const link = nftStorageGatewayLink.replace("ipfs://", "")

    try {
        const result = await axios.get(link);
        return result.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};


export const getClaims = async(claimId) => {
    const thegraph = new ApolloClient({
        uri: "https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-testnet",
        cache: new InMemoryCache(),
    });

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
    return response.data;
}

export const getUserHypercerts = async(userAddress) => {
    const thegraph = new ApolloClient({
        uri: "https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-testnet",
        cache: new InMemoryCache(),
    });

    let query = gql`{
                        claims(where: { owner: "${userAddress}" }) {
                            tokenID
                            creator
                            id
                            owner
                            totalUnits
                            uri
                          }
                    }`;
    const response = await thegraph.query({
        query,
        fetchPolicy: "no-cache",
    });
    return response.data;

}

export const getUserProjects = async(userAddress) => {
    const thegraph = new ApolloClient({
        uri: "https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-testnet",
        cache: new InMemoryCache(),
    });

    let query = gql`{
        claimTokens(where: { owner: "${userAddress}" } ) {
            id
            owner
            tokenID
            units
            claim {
              id
              creation
              uri
              totalUnits
            }
          }
                    }`;
    const response = await thegraph.query({
        query,
        fetchPolicy: "no-cache",
    });
    return response.data;

}

export const getRegisteredClaimIDs = async() => {
    const hypercertIdsResponse = await fetch("https://testnets.tableland.network/api/v1/query?format=objects&statement=SELECT%20DISTINCT(claimID)%20FROM%20hypercert_categories_5_1486");
    return await (hypercertIdsResponse).json()
}


export const getRegisteredProjects = async (category) => {
    let url = '';
  
    if (category === 'All Categories') {
      url = buildUrlForAllCategories();
    } else {
      url = buildUrlForSpecificCategory(category);
    }
  
    const hypercertIdsResponse = await fetch(url);
    const result = await hypercertIdsResponse.json();
    return result;
  };
  
  const buildUrlForAllCategories = () => {
    const tableName = tables.categories; // Replace with your actual table name
    return (
      `https://testnets.tableland.network/api/v1/query` +
      `?format=objects&extract=true&statement=` +
      encodeURIComponent(
        `SELECT json_object('claimID', A.claimID, 'categories', json_group_array(json_object('category', B.category))) FROM ${tableName} AS A JOIN ${tableName} AS B ON A.claimID = B.claimID GROUP BY A.claimID`
      )
    );
  };
  
  const buildUrlForSpecificCategory = (category) => {
    const tableName = tables.categories; // Replace with your actual table name
    return (
      `https://testnets.tableland.network/api/v1/query` +
      `?format=objects&extract=true&statement=` +
      encodeURIComponent(
        `SELECT json_object('claimID', A.claimID, 'categories', json_group_array(json_object('category', B.category))) FROM ${tableName} AS A JOIN ${tableName} AS B ON A.claimID = B.claimID WHERE A.category='${category}' GROUP BY A.claimID`
      )
    );
  };

// export const getCategories = async() => {
//     const categories = await fetch("https://testnets.tableland.network/api/v1/query?format=objects&extract=true&statement=%20SELECT%20DISTINCT(category)%20FROM%20%20%20hypercert_categories_5_1486");
//     let result = await (categories.json())
//     return result
// }claimID text, contributor text, cid text

export const getProjectUpdates = async() => {
    const query = `SELECT * FROM ${tables.tasks}`;
    const encodedQuery = encodeURIComponent(query);
    const fullURL = `https://testnets.tableland.network/api/v1/query?` +`format=objects&extract=true&statement=${encodedQuery}`;
    const categories = await fetch(fullURL);
    let result = await (categories.json())
    return result
}

export const getCategories = async() => {
    const query = `SELECT DISTINCT(category) FROM ${tables.categories}`;
    const encodedQuery = encodeURIComponent(query);
    const fullURL = `https://testnets.tableland.network/api/v1/query?` +`format=objects&extract=true&statement=${encodedQuery}`;
    const categories = await fetch(fullURL);
    let result = await (categories.json())
    return result
}

export const getRegisteredCompanies = async(userAddress) => {
    const categories = await fetch("https://testnets.tableland.network/api/v1/query?format=objects&extract=true&statement=%20SELECT%20DISTINCT(category)%20FROM%20%20%20hypercert_categories_5_1486");
    let result = await (categories.json())
    return result
}

export const deleteMetadata = (cid, targetClient) => __awaiter(void 0, void 0, void 0, function*() {
    console.log(`Deleting metadata: ${cid}`);
    const client = targetClient !== null && targetClient !== void 0 ? targetClient : defaultNftStorageClient;
    return client.delete(cid);
});