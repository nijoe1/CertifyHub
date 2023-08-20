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

export const deleteMetadata = (cid, targetClient) => __awaiter(void 0, void 0, void 0, function*() {
    console.log(`Deleting metadata: ${cid}`);
    const client = targetClient !== null && targetClient !== void 0 ? targetClient : defaultNftStorageClient;
    return client.delete(cid);
});