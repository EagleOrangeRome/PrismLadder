import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { PrismLadderCompensation } from "../types";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
  carol: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = await ethers.getContractFactory("PrismLadderCompensation");
  const contract = await factory.deploy() as unknown as PrismLadderCompensation;
  const contractAddress = await contract.getAddress();

  return { contract, contractAddress };
}

describe("PrismLadderCompensation", function () {
  let signers: Signers;
  let contract: PrismLadderCompensation;
  let contractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = {
      deployer: ethSigners[0],
      alice: ethSigners[1],
      bob: ethSigners[2],
      carol: ethSigners[3],
    };
  });

  beforeEach(async function () {
    // Check whether the tests are running against an FHEVM mock environment
    if (!fhevm.isMock) {
      console.warn(`This test suite can only run on Hardhat mock FHEVM`);
      this.skip();
    }

    ({ contract, contractAddress } = await deployFixture());
  });

  describe("Deployment", function () {
    it("should deploy successfully", async function () {
      expect(contractAddress).to.be.properAddress;
    });

    it("should have correct constants", async function () {
      expect(await contract.MIN_GROUP_SIZE()).to.equal(1n); // Updated from 10 to 1
      expect(await contract.FAIRNESS_THRESHOLD_PERCENT()).to.equal(10n);
    });
  });

  describe("Compensation Submission", function () {
    it("should allow Alice to submit compensation", async function () {
      const baseSalary = 120000;
      const bonus = 20000;
      const equity = 50000;

      // Create encrypted input
      const input = await fhevm.createEncryptedInput(contractAddress, signers.alice.address);
      input.add64(baseSalary);
      input.add64(bonus);
      input.add64(equity);
      const encryptedInputs = await input.encrypt();

      // Submit
      const tx = await contract.connect(signers.alice).submitCompensation(
        encryptedInputs.handles[0],
        encryptedInputs.handles[1],
        encryptedInputs.handles[2],
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        0, // SoftwareEngineer
        2, // Senior
        0  // NorthAmerica
      );

      await expect(tx).to.emit(contract, "CompensationSubmitted");
    });

    it("should store submission metadata correctly", async function () {
      const baseSalary = 120000;
      const bonus = 20000;
      const equity = 50000;

      const input = await fhevm.createEncryptedInput(contractAddress, signers.alice.address);
      input.add64(baseSalary);
      input.add64(bonus);
      input.add64(equity);
      const encryptedInputs = await input.encrypt();

      await contract.connect(signers.alice).submitCompensation(
        encryptedInputs.handles[0],
        encryptedInputs.handles[1],
        encryptedInputs.handles[2],
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        0, // SoftwareEngineer
        2, // Senior
        0  // NorthAmerica
      );

      const metadata = await contract.getUserMetadata(signers.alice.address);
      
      expect(metadata.role).to.equal(0); // SoftwareEngineer
      expect(metadata.level).to.equal(2); // Senior
      expect(metadata.geography).to.equal(0); // NorthAmerica
      expect(metadata.isActive).to.equal(true);
      expect(metadata.timestamp).to.be.gt(0);
    });

    it("should update group statistics", async function () {
      const baseSalary = 120000;
      const bonus = 20000;
      const equity = 50000;

      const input = await fhevm.createEncryptedInput(contractAddress, signers.alice.address);
      input.add64(baseSalary);
      input.add64(bonus);
      input.add64(equity);
      const encryptedInputs = await input.encrypt();

      await contract.connect(signers.alice).submitCompensation(
        encryptedInputs.handles[0],
        encryptedInputs.handles[1],
        encryptedInputs.handles[2],
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        0, 2, 0
      );

      const count = await contract.getGroupCount(0, 2, 0); // SoftwareEngineer, Senior, NorthAmerica
      expect(count).to.equal(1);
    });

    it("should allow submission update (overwrite)", async function () {
      // First submission
      let input = await fhevm.createEncryptedInput(contractAddress, signers.alice.address);
      input.add64(120000);
      input.add64(20000);
      input.add64(50000);
      let encryptedInputs = await input.encrypt();

      await contract.connect(signers.alice).submitCompensation(
        encryptedInputs.handles[0],
        encryptedInputs.handles[1],
        encryptedInputs.handles[2],
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        0, 2, 0
      );

      // Second submission (update)
      input = await fhevm.createEncryptedInput(contractAddress, signers.alice.address);
      input.add64(130000);
      input.add64(25000);
      input.add64(60000);
      encryptedInputs = await input.encrypt();

      await contract.connect(signers.alice).submitCompensation(
        encryptedInputs.handles[0],
        encryptedInputs.handles[1],
        encryptedInputs.handles[2],
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        0, 2, 0
      );

      // Metadata should still show isActive and updated timestamp
      const metadata = await contract.getUserMetadata(signers.alice.address);
      expect(metadata.isActive).to.equal(true);
    });
  });

  describe("Multiple Submissions", function () {
    it("should allow Bob to submit compensation", async function () {
      const input = await fhevm.createEncryptedInput(contractAddress, signers.bob.address);
      input.add64(115000);
      input.add64(18000);
      input.add64(45000);
      const encryptedInputs = await input.encrypt();

      await contract.connect(signers.bob).submitCompensation(
        encryptedInputs.handles[0],
        encryptedInputs.handles[1],
        encryptedInputs.handles[2],
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        0, 2, 0
      );

      const count = await contract.getGroupCount(0, 2, 0);
      expect(count).to.be.gte(1);
    });

    it("should allow Carol to submit compensation in different group", async function () {
      const input = await fhevm.createEncryptedInput(contractAddress, signers.carol.address);
      input.add64(95000);
      input.add64(12000);
      input.add64(30000);
      const encryptedInputs = await input.encrypt();

      await contract.connect(signers.carol).submitCompensation(
        encryptedInputs.handles[0],
        encryptedInputs.handles[1],
        encryptedInputs.handles[2],
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        0, // SoftwareEngineer
        1, // Mid
        0  // NorthAmerica
      );

      const count = await contract.getGroupCount(0, 1, 0);
      expect(count).to.equal(1);
    });
  });

  describe("Personal Insights", function () {
    beforeEach(async function () {
      // Submit Alice's compensation first
      const input = await fhevm.createEncryptedInput(contractAddress, signers.alice.address);
      input.add64(120000);
      input.add64(20000);
      input.add64(50000);
      const encryptedInputs = await input.encrypt();

      await contract.connect(signers.alice).submitCompensation(
        encryptedInputs.handles[0],
        encryptedInputs.handles[1],
        encryptedInputs.handles[2],
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        0, 2, 0
      );
    });

    it.skip("should fail for insufficient group size (N/A - MIN_GROUP_SIZE is 1)", async function () {
      // NOTE: This test is no longer applicable since MIN_GROUP_SIZE was changed to 1
      // Alice is the only one in her group, which now meets the minimum requirement
      await expect(
        contract.connect(signers.alice).requestPersonalInsight("vs_median")
      ).to.be.revertedWith("Insufficient group data");
    });

    it("should fail for user without submission", async function () {
      await expect(
        contract.connect(signers.bob).requestPersonalInsight("vs_median")
      ).to.be.revertedWith("No active submission found");
    });
  });

  describe("Deletion (GDPR)", function () {
    beforeEach(async function () {
      // Submit Alice's compensation first
      const input = await fhevm.createEncryptedInput(contractAddress, signers.alice.address);
      input.add64(120000);
      input.add64(20000);
      input.add64(50000);
      const encryptedInputs = await input.encrypt();

      await contract.connect(signers.alice).submitCompensation(
        encryptedInputs.handles[0],
        encryptedInputs.handles[1],
        encryptedInputs.handles[2],
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        encryptedInputs.inputProof,
        0, 2, 0
      );
    });

    it("should allow user to delete their submission", async function () {
      await contract.connect(signers.alice).deleteSubmission();

      const metadata = await contract.getUserMetadata(signers.alice.address);
      expect(metadata.isActive).to.equal(false);
    });

    it("should fail when deleting already deleted submission", async function () {
      await contract.connect(signers.alice).deleteSubmission();
      
      await expect(
        contract.connect(signers.alice).deleteSubmission()
      ).to.be.revertedWith("No active submission");
    });

    it("should prevent insights request after deletion", async function () {
      await contract.connect(signers.alice).deleteSubmission();
      
      await expect(
        contract.connect(signers.alice).requestPersonalInsight("vs_median")
      ).to.be.revertedWith("No active submission found");
    });
  });

  describe("Group Count Checks", function () {
    it("should return correct group counts", async function () {
      // Initially, all groups should have 0 count
      const initialCount = await contract.getGroupCount(0, 2, 0);
      expect(initialCount).to.equal(0);
    });
  });
});
