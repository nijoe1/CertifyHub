import { FGStorage } from "@co2-storage/js-api";

const authType = "pk";
const ipfsNodeType = "client";

const ipfsNodeAddr = "/dns4/web2.co2.storage/tcp/5002/https";
const fgApiUrl = "https://web2.co2.storage";

const fgStorage = new FGStorage({
  authType: authType,
  ipfsNodeType: ipfsNodeType,
  ipfsNodeAddr: ipfsNodeAddr,
  fgApiHost: fgApiUrl,
});

export const getAssets = async () => {
  /**
   * Search assets
   * parameters: (chainName, phrases, cid, name, base, account, offset, limit, sortBy, sortDir)
   * // default data_chain: 'sandbox', phrases: null, cid: null, name: null, base: null, account: null, offset: 0, limit: 10
   */

  let searchAssetsResponse = await fgStorage.searchAssets("Gas Emissions Measurements - Hypen"); // ('SP Audits', 'Water')
  if (searchAssetsResponse.error != null) {
    console.error(searchAssetsResponse.error);
    await new Promise((reject) => setTimeout(reject, 300));
    process.exit()

  }
  return searchAssetsResponse
};

export const getTemplates = async () => {
    /**
     * Search assets
     * parameters: (chainName, phrases, cid, name, base, account, offset, limit, sortBy, sortDir)
     * // default data_chain: 'sandbox', phrases: null, cid: null, name: null, base: null, account: null, offset: 0, limit: 10
     */
      let searchTemplatesResponse = await fgStorage.searchTemplates("sandbox")    // ('SP Audits', 'Water')

    // let searchTemplatesResponse = await fgStorage.searchTemplates('sandbox')    // ('SP Audits', 'Water')
    if(searchTemplatesResponse.error != null) {
        console.error(searchTemplatesResponse.error)
        await new Promise(reject => setTimeout(reject, 300));
        process.exit()
    }
    return searchTemplatesResponse
  };
