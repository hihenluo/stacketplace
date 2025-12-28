import { openContractCall } from "@stacks/connect";
import { principalCV } from "@stacks/transactions";
import { StacksMainnet } from "@stacks/network";
import { userSession } from "./ConnectWallet";

export const MintSection = () => {
  const CONTRACT_ADDRESS = "SP32YN03PMDGXQA9HYEZS2WBAT32AZKDJTBAPF4T";
  const CONTRACT_NAME = "dedollz";

  const handleMint = async () => {
    const userData = userSession.loadUserData();
    const recipient = userData.profile.stxAddress.mainnet;

    await openContractCall({
      network: new StacksMainnet(),
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "mint",
      functionArgs: [principalCV(recipient)],
      onFinish: (data) => {
        console.log("Tx ID:", data.txId);
        alert("Success! Minting is being processed.");
      },
    });
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border text-center">
      <img 
        src="https://ipfs.io/ipfs/QmXtnT5CeDYMyxovYRcQuM6xb6cubt8JUKh1xcyiSPYMkQ/0.json" 
        className="w-full aspect-square object-cover rounded-2xl mb-6 shadow-md"
        alt="Preview"
      />
      <h3 className="text-2xl font-bold mb-2">Claim Your Dedollz</h3>
      <p className="text-gray-500 mb-8">Each Dedollz is unique and stored on-chain.</p>
      <button 
        onClick={handleMint}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-xl transition-all active:scale-95"
      >
        MINT NOW
      </button>
    </div>
  );
};