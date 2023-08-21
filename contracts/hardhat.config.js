require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
                // details: { yul: false },
            },
        },
    },
    defaultNetwork: "goerli",
    // defaultNetwork: "optimism_goerli",

    networks: {
        goerli: {
            chainId: 5,
            url: "https://rpc.ankr.com/eth_goerli",
            accounts: [PRIVATE_KEY],
        },
        optimism_goerli: {
            chainId: 420,
            url: "https://opt-goerli.g.alchemy.com/v2/Qs0oArxRd6ljm5ELdIzJ1qHhbvbjndSu",
            accounts: [PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: "KNVT7KRT9B15Z5UTXZT8TG8HNMIJXWXRMY",
        // apiKey: "293U4XQC3RSYF322F6B2J6EY6EWBB2DUWW",
        // apiKey: "MPZZXTM8AFBE965THC1C7JPUA4BUA348KD",
        customChains: [],
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
};