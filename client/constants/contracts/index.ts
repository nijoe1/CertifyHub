import { Address } from "viem";
import fundTheCommonsAbi from "../abi/fundTheCommonsAbi.json";


//get the chains id from the env
//optmisticTestnet = 420
//base = 84531

export const CONTRACTS = {
  fundTheCommons: {
    5: {
      contract: "0xb8AB020E5F82178F1d6E3E5F34a928A29E6bb4AC" as Address,
      abi: fundTheCommonsAbi,
    },
  },
};