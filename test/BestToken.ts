import { expect } from "chai";
import { network } from "hardhat";


describe("BestToken", function () {
 let owner: any;
 let user1: any;
 let user2: any;
 let ethers: any;
 let BestToken: any;

 beforeEach(async function () {
  ethers = await network.create();
  [owner, user1, user2] = await ethers.getSigners();
  BestToken = await ethers.deployContract("BestToken", ["BestToken", "BST", owner.address, ethers.parseEther("1000000")]);
  await BestToken.waitForDeployment();
 });

 

});
