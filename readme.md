install flow-cli version 1

version v1.19.9

cd test/emulator

npm install

npx jest MyTest.test.js

should get an error on the final test

```

    Invalid Flow argument: [Error Code: 1101] error caused by: 1 error occurred:

    return MyTest.getRoyaltiesForPFP(tokenID: tokenID)

    error: capability created with invalid ID
        return self.royaltiesForSpecificPFP[tokenID] ?? {}


```
