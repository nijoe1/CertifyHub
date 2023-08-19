import { NFTStorage, Blob } from "nft.storage";
import axios from "axios";

export const getIpfsGatewayUri = (cidOrIpfsUri) => {
    const NFT_STORAGE_IPFS_GATEWAY = "https://nftstorage.link/ipfs/{cid}";
    const cid = cidOrIpfsUri.replace("ipfs://", "");
    return NFT_STORAGE_IPFS_GATEWAY.replace("{cid}", cid);
};

const defaultNftStorageClient = new NFTStorage({ token: process.env.NFT_STORAGE_TOKEN });

export const storeMetadata = (data) => __awaiter(void 0, void 0, void 0, function*() {
    console.log("Storing metadata: ", data);
    const client = defaultNftStorageClient;
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    return yield client.storeBlob(blob);
});

export const getMetadata = (cidOrIpfsUri) => __awaiter(void 0, void 0, void 0, function*() {
    const nftStorageGatewayLink = getIpfsGatewayUri(cidOrIpfsUri);
    console.log(`Getting metadata ${cidOrIpfsUri} at ${nftStorageGatewayLink}`);
    return axios
        .get(nftStorageGatewayLink)
        .then((result) => result.data)
        .catch((err) => {
            console.error(err);
            return null;
        });
});

export const storeData = (data) => __awaiter(void 0, void 0, void 0, function*() {
    const client = defaultNftStorageClient;
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    console.log("Storing blob of: ", data);
    return yield client.storeBlob(blob);
});

export const getData = (cidOrIpfsUri) => __awaiter(void 0, void 0, void 0, function*() {
    const nftStorageGatewayLink = getIpfsGatewayUri(cidOrIpfsUri);
    console.log(`Getting  data ${cidOrIpfsUri} at ${nftStorageGatewayLink}`);
    return axios
        .get(nftStorageGatewayLink)
        .then((result) => result.data)
        .catch((err) => {
            console.error(err);
            return null;
        });
});

export const deleteMetadata = (cid, targetClient) => __awaiter(void 0, void 0, void 0, function*() {
    console.log(`Deleting metadata: ${cid}`);
    const client = targetClient !== null && targetClient !== void 0 ? targetClient : defaultNftStorageClient;
    return client.delete(cid);
});