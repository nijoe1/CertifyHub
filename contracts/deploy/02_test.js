require("hardhat-deploy");
require("hardhat-deploy-ethers");
const {
  EAS,
  Offchain,
  SchemaEncoder,
  SchemaRegistry,
} = require("@ethereum-attestation-service/eas-sdk");

const { ethers } = require("hardhat");
const { Console } = require("console");

const private_key = network.config.accounts[0];

const wallet = new ethers.Wallet(private_key, ethers.provider);

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;
  console.log("Wallet+ Ethereum Address:", wallet.address);

  // QUERY PREFIX = https://testnets.tableland.network/api/v1/query?statement=

  const tablelandAddress = "0xf5b9c85F82Dc5BD8412e8C44FDbcc322774eF2C2";
  const tablelandVerifiersAddress =
    "0xeAceE940B3dBF549c743fFFFC96Bf0F8A1551C0B";
  const EAS_GOERLI = "0xF46e44C421780c9d30796469D8905D289c426caE";
  const REGISTRY_GOERLI = "0x8AE85A65525Eb2DA7eFc654ad9D3F372b23Bfc5e";
  const FundTheGoodsAddress = "0xf53380a7a622a2A5ef2b054b5079fE63e1E042d8";
  const verifiersRegistryAddress = "0x03190FF1CE6f978Ae72C7695590E10C8a639C11E";
  const SPLITTERIMPLEMENTATION = "0x4616fC6060D6d6176F49Edc6bb6975197F0D2e4A";
  const THIRDWEBFACTORY = "0x5DBC7B840baa9daBcBe9D2492E45D7244B54A2A0";
  const HYPERCERT = "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07";

  const VerifiersRegistry = await hre.ethers.getContractFactory(
    "VerifiersRegistry"
  );

  const FundTheGoods = await hre.ethers.getContractFactory("CertifyHub");

  //   tableland Address=>  0xf9C1394D0EA5aeda3F3ff8112CD6C1fCceb651f4
  // tablelandVerifiers Address=>  0x6A6f2F9313EAf130B4e8ee2552121d62EB0160bC
  // verifiersRegistry Address=>  0xE6b8feCd4022738Fc2C5e45edB8537173EBEE36f
  // transfered to verifiersRegistry
  // fundTheGoods Address=>  0xa55ad0622ccB464911486eF2F09622cE7bb96F7e

  const VerifiersRegistryInstance = VerifiersRegistry.attach(
    "0xAC0FDaC7Bd983B5696791A335395dfD176CF865c"
  );
  // let tx = await VerifiersRegistryInstance.registerCompany(
  //   "Filecoin",
  //   "https://gateway.lighthouse.storage/ipfs/Qmeiw26nnU4PB7RFHKFo1iENZt4LfqLJ6JUCbQd4W2XKxW",
  //   "Filecoin Grants",
  //   "0x9C5e3cAC8166eD93F76BC0469b8Bf3ca715bA6B7"
  // ,{gasLimit:1000000});
  // await tx.wait();

  tx = await VerifiersRegistryInstance.registerEvent(
    "Filecoin",
    "Grants",
    "Filecoin FPG DevGrants",
    "bafkreigkahigezk3rsrd6cgh2lkrdfn3dmxsns2daiv623oocoweyyyizu",
    [
      "0x9C5e3cAC8166eD93F76BC0469b8Bf3ca715bA6B7",
      wallet.address,
      "0x044B595C9b94A17Adc489bD29696af40ccb3E4d2",
      "0x464e3F471628E162FA34F130F4C3bCC41fF7635d",
    ],
    0
  );
  await tx.wait();
  const FundTheGoodsInstance = FundTheGoods.attach(FundTheGoodsAddress);
};
