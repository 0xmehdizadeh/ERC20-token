import { expect } from "chai";
import { network } from "hardhat";

describe("BestToken", function () {
 let owner: any;
 let user1: any;
 let user2: any;
 let ethers: any;
 let BestToken: any;

 beforeEach(async function () {
  ({ethers} = await network.create());
  [owner, user1, user2] = await ethers.getSigners();
  BestToken = await ethers.deployContract("BestToken", ["BestToken", "BST", owner.address, "1000000"]);
  await BestToken.waitForDeployment();
 });

 it("Should set the token's name correctly", async function () {
   const name = await BestToken.name();
   expect(name).to.equal("BestToken");
 });

 it("Should set the token's symbol correctly", async function () {
  const symbol = await BestToken.symbol();
  expect(symbol).to.equal("BST");
 });

 it("Should set total supply correctly", async function() {
  const totalSupply = await BestToken.totalSupply();
  expect(totalSupply).to.equal(ethers.parseUnits("1000000", 18));
 });

 it("Should set the owner correctly", async function () {
   const contractOwner = await BestToken.owner();
   expect(contractOwner).to.equal(owner.address);
 });

});
