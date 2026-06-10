import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

export default buildModule("SurveyFactoryModule", (m) => {
  const SurveyFactory = m.contract("SurveyFactory",[
    ethers.parseEther("1"),
    ethers.parseEther("0.01"),
  ]);
  return { SurveyFactory };
});
