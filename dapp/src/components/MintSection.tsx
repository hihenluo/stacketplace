// src/components/MintSection.tsx
import { request } from '@stacks/connect';
import { principalCV } from '@stacks/transactions';

export const MintSection = ({ stxAddress }: { stxAddress: string }) => {
  const handleMint = async () => {
    await request('stx_callContract', {
      contract: 'SP32YN03PMDGXQA9HYEZS2WBAT32AZKDJTBAPF4T.dedollz',
      functionName: 'mint',
      functionArgs: [principalCV(stxAddress)],
      network: 'mainnet',
      postConditionMode: 'allow',
    });
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative bg-[#121421] p-10 rounded-[2.5rem] border border-white/10 max-w-sm w-full shadow-2xl">
        <img src="/0.png" alt="Dedollz Logo" className="rounded-3xl mb-8 w-full aspect-square object-cover shadow-2xl border border-white/5" />
        <h3 className="text-3xl font-black mb-2 text-center">MINT DOLLZ</h3>
        <p className="text-gray-500 text-sm text-center mb-8 uppercase tracking-widest font-bold">1,000 Limited Edition</p>
        <button onClick={handleMint} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-4 rounded-2xl font-black text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-blue-500/20">
          CONFIRM MINT
        </button>
      </div>
    </div>
  );
};