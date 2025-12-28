import { openContractCall } from "@stacks/connect";
import { uintCV, contractPrincipalCV } from "@stacks/transactions";
import { StacksMainnet } from "@stacks/network";

interface MarketCardProps {
  listingId: number;
  tokenId: number;
  price: number;
}

export const MarketCard = ({ listingId, tokenId, price }: MarketCardProps) => {
  const MARKET_ADDRESS = "SP32YN03PMDGXQA9HYEZS2WBAT32AZKDJTBAPF4T";
  const MARKET_NAME = "nft-marketplace";
  const NFT_CONTRACT_ADDRESS = "SP32YN03PMDGXQA9HYEZS2WBAT32AZKDJTBAPF4T";

  const handleBuy = async () => {
    await openContractCall({
      network: new StacksMainnet(),
      contractAddress: MARKET_ADDRESS,
      contractName: MARKET_NAME,
      functionName: "fulfil-listing-stx",
      functionArgs: [
        uintCV(listingId),
        contractPrincipalCV(NFT_CONTRACT_ADDRESS, "dedollz")
      ],
      onFinish: (data) => alert("Buying transaction broadcasted! Tx: " + data.txId),
    });
  };

  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition">
      <div className="bg-gray-100 rounded-xl aspect-square mb-4 flex items-center justify-center font-bold text-gray-400">
        Dedollz #{tokenId}
      </div>
      <div className="flex justify-between items-end">
        <div>
          <span className="text-sm text-gray-400 block uppercase">Price</span>
          <span className="text-xl font-black text-gray-800">{price} STX</span>
        </div>
        <button 
          onClick={handleBuy}
          className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition"
        >
          BUY
        </button>
      </div>
    </div>
  );
};