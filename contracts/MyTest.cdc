


// for tests
// import NonFungibleToken from "0xNonFungibleToken"
import MetadataViews from "0xMetadataViews"
// import ViewResolver from "0xViewResolver"




access(all)  contract MyTest {

    // -----------------------------------------------------------------------
    // MintPFPs contract Events
    // -----------------------------------------------------------------------

    // If a specific NFT requires their own royalties, 
    // the default royalties can be overwritten in this dictionary.
    access(all)  var royaltiesForSpecificPFP: {UInt64: {String: MetadataViews.Royalty}}

    access(all)  fun addRoyaltyForPFP(tokenID: UInt64, name: String, royalty: MetadataViews.Royalty, rate: UFix64){

            pre {
                rate > 0.0: "Cannot set rate to less than 0%"
                rate <= 1.0: "Cannot set rate to more than 100%"
            }

            if  MyTest.royaltiesForSpecificPFP.containsKey(tokenID) == false{

                let newEntry: {String: MetadataViews.Royalty}= {}
                newEntry.insert(key: name, royalty)
                MyTest.royaltiesForSpecificPFP!.insert(key: tokenID, newEntry)
                return
            }

            // the TokenID already has an entry

             if  MyTest.royaltiesForSpecificPFP[tokenID]!.containsKey(name) {
                 // the entry already exists
                 panic("The royalty with that name already exists")

             }
            MyTest.royaltiesForSpecificPFP[tokenID]!.insert(key: name, royalty)

            

        }

  

    // getRoyaltiesForPFP returns the specific royalties for a PFP or the default royalties
    access(all) view fun getRoyaltiesForPFP(tokenID: UInt64): {String: MetadataViews.Royalty} {
        return self.royaltiesForSpecificPFP[tokenID] ?? {}
    }

    //  getRoyaltyNamesForPFP returns the  royalty names for a specific PFP or the default royalty names
    access(all) view fun getRoyaltyNamesForPFP(tokenID: UInt64): [String] {
        return self.royaltiesForSpecificPFP[tokenID]?.keys ?? []
    }

    // getRoyaltyNamesForPFP returns a given royalty for a specific PFP or the default royalty names
    access(all) view fun getRoyaltyForPFP(tokenID: UInt64, name: String): MetadataViews.Royalty? {

        if  self.royaltiesForSpecificPFP.containsKey(tokenID){


         let royalties = self.getRoyaltiesForPFP(tokenID: tokenID)
         return royalties[name]
        

        
        }

        // if no specific royalty is set
        return nil
    }

    // getTotalRoyaltyRateForPFP returns the total royalty rate for a give PFP
    access(all) view fun getTotalRoyaltyRateForPFP(tokenID: UInt64): UFix64 {

       var totalRoyalty = 0.0
       let royalties = self.getRoyaltiesForPFP(tokenID: tokenID)
        for key in royalties.keys {
            let royal = royalties[key] ?? panic("Royalty does not exist")
            totalRoyalty = totalRoyalty + royal.cut
        }
        return totalRoyalty
    }

    



    // -----------------------------------------------------------------------
    // MintPFPs initialization function
    // -----------------------------------------------------------------------
    //
    init() {
        // Initialize contract fields
        self.royaltiesForSpecificPFP = {}
       
    }


}
    
