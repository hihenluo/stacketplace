// src/components/MyNFTs.tsx
import { useState, useEffect } from 'react';

export const MyNFTs = ({ stxAddress }: { stxAddress: string }) => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyNFTs = async () => {
      try {
        const res = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${stxAddress}/nft_events?limit=50`);
        const data = await res.json();
        // Filter only Dedollz contract
        const myDollz = data.nft_events.filter((e: any) => e.asset_id.includes('dedollz'));
        setNfts(myDollz);
      } catch (e) {
        console.error("Failed to fetch personal NFTs", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMyNFTs();
  }, [stxAddress]);

  if (loading) return <div className="text-gray-500 animate-pulse font-mono uppercase tracking-widest">Scanning blockchain...</div>;

  return (
    <div>
      <h2 className="text-left text-2xl font-black mb-8 border-l-4 border-blue-600 pl-4 uppercase tracking-tighter">Your Collection ({nfts.length})</h2>
      {nfts.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
           <p className="text-gray-500 font-bold uppercase text-xs">No Dollz found in this wallet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {nfts.map((nft, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-2xl hover:bg-white/10 transition-all">
              <div className="aspect-square bg-black rounded-xl mb-3 flex items-center justify-center text-[10px] text-blue-400 font-bold uppercase">
                Dollz #{nft.value.repr.replace('u', '')}
              </div>
              <button className="w-full py-2 bg-white/10 rounded-lg text-[10px] font-black uppercase hover:bg-white/20 transition-all">
                List for Sale
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};