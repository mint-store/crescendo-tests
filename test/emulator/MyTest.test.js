const templatedContractName = "MyTest";
import * as t from "@onflow/types";

import { extractEventType } from "./utils";

import {
  getTransactionCode,
  init,
  emulator,
  sendTransaction,
  getAccountAddress,
  getScriptCode,
  executeScript,
  deployContractByName,
} from "@onflow/flow-js-testing";

let FungibleTokenContractAddress,
  MetadataViewContractAddress,
  MintPFPsContractAddress,
  Alice,
  Bob,
  Charlie,
  getRoyaltiesForPFPScriptCode,
  getRoyaltyNamesForPFPScriptCode,
  getRoyaltyForPFPScriptCode,
  getTotalRoyaltyRateForPFPScriptCode,
  setRoyaltyForPFPTransactionCode;

import path from "path";

const basePath = path.resolve(__dirname, "../../.");

jest.setTimeout(10000);

describe(`${templatedContractName} tests`, () => {
  beforeAll(async () => {
    const port = 8080;
    const logging = true;

    await init(basePath, { port });
    await emulator.start(port, logging);

    return emulator;
  });

  beforeAll(async () => {
    FungibleTokenContractAddress = "0xee82856bf20e2aa6";

    MetadataViewContractAddress = await getAccountAddress(
      "MetadataViewContractAddress"
    );
    MintPFPsContractAddress = await getAccountAddress(
      `${templatedContractName}ContractAddress`
    );
    expect(MetadataViewContractAddress).toBeTruthy();
    Alice = await getAccountAddress("Alice");
    Bob = await getAccountAddress("Bob");
    Charlie = await getAccountAddress("Charlie");

    expect(Alice).toBeTruthy();
    expect(Bob).toBeTruthy();
    expect(Charlie).toBeTruthy();
  });

  // Stop emulator, so it could be restarted
  afterAll(async () => {
    return emulator.stop();
  });

  describe("Deploy Contracts Tests", () => {
    test("Deploy MetadataViewsAddress contract", async () => {
      const [MetadataViewsContract] = await deployContractByName({
        to: MetadataViewContractAddress,
        name: "MetadataViews",
        addressMap: {},
      });
      const eventsType = extractEventType(MetadataViewsContract.events);
      expect(eventsType).toContain("AccountContractAdded");
      expect(eventsType).toContain("AccountAdded");
    });

    test(`Deploy templated ${templatedContractName} contract`, async () => {
      const [MintPFPsContract, error] = await deployContractByName({
        to: MintPFPsContractAddress,
        name: templatedContractName,
        addressMap: {
          MetadataViews: MetadataViewContractAddress,
        },
      });

      console.log("error: ", error);

      const eventsType = extractEventType(MintPFPsContract.events);
      expect(eventsType).toContain("AccountContractAdded");
      expect(eventsType).toContain("AccountAdded");
    });
  });

  // return;

  describe(`${templatedContractName} Scripts Tests`, () => {
    const generateScriptCode = (name) => {
      return getScriptCode({
        name,
        addressMap: {
          MintPFPs: MintPFPsContractAddress,
        },
      });
    };

    test("Get default royalties for PFP script code", async () => {
      getRoyaltiesForPFPScriptCode = await generateScriptCode(
        `${templatedContractName}/get_royaltiesForPFP`
      );

      expect(getRoyaltiesForPFPScriptCode).toBeTruthy();
    });

    test("Get royalty names for PFP script code", async () => {
      getRoyaltyNamesForPFPScriptCode = await generateScriptCode(
        `${templatedContractName}/get_royaltyNamesForPFP`
      );

      expect(getRoyaltyNamesForPFPScriptCode).toBeTruthy();
    });

    test("Get royalty for PFP script code", async () => {
      getRoyaltyForPFPScriptCode = await generateScriptCode(
        `${templatedContractName}/get_royaltyForPFP`
      );

      expect(getRoyaltyForPFPScriptCode).toBeTruthy();
    });

    // test("Get royalty rate for PFP script code", async () => {
    //   getTotalRoyaltyRateForPFPScriptCode = await generateScriptCode(
    //     `${templatedContractName}/get_totalRoyaltyRateForPFP`
    //   );

    //   expect(getTotalRoyaltyRateForPFPScriptCode).toBeTruthy();
    // });
  });

  describe(`${templatedContractName} Transactions Tests`, () => {
    const generateTransactionCode = (name) => {
      return getTransactionCode({
        name: `${templatedContractName}/${name}`,
        addressMap: {
          MetadataViews: MetadataViewContractAddress,
          MintPFPs: MintPFPsContractAddress,
        },
      });
    };

    test("Set Royalty for PFP code", async () => {
      setRoyaltyForPFPTransactionCode = await generateTransactionCode(
        "set_royalty_for_PFP"
      );

      expect(setRoyaltyForPFPTransactionCode).toBeTruthy();
    });
  });

  describe(`${templatedContractName} Royalties Tests`, () => {
    let defaultRoyalties, specificRoyalties, Addresses;
    const tokenIDToTest = 1;

    beforeAll(() => {
      specificRoyalties = [
        {
          tokenID: 1,
          name: "Charlie",
          recipientAddress: Charlie,
          rate: "0.74",
          updatedRate: "0.123412",
        },
        {
          tokenID: 2,
          name: "Alice",
          recipientAddress: Alice,
          rate: "0.121",
          updatedRate: "0.9923412",
        },
      ];

      Addresses = {
        Alice,
        Bob,
        Charlie,
        MintPFPsContractAddress,
      };
    });

    describe("PFP Royalties", () => {
      test("Should be able to read the royalties specific to PFP", async () => {
        const [royalties, error] = await executeScript({
          code: getRoyaltiesForPFPScriptCode,
          args: [[tokenIDToTest, t.UInt64]],
        });

        console.log("royalties: ", royalties);
        console.log("error: ", error);

        expect(Object.keys(royalties).length).toBe(0);

        // for (let { name, recipientAddress, rate } of defaultRoyalties) {
        //   const royalty = royalties[name];
        //   expect(royalty.receiver.address).toBe(recipientAddress);
        //   expect(parseFloat(royalty.cut)).toBe(parseFloat(rate));
        // }
      });
    });

    // describe("NFT Specific Royalties", () => {
    //   test("Should be able to read the royalty names", async () => {
    //     const [royaltyNames] = await executeScript({
    //       code: getRoyaltyNamesForPFPScriptCode,
    //       args: [[tokenIDToTest, t.UInt64]],
    //     });

    //     for (let royalty of defaultRoyalties) {
    //       expect(royaltyNames.indexOf(royalty.name)).not.toBe(-1);
    //     }
    //   });
    // });

    describe("Specific PFP Royalties", () => {
      //   test("Should be able to read the total royalty rate for the specific PFP", async () => {
      //     let expectedTotal = 0.0;
      //     for (let royalty of defaultRoyalties) {
      //       expectedTotal += parseFloat(royalty.rate);
      //     }

      //     const [totalRoyaltyRate] = await executeScript({
      //       code: getTotalRoyaltyRateForPFPScriptCode,
      //       args: [[tokenIDToTest, t.UInt64]],
      //     });

      //     expect(parseFloat(totalRoyaltyRate)).toBe(expectedTotal);
      //   });

      test("Set royalty rate for specific NFT", async () => {
        for (let royalty of specificRoyalties) {
          let args = [
            [royalty.tokenID, t.UInt64],
            [royalty.name, t.String],
            [Addresses[royalty.name], t.Address],
            [royalty.rate, t.UFix64],
          ];
          const [tra, error] = await sendTransaction({
            code: setRoyaltyForPFPTransactionCode,
            signers: [Addresses.MintPFPsContractAddress],
            args,
          });

          console.log("error: ", error);

          // Transaction's error message should be null
          expect(error).not.toBeTruthy();
        }
      });

      test("Should be able to read the royalty names with updated values", async () => {
        for (let royalty of specificRoyalties) {
          const [royaltyNames, error] = await executeScript({
            code: getRoyaltyNamesForPFPScriptCode,
            args: [[royalty.tokenID, t.UInt64]],
          });
          console.log("royaltyNames: ", royaltyNames);

          console.log("royalty.tokenID: ", royalty.tokenID);
          console.log("royalty.name: ", royalty.name);
          console.log("error: ", error);

          expect(royaltyNames.length).toBe(1);
          expect(royaltyNames.indexOf(royalty.name)).not.toBe(-1);
        }
      });

      test("Should be able to read the royalties specific to PFP", async () => {
        const [royalties, error] = await executeScript({
          code: getRoyaltiesForPFPScriptCode,
          args: [[tokenIDToTest, t.UInt64]],
        });

        console.log("tokenIDToTest: ", tokenIDToTest);
        console.log("royalties: ", royalties);
        console.log("error: ", error);
        expect(error).not.toBeTruthy();

        for (let { name, recipientAddress, rate } of defaultRoyalties) {
          const royalty = royalties[name];
          expect(royalty.receiver.address).toBe(recipientAddress);
          expect(parseFloat(royalty.cut)).toBe(parseFloat(rate));
        }
      });

      //   return;
    });
  });
});
