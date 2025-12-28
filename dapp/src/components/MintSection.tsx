import { openContractCall } from "@stacks/connect";
import { principalCV } from "@stacks/transactions";
import { STACKS_MAINNET } from "@stacks/network"; // Fixed: Using STACKS_MAINNET constant
import { userSession } from "./ConnectWallet";

export const MintSection = () => {
  // Set your specific contract details
  const CONTRACT_ADDRESS = "SP32YN03PMDGXQA9HYEZS2WBAT32AZKDJTBAPF4T";
  const CONTRACT_NAME = "dedollz";

  const handleMint = async () => {
    // Check if the user is signed in before proceeding
    if (!userSession.isUserSignedIn()) {
      alert("Please connect your wallet first!");
      return;
    }

    const userData = userSession.loadUserData();
    const recipient = userData.profile.stxAddress.mainnet;

    await openContractCall({
      // Fixed: Passing the network constant directly
      network: STACKS_MAINNET, 
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "mint",
      functionArgs: [principalCV(recipient)],
      onFinish: (data) => {
        console.log("Transaction ID:", data.txId);
        alert("Minting transaction broadcasted successfully!");
      },
      onCancel: () => {
        console.log("User cancelled the minting process.");
      }
    });
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border text-center">
      {/* Visual preview of the NFT from your IPFS metadata */}
      <img 
        src="https://ipfs.io/ipfs/QmXtnT5CeDYMyxovYRcQuM6xb6cubt8JUKh1xcyiSPYMkQ/0.json" 
        className="w-full aspect-square object-cover rounded-2xl mb-6 shadow-md"
        alt="Dedollz Preview"
      />
      <h3 className="text-2xl font-bold mb-2 text-gray-800">Claim Your Dedollz</h3>
      <p className="text-gray-500 mb-8">Each Dedollz is unique and stored on-chain via Stacks.</p>
      
      <button 
        onClick={handleMint}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-xl transition-all active:scale-95 shadow-lg shadow-blue-200"
      >
        MINT NOW
      </button>
      
      <div className="mt-4 text-xs text-gray-400 font-mono">
        Network: Mainnet | Fee: ~Standard STX
      </div>
    </div>
  );
};