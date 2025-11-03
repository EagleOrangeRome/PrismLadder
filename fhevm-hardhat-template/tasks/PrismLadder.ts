import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("prism:submit", "Submit compensation data to PrismLadder contract")
  .addParam("contract", "The contract address")
  .addParam("base", "Base salary in USD")
  .addParam("bonus", "Annual bonus in USD")
  .addParam("equity", "Annual equity vesting in USD")
  .addParam("role", "Role (0-6: SoftwareEngineer, ProductManager, Designer, Sales, HR, Executive, Other)")
  .addParam("level", "Level (0-6: Junior, Mid, Senior, StaffPlus, Manager, Director, VPExecutive)")
  .addParam("geography", "Geography (0-4: NorthAmerica, Europe, AsiaPacific, LatinAmerica, MiddleEastAfrica)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();

    const contract = await ethers.getContractAt("PrismLadderCompensation", taskArguments.contract);

    console.log(`Submitting compensation for ${signer.address}...`);
    console.log(`Base: $${taskArguments.base}, Bonus: $${taskArguments.bonus}, Equity: $${taskArguments.equity}`);
    console.log(`Role: ${taskArguments.role}, Level: ${taskArguments.level}, Geography: ${taskArguments.geography}`);

    // Note: In production, you would encrypt these values using FHEVM client
    // For this task, you need to provide encrypted values from the client side

    console.log("⚠️  This task requires encrypted inputs. Please use the frontend or implement encryption here.");
    console.log("Deployment address:", await contract.getAddress());
  });

task("prism:stats", "Get group statistics")
  .addParam("contract", "The contract address")
  .addParam("role", "Role (0-6)")
  .addParam("level", "Level (0-6)")
  .addParam("geography", "Geography (0-4)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers } = hre;

    const contract = await ethers.getContractAt("PrismLadderCompensation", taskArguments.contract);

    const count = await contract.getGroupCount(
      taskArguments.role,
      taskArguments.level,
      taskArguments.geography
    );

    console.log(`Group Statistics:`);
    console.log(`  Role: ${taskArguments.role}`);
    console.log(`  Level: ${taskArguments.level}`);
    console.log(`  Geography: ${taskArguments.geography}`);
    console.log(`  Total Submissions: ${count}`);

    if (count >= 10n) {
      console.log(`✅ Group has sufficient data for analytics (minimum 10 submissions)`);
    } else {
      console.log(`⚠️  Group needs ${10n - count} more submissions for privacy-preserving analytics`);
    }
  });

task("prism:insight", "Request personal insight")
  .addParam("contract", "The contract address")
  .addParam("metric", "Metric to compute (e.g., 'vs_median')")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers } = hre;
    const [signer] = await ethers.getSigners();

    const contract = await ethers.getContractAt("PrismLadderCompensation", taskArguments.contract);

    console.log(`Requesting personal insight '${taskArguments.metric}' for ${signer.address}...`);

    try {
      const tx = await contract.requestPersonalInsight(taskArguments.metric);
      const receipt = await tx.wait();

      console.log(`✅ Insight request submitted successfully`);
      console.log(`   Transaction: ${receipt?.hash}`);
      console.log(`   You can now decrypt the result using your FHEVM decryption signature`);
    } catch (error: any) {
      console.error(`❌ Failed to request insight:`, error.message);
    }
  });

task("prism:metadata", "Get user submission metadata")
  .addParam("contract", "The contract address")
  .addOptionalParam("user", "User address (defaults to current signer)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers } = hre;
    const [signer] = await ethers.getSigners();

    const userAddress = taskArguments.user || signer.address;
    const contract = await ethers.getContractAt("PrismLadderCompensation", taskArguments.contract);

    const metadata = await contract.getUserMetadata(userAddress);

    const roles = ["SoftwareEngineer", "ProductManager", "Designer", "Sales", "HR", "Executive", "Other"];
    const levels = ["Junior", "Mid", "Senior", "StaffPlus", "Manager", "Director", "VPExecutive"];
    const geographies = ["NorthAmerica", "Europe", "AsiaPacific", "LatinAmerica", "MiddleEastAfrica"];

    console.log(`User Metadata for ${userAddress}:`);
    console.log(`  Role: ${roles[metadata.role]} (${metadata.role})`);
    console.log(`  Level: ${levels[metadata.level]} (${metadata.level})`);
    console.log(`  Geography: ${geographies[metadata.geography]} (${metadata.geography})`);
    console.log(`  Timestamp: ${new Date(Number(metadata.timestamp) * 1000).toISOString()}`);
    console.log(`  Active: ${metadata.isActive}`);
  });

task("prism:delete", "Delete (soft) your submission")
  .addParam("contract", "The contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers } = hre;
    const [signer] = await ethers.getSigners();

    const contract = await ethers.getContractAt("PrismLadderCompensation", taskArguments.contract);

    console.log(`Deleting submission for ${signer.address}...`);

    try {
      const tx = await contract.deleteSubmission();
      const receipt = await tx.wait();

      console.log(`✅ Submission marked as inactive (soft delete)`);
      console.log(`   Transaction: ${receipt?.hash}`);
      console.log(`   Note: Data remains on-chain but excluded from analytics`);
    } catch (error: any) {
      console.error(`❌ Failed to delete:`, error.message);
    }
  });

