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

 it("Mint new tokens exceeds the cap", async function(){
  const cap = await BestToken.cap();
  const initialSupply = await BestToken.totalSupply();
  const mintedAmount = ethers.parseEther("1100000");
  await expect(BestToken.connect(owner).mint(owner.address, mintedAmount))
    .to.be.revertedWithCustomError(BestToken, "ERC20ExceededCap")
    .withArgs(initialSupply + mintedAmount , cap);
 });

 it("Owner pauses and unpauses the token transfer", async function(){
  const mintedAmount = ethers.parseEther("1000");
  await BestToken.connect(owner).mint(user1.address, mintedAmount);
  await BestToken.connect(owner).pause();
  await expect(
    BestToken.connect(user1).transfer(user2.address, mintedAmount),
  ).to.be.revertedWithCustomError(BestToken, "EnforcedPause");

  await BestToken.connect(owner).unpause();
  await BestToken.connect(user1).transfer(user2.address, mintedAmount);
  const user2Balance = await BestToken.balanceOf(user2.address);
  expect(user2Balance).to.equal(mintedAmount);
 });
 
 it("Non-owner cannot pause and unpause", async function(){
  await expect(BestToken.connect(user1).pause()).to.be.revertedWithCustomError(
    BestToken,
    "OwnableUnauthorizedAccount",
  ).withArgs(user1.address);
  await expect(BestToken.connect(user1).unpause())
    .to.be.revertedWithCustomError(BestToken, "OwnableUnauthorizedAccount")
    .withArgs(user1.address);
 });

 it("Ownership transfer requires two steps", async function () {
   await BestToken.connect(owner).transferOwnership(user1.address);
   let theOwner = await BestToken.owner();
   expect(theOwner).to.equal(owner.address);

   await BestToken.connect(user1).acceptOwnership();
    theOwner = await BestToken.owner();
   
   expect(theOwner).to.equal(user1.address);
 });

 it("Wrong address tries to accept the ownership", async function () {
   await BestToken.connect(owner).transferOwnership(user1.address);
   let theOwner = await BestToken.owner();
   expect(theOwner).to.equal(owner.address);

   await expect(
     BestToken.connect(user2).acceptOwnership(),
   ).to.be.revertedWithCustomError(BestToken, "OwnableUnauthorizedAccount").withArgs(user2.address);
 });
 
 it("Burn tokens", async function() {
  const burnAmount = ethers.parseEther("1000");
  const initialSupply = await BestToken.balanceOf(owner.address);
  await BestToken.connect(owner).burn(burnAmount);
  const ownerBalance = await BestToken.balanceOf(owner.address);
  expect(ownerBalance).to.equal(initialSupply - burnAmount);
 });


});
