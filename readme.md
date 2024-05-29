install flow-cli version 1
version v1.19.9

cd test/emulator
npm install
npx jest MyTest.test.js

should get an error on the final test

```
	"message": "Invalid Flow argument: [Error Code: 1101] error caused by: 1 error occurred:\n\t* [Error Code: 1101] cadence runtime error: Execution failed:\n --\u003e 3690c6a2a363859174bf2933268993ab507c23cbf047e14bc5fa3eec5287d7d9:9:11\n  |\n9 |     return MyTest.getRoyaltiesForPFP(tokenID: tokenID)       \n  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n\nerror: capability created with invalid ID\n  --\u003e f3fcd2c1a78f5eee.MyTest:54:8\n   |\n54 |         return self.royaltiesForSpecificPFP[tokenID] ?? {}\n   |         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n\n\n"
    }
```
