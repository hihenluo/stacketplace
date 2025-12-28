// src/components/MarketCard.tsx
import { request } from '@stacks/connect';
import { uintCV, contractPrincipalCV } from '@stacks/transactions';

interface MarketCardProps {
  listingId: number;
  tokenId: number;
  price: number;
}

export const MarketCard = ({ listingId, tokenId, price }: MarketCardProps) => {
  const handleBuy = async () => {
    try {
      await request('stx_callContract', {
        contract: 'SP32YN03PMDGXQA9HYEZS2WBAT32AZKDJTBAPF4T.nft-marketplace',
        functionName: 'fulfil-listing-stx',
        functionArgs: [
          uintCV(listingId),
          contractPrincipalCV('SP32YN03PMDGXQA9HYEZS2WBAT32AZKDJTBAPF4T', 'dedollz')
        ],
        network: 'mainnet',
        postConditionMode: 'allow',
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-left hover:border-blue-500/50 transition-all group">
      <div className="bg-slate-950 aspect-square rounded-xl mb-4 flex items-center justify-center font-mono text-slate-700 group-hover:text-blue-500 transition-colors">
        DEDOLLZ #{tokenId}
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Price</p>
          <p className="text-xl font-black text-white">{price} STX</p>
        </div>
        <button 
          onClick={handleBuy}
          className="bg-white text-black px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-500 hover:text-white transition-all"
        >
          BUY
        </button>
      </div>
    </div>
  );
};