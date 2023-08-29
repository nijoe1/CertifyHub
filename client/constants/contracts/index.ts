import { Address } from "viem";
import fundTheCommonsAbi from "../abi/fundTheCommonsAbi.json";


//get the chains id from the env
//optmisticTestnet = 420
//base = 84531

export const CONTRACTS = {
  fundTheCommons: {
    5: {
      contract: "0x9121EB64ACBf6C3E1380f9cA1D8BCc75bc03DEDB" as Address,
      abi: fundTheCommonsAbi,
    },
  },
};