
import MyTest from "0xPickem"
import MetadataViews from "0xMetadataViews"



access(all) fun main(tokenID: UInt64): {String: MetadataViews.Royalty} {

    return MyTest.getRoyaltiesForPFP(tokenID: tokenID)       
}
