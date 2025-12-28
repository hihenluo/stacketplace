// src/components/MintSection.tsx
import { request } from '@stacks/connect';
import { principalCV } from '@stacks/transactions';

export const MintSection = ({ stxAddress }: { stxAddress: string }) => {
  const handleMint = async () => {
    try {
      await request('stx_callContract', {
        contract: 'SP32YN03PMDGXQA9HYEZS2WBAT32AZKDJTBAPF4T.dedollz',
        functionName: 'mint',
        functionArgs: [principalCV(stxAddress)],
        network: 'mainnet',
        postConditionMode: 'allow',
      });
      alert("Minting transaction sent!");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 max-w-sm w-full shadow-2xl">
      <img 
        src="https://ipfs.io/ipfs/QmXtnT5CeDYMyxovYRcQuM6xb6cubt8JUKh1xcyiSPYMkQ/0.json" 
        alt="Preview" 
        className="rounded-2xl mb-6 w-full aspect-square object-cover"
      />
      <h3 className="text-2xl font-bold mb-4">Dedollz NFT</h3>
      <button 
        onClick={handleMint}
        className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black text-lg transition-transform active:scale-95 shadow-xl shadow-blue-900/20"
      >
        MINT NOW
      </button>
    </div>
  );
};