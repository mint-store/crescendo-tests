
import MyTest from "0xMyTest"
import MetadataViews from "0xMetadataViews"


access(all) fun main(tokenID: UInt64, name: String): MetadataViews.Royalty? {

    return MyTest.getRoyaltyForPFP(tokenID: tokenID, name: name)       
}
