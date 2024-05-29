
import MyTest from "0xMyTest"
import MetadataViews from "0xMetadataViews"
import FungibleToken from "0xFungibleToken"



transaction(tokenID: UInt64, name: String, recipientAddress: Address, rate: UFix64) {
    let receiverCapability: Capability<&{FungibleToken.Vault}>

    prepare(acct: auth(BorrowValue) &Account) {
        // borrow a reference to the Admin resource in storage


        self.receiverCapability = getAccount(recipientAddress).capabilities.get<&{FungibleToken.Vault}>(MetadataViews.getRoyaltyReceiverPublicPath())
    }

    execute {
        let royalty: MetadataViews.Royalty =  MetadataViews.Royalty(receiver: self.receiverCapability, cut: rate, description: name) 
        
       MyTest.addRoyaltyForPFP(tokenID: tokenID, name: name, royalty: royalty, rate: rate)


    }
}
