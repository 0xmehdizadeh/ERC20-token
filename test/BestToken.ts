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

 it("Should set totalSupply and cap(maxSupply) correctly", async function() {
  const totalSupply = await BestToken.totalSupply();
  const maxSupply = await BestToken.cap();
  expect(totalSupply).to.equal(ethers.parseUnits("1000000", 18));
  expect(maxSupply).to.equal(ethers.parseUnits("2000000", 18));
 });

 it("Should set the owner and its balance correctly", async function () {
   const contractOwner = await BestToken.owner();
   const balanceOfOwner = await BestToken.balanceOf(contractOwner);
   expect(contractOwner).to.equal(owner.address);
   expect(balanceOfOwner).to.equal(ethers.parseUnits("1000000", 18));
 });

 it("Not-owner cannot call mint function", async function(){
  await expect(BestToken.connect(user1).mint(user1.address, 1000)).to.be.revertedWithCustomError(
    BestToken, "OwnableUnauthorizedAccount").withArgs(user1.address);
 });

 it("Owner calls mint function", async function() {
  const initialSupply = await BestToken.totalSupply();
  const mintAmount = ethers.parseUnits("1000", 18);
  await BestToken.connect(owner).mint(
    user1.address,
    mintAmount
  );
  const totalSupply = await BestToken.totalSupply();
  const user1Balance = await BestToken.balanceOf(user1.address);
  expect(totalSupply).to.equal(initialSupply + mintAmount);
  expect(user1Balance).to.equal(mintAmount);
 });

});
