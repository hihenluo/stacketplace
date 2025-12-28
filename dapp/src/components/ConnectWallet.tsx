import { showConnect, UserSession, AppConfig } from "@stacks/connect";

// Define the app configuration and session
const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

export const ConnectWallet = () => {
  const authenticate = () => {
    showConnect({
      appDetails: {
        name: "Dedollz NFT",
        icon: "/logo.png",
      },
      redirectTo: "/",
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  };

  const disconnect = () => {
    userSession.signUserOut();
    window.location.reload();
  };

  return (
    <div className="flex gap-4">
      {userSession.isUserSignedIn() ? (
        <button
          onClick={disconnect}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold transition"
        >
          Disconnect
        </button>
      ) : (
        <button
          onClick={authenticate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition"
        >
          Connect Hiro Wallet
        </button>
      )}
    </div>
  );
};