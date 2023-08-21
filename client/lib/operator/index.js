import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { NFTStorage, Blob } from "nft.storage";
import axios from "axios";

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
    console.log(response.data);
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
            chainName
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

export const getRegisteredProjects = async(category) => {
    if (category === "All Categories") {
        const hypercertIdsResponse = await fetch("https://testnets.tableland.network/api/v1/query?format=objects&extract=true&statement=%20SELECT%20json_object(%20%27claimID%27,%20A.claimID,%20%27categories%27,%20json_group_array(%20json_object(%20%27category%27,%20B.category%20)%20)%20)%20FROM%20hypercert_categories_5_1486%20%20AS%20A%20JOIN%20hypercert_categories_5_1486%20%20AS%20B%20ON%20A.claimID%20=%20B.claimID%20GROUP%20BY%20A.claimID")
        let result = await (hypercertIdsResponse.json())
        return result
    } else {
        const hypercertIdsResponse = await fetch("https://testnets.tableland.network/api/v1/query?format=objects&extract=true&statement=%20SELECT%20json_object(%20%27claimID%27,%20A.claimID,%20%27categories%27,%20json_group_array(%20json_object(%20%27category%27,%20B.category%20)%20)%20)%20FROM%20hypercert_categories_5_1486%20%20AS%20A%20JOIN%20hypercert_categories_5_1486%20%20AS%20B%20ON%20A.claimID%20=%20B.claimID%20WHERE%20A.category=%27" + category + "%27%20GROUP%20BY%20A.claimID")
        let result = await (hypercertIdsResponse.json())
        return result
    }
}

export const getCategories = async() => {
    const categories = await fetch("https://testnets.tableland.network/api/v1/query?format=objects&extract=true&statement=%20SELECT%20DISTINCT(category)%20FROM%20%20%20hypercert_categories_5_1486");
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