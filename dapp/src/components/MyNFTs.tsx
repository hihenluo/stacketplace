import { useState, useEffect } from 'react';

export const MyNFTs = ({ stxAddress }: { stxAddress: string }) => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyNFTs = async () => {
      try {
        // Use the assets/holdings endpoint to get CURRENT balance only
        const res = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${stxAddress}/assets/holdings?limit=50`);
        const data = await res.json();
        
        // Filter specifically for your contract and asset type
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
        Your Collection ({nfts.length})
      </h2>
      
      {nfts.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
           <p className="text-gray-500 font-bold uppercase text-xs">No Dollz found in this wallet.</p>
           <p className="text-[10px] text-gray-600 mt-2 italic">Note: Transactions might take a few minutes to index after minting.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {nfts.map((nft, i) => {
            // Extract the Token ID from the value.repr (e.g., "u10" -> "10")
            const tokenId = nft.value.repr.replace('u', '');
            
            return (
              <div key={i} className="bg-[#121421] border border-white/10 p-3 rounded-2xl hover:border-blue-500/50 transition-all group">
                <div className="relative aspect-square bg-black rounded-xl mb-3 overflow-hidden">
                  {/* Using the 0.png as placeholder or dynamically linking to IPFS */}
                  <img 
                    src={`https://ipfs.io/ipfs/QmXtnT5CeDYMyxovYRcQuM6xb6cubt8JUKh1xcyiSPYMkQ/${tokenId}.json`}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity"
                    alt={`Dollz ${tokenId}`}
                    onError={(e) => (e.currentTarget.src = "/0.png")} 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-blue-400 font-black text-xl">#{tokenId}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => alert(`Listing logic for ID ${tokenId} coming soon!`)}
                  className="w-full py-2.5 bg-blue-600/10 text-blue-400 rounded-lg text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all shadow-lg"
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