import { useState, useEffect } from 'react';
import { request } from '@stacks/connect';
import { 
  uintCV, 
  contractPrincipalCV, 
  noneCV, 
  tupleCV 
} from '@stacks/transactions';

export const MyNFTs = ({ stxAddress }: { stxAddress: string }) => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to list an NFT for sale on the marketplace
  const handleListNFT = async (tokenId: number) => {
    const priceInStx = prompt("Enter listing price in STX (e.g., 10):", "10");
    
    if (!priceInStx || isNaN(Number(priceInStx))) {
      alert("Invalid price entered.");
      return;
    }

    // Convert STX to micro-STX (1 STX = 1,000,000 uSTX)
    const priceInMicroStx = Math.floor(Number(priceInStx) * 1000000);

    try {
      await request('stx_callContract', {
        contract: 'SP32YN03PMDGXQA9HYEZS2WBAT32AZKDJTBAPF4T.nft-marketplace',
        functionName: 'list-asset',
        functionArgs: [
          // Argument 1: The NFT trait (contract principal)
          contractPrincipalCV('SP32YN03PMDGXQA9HYEZS2WBAT32AZKDJTBAPF4T', 'dedollz'),
          // Argument 2: The NFT asset details as a Tuple
          tupleCV({
            'taker': noneCV(), // Optional: anyone can buy
            'token-id': uintCV(tokenId),
            'expiry': uintCV(10000000), // High block height so it doesn't expire quickly
            'price': uintCV(priceInMicroStx),
            'payment-asset-contract': noneCV() // Optional: paying with STX
          })
        ],
        network: 'mainnet',
        postConditionMode: 'allow', // Allows the contract to take the NFT from your wallet
      });
      alert("Congrast Listing Succes! Your NFT will move to escrow once confirmed.");
    } catch (e) {
      console.error("Listing failed:", e);
      alert("Listing failed. Check console for details.");
    }
  };

  useEffect(() => {
    const fetchMyNFTs = async () => {
      try {
        const res = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${stxAddress}/assets/holdings?limit=50`);
        const data = await res.json();
        
        const myDollz = data.results.filter((item: any) => 
          item.asset_type === "non_fungible_token" && 
          item.asset_identifier.includes("SP32YN03PMDGXQA9HYEZS2WBAT32AZKDJTBAPF4T.dedollz")
        );
        
        setNfts(myDollz);
      } catch (e) {
        console.error("Failed to fetch personal NFTs", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMyNFTs();
  }, [stxAddress]);

  if (loading) return <div className="text-gray-500 animate-pulse font-mono uppercase tracking-widest p-10">Scanning blockchain holdings...</div>;

  return (
    <div className="animate-in fade-in duration-700">
      <h2 className="text-left text-2xl font-black mb-8 border-l-4 border-blue-600 pl-4 uppercase tracking-tighter">
        My Dollz Collection ({nfts.length})
      </h2>
      
      {nfts.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
           <p className="text-gray-500 font-bold uppercase text-xs">No Dollz found in this wallet.</p>
           <p className="text-[10px] text-gray-600 mt-2 italic text-center">Note: New mints may take a few minutes to appear.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {nfts.map((nft, i) => {
            const tokenId = parseInt(nft.value.repr.replace('u', ''));
            
            return (
              <div key={i} className="bg-[#121421] border border-white/10 p-3 rounded-2xl hover:border-blue-500/50 transition-all group">
                <div className="relative aspect-square bg-black rounded-xl mb-3 overflow-hidden border border-white/5">
                  <img 
                    src="/0.png"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-500"
                    alt={`Dollz ${tokenId}`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-white font-black text-2xl drop-shadow-lg italic">#{tokenId}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleListNFT(tokenId)}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-[10px] font-black uppercase hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg active:scale-95"
                >
                  List for Sale
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
