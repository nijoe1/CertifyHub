import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { NFTStorage, Blob } from "nft.storage";
import axios from "axios";
import { ENS } from "@ensdomains/ensjs";
import { providers } from "ethers";

const tables = {
  categories: "hypercert_categories_5_1569",
  fundings: "hypercert_fundings_5_1570",
  attestations: "hypercert_attestations_5_1571",
  tasks: "hypercert_completed_tasks_5_1572",
  project_events: "hypercert_events_5_1573",
  project_splitters: "hypercert_splitters_5_1574",
  company: "company_5_1575",
  company_event: "event_5_1576",
  company_event_verifiers: "event_verifiers_5_1577",
};

export const getIpfsGatewayUri = (cidOrIpfsUri) => {
  const NFT_STORAGE_IPFS_GATEWAY = "https://nftstorage.link/ipfs/{cid}";
  // const cid = cidOrIpfsUri.replace("ipfs://", "");
  return NFT_STORAGE_IPFS_GATEWAY.replace("{cid}", cidOrIpfsUri);
};

const defaultNftStorageClient = new NFTStorage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDAyYTBDMUE4NjVDYUQ2QjRkNThBMmQ3ZTczM2QxQmZlODExMGI1MTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1Mzc2MzE0NjQ2NiwibmFtZSI6Im5mdHMifQ.muYCOBPi5WGkwgsQIxNe2GOSpgVxzZf_4Dv5jiEq9Dk",
});

export const storeMetadata = async (data) => {
  console.log("Storing metadata: ", data);
  const client = defaultNftStorageClient; // Update this if you have a custom NFT storage client
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  return await client.storeBlob(blob);
};

export const getMetadata = async (cidOrIpfsUri) => {
  const nftStorageGatewayLink = getIpfsGatewayUri(cidOrIpfsUri);
  console.log(`Getting metadata ${cidOrIpfsUri} at ${nftStorageGatewayLink}`);
  const link = nftStorageGatewayLink.replace("ipfs://", "");
  try {
    const result = await axios.get(link);
    return result.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getProfile = async (handle) => {
  const ens = new ENS();
  // const transactions  = {
  //    textSet: resolver.contract.methods.setText(node, "url", "https://ethereum.org/").encodeABI();
  // }
  const provider = new providers.JsonRpcProvider(
    "https://rpc.ankr.com/eth_goerli"
  );
  await ens.setProvider(provider);
  let name = await ens.getText(handle, "name");
  let description = await ens.getText(handle, "description");
  let image = await ens.getText(handle, "image");
  let github = await ens.getText(handle, "com.github");
  github = "https://github.com/" + github;
  let twitter = await ens.getText(handle, "twitter");

  let profile = {
    name: name ? name : "Name",
    title: description ? description : "Web Developer",
    image: image
      ? image
      : "https://gateway.lighthouse.storage/ipfs/QmbWt4Fyggz6dWEvvGFW6TjSSyL4TLo2FfBKmC7MWD1r6n",
    github: github ? github : "https://github.com",
    twitter: twitter ? twitter : "https://twitter.com",
  };
  return profile;
};

export const updateProfile = async (handle) => {
  const ens = new ENS();
  // const transactions  = {
  //    textSet: resolver.contract.methods.setText(node, "url", "https://ethereum.org/").encodeABI();
  // }
  const provider = new providers.JsonRpcProvider(
    "https://rpc.ankr.com/eth_goerli"
  );
  const resolver = await ens.getResolver(handle);
  await ens.setProvider(provider);
  let name = await ens.getText(handle, "name");
  let description = await ens.getText(handle, "description");
  let image = await ens.getText(handle, "image");
  let github = await ens.getText(handle, "com.github");
  github = "https://github.com/" + github;
  let twitter = await ens.getText(handle, "twitter");

  let profile = {
    name: name ? name : "Name",
    title: description ? description : "Web Developer",
    image: image
      ? image
      : "https://gateway.lighthouse.storage/ipfs/QmbWt4Fyggz6dWEvvGFW6TjSSyL4TLo2FfBKmC7MWD1r6n",
    github: github ? github : "https://github.com",
    twitter: twitter ? twitter : "https://twitter.com",
  };
  return profile;
};

export const storeData = async (data) => {
  const client = defaultNftStorageClient; // Update this if you have a custom NFT storage client
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  console.log("Storing blob of: ", data);
  return await client.storeBlob(blob);
};

export const getData = async (cidOrIpfsUri) => {
  let nftStorageGatewayLink = getIpfsGatewayUri(cidOrIpfsUri);

  console.log(`Getting data ${cidOrIpfsUri} at ${nftStorageGatewayLink}`);
  const link = nftStorageGatewayLink.replace("ipfs://", "");

  try {
    const result = await axios.get(link);
    return result.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getClaims = async (claimId) => {
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
};

export const getUserHypercerts = async (userAddress) => {
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
};

export const getUserProjects = async (userAddress) => {
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
};

export const getRegisteredClaimIDs = async () => {
  const hypercertIdsResponse = await fetch(
    "https://testnets.tableland.network/api/v1/query?format=objects&statement=SELECT%20DISTINCT(claimID)%20FROM%20hypercert_categories_5_1486"
  );
  return await hypercertIdsResponse.json();
};

export const getRegisteredProjects = async (category) => {
  let url = "";

  if (category === "All Categories") {
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

export const getProjectUpdates = async () => {
  const query = `SELECT * FROM ${tables.tasks}`;
  const encodedQuery = encodeURIComponent(query);
  const fullURL =
    `https://testnets.tableland.network/api/v1/query?` +
    `format=objects&extract=true&statement=${encodedQuery}`;
  const categories = await fetch(fullURL);
  let result = await categories.json();
  return result;
};

export const getFunders = async () => {
  const query = `SELECT * FROM ${tables.company}`;
  const encodedQuery = encodeURIComponent(query);
  const fullURL =
    `https://testnets.tableland.network/api/v1/query?` +
    `&statement=${encodedQuery}`;
  const categories = await fetch(fullURL);
  let result = await categories.json();
  return result;
};

export const getEvents = async () => {
  const query = `SELECT DISTINCT(eventID) , company , cid FROM ${tables.company_event} `;
  const encodedQuery = encodeURIComponent(query);
  const fullURL =
    `https://testnets.tableland.network/api/v1/query?` +
    `&statement=${encodedQuery}`;
  const categories = await fetch(fullURL);
  let result = await categories.json();
  return result;
};

export const getEvent = async (eventID) => {
  const query = `https://testnets.tableland.network/api/v1/query?format=objects&extract=true&statement=SELECT json_object(
      'name', B.company,
      'cid', B.cid, 
      'verifiers', 
      json_group_array(json_object(
        'address', A.verifierAddress
      )))
    FROM ${tables.company_event_verifiers} AS A JOIN ${tables.company_event} AS B ON A.eventID = B.eventID 
    WHERE B.eventID='${eventID}'`;

  const categories = await fetch(query);
  let result = await categories.json();
  return result;
};

export const getEventProjects = async (eventID) => {
  const query = `https://testnets.tableland.network/api/v1/query?&statement=SELECT DISTINCT(A.claimID)
    FROM ${tables.project_events} AS A JOIN ${tables.company_event} AS B ON A.eventID = B.eventID 
    WHERE A.eventID='${eventID}'`;

  const categories = await fetch(query);
  let result = await categories.json();
  return result;
};

export const getCompaniesVerifier = async(address)=>{
  const query = `https://testnets.tableland.network/api/v1/query?&statement=SELECT DISTINCT(A.company),C.image
  FROM ${tables.company} AS C, ${tables.company_event} AS A  JOIN  ${tables.company_event_verifiers} AS B ON A.eventID = B.eventID WHERE B.verifierAddress='${address.toLowerCase()}' AND A.company = C.company`
  const categories = await fetch(query);
  let result = await categories.json();
  return result;
}

export const getClaimEvents = async (claimID) => {
  const query = `SELECT A.eventID , A.cid FROM ${tables.company_event} AS A  JOIN  ${tables.project_events} AS B ON A.eventID = B.eventID WHERE B.claimID='${claimID}'`;
  const events = await fetch(
    `https://testnets.tableland.network/api/v1/query?` + `&statement=${query}`
  );
  let result = await events.json();
  console.log(result);
  return result;
};

export const getFunderDetails = async (funder) => {
  const query = `https://testnets.tableland.network/api/v1/query?format=objects&extract=true&statement=SELECT json_object(
                    'name', A.company,
                    'image', A.image, 
                    'description', A.description,
                    'admin', A.admin ,
                    'events', 
                    json_group_array(json_object(
                        'eventID', C.eventID,
                        'cid',C.cid,
                        'endsAt', C.endsAt
                        )
                    )
                )FROM ${tables.company_event} AS C , ${tables.company} AS A JOIN ${tables.company_event} AS B ON A.company = B.company 
                WHERE A.company='${funder}' AND B.eventID = C.eventID`;
  const fullURL = encodeURIComponent(query);

  const events = await fetch(query);
  let result = await events.json();
  return result;
};

export const getCategories = async () => {
  const query = `SELECT DISTINCT(category) FROM ${tables.categories}`;
  const encodedQuery = encodeURIComponent(query);
  const fullURL =
    `https://testnets.tableland.network/api/v1/query?` +
    `format=objects&extract=true&statement=${encodedQuery}`;
  const categories = await fetch(fullURL);
  let result = await categories.json();
  return result;
};

export const getRegisteredCompanies = async (userAddress) => {
  const categories = await fetch(
    "https://testnets.tableland.network/api/v1/query?format=objects&extract=true&statement=%20SELECT%20DISTINCT(category)%20FROM%20%20%20hypercert_categories_5_1486"
  );
  let result = await categories.json();
  return result;
};
