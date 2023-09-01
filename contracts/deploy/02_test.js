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

  // tableland Address=>  0x7cdc035869B97305C271F11Be76cd4B78727B90C
  // tablelandVerifiers Address=>  0x03ca8c748eCD772e4B210a58A7265F565a00c5d8
  // verifiersRegistry Address=>  0x9047bcb098EaC9667Bbdc7b9C08849B5bAED883d
  // transfered to verifiersRegistry
  // fundTheGoods Address=>  0xa43A8E49120491e7fd0E674F7b1D5F7842723552

  // const VerifiersRegistryInstance = VerifiersRegistry.attach(
  //   "0xBF9f7ce3d32bA066096559a18eD1B1bDd07E5d63"
  // );
  // let tx = await VerifiersRegistryInstance.registerCompany(
  //   "Filecoin",
  //   "bafybeifxf5iviyk2o3zeta74b4iszjqngfwrga5e4gnrnnygna6ct5p3wi/image.png",
  //   "Filecoin Grants",
  //   wallet.address
  // ,{gasLimit:1000000});
  // await tx.wait();

  // tx = await VerifiersRegistryInstance.registerEvent(
  //   "Filecoin",
  //   "Filecoin FPG DevGrants",
  //   "bafybeifxf5iviyk2o3zeta74b4iszjqngfwrga5e4gnrnnygna6ct5p3wi",
  //   [
  //     "0x9C5e3cAC8166eD93F76BC0469b8Bf3ca715bA6B7",
  //     wallet.address,
  //     "0x044B595C9b94A17Adc489bD29696af40ccb3E4d2",
  //     "0x464e3F471628E162FA34F130F4C3bCC41fF7635d",
  //   ],
  //   0
  // );
  // await tx.wait();
  const FundTheGoodsInstance = FundTheGoods.attach(FundTheGoodsAddress);
};
