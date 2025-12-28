import React, { useState } from "react";
import { ConnectWallet, userSession } from "./components/ConnectWallet";
import { MintSection } from "./components/MintSection";
import { MarketCard } from "./components/MarketCard";

function App() {
  const [activeTab, setActiveTab] = useState<"mint" | "market">("mint");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <nav className="p-6 bg-white border-b flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-3xl font-black tracking-tighter text-blue-600">DEDOLLZ</h1>
        <ConnectWallet />
      </nav>

      {/* Hero Section */}
      <header className="py-12 px-4 text-center bg-gradient-to-b from-blue-50 to-gray-50">
        <h2 className="text-5xl font-extrabold mb-4">The Coolest Dollz on Stacks</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto italic">
          Total Supply: 1,000 | Contract: ...F4T
        </p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex justify-center gap-8 mb-12">
        <button 
          onClick={() => setActiveTab("mint")}
          className={`pb-2 px-4 text-lg font-bold ${activeTab === "mint" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-400"}`}
        >
          MINTING
        </button>
        <button 
          onClick={() => setActiveTab("market")}
          className={`pb-2 px-4 text-lg font-bold ${activeTab === "market" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-400"}`}
        >
          MARKETPLACE
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-20">
        {!userSession.isUserSignedIn() ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border">
            <h3 className="text-2xl font-bold">Please Connect Your Wallet</h3>
            <p className="mt-2 text-gray-500">Access the Dedollz ecosystem via Stacks Mainnet.</p>
          </div>
        ) : (
          <div>
            {activeTab === "mint" ? (
              <div className="flex justify-center">
                <MintSection />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Mock data for listing. In production, fetch this from Stacks API */}
                <MarketCard listingId={1} tokenId={10} price={25} />
                <MarketCard listingId={2} tokenId={45} price={50} />
                <MarketCard listingId={3} tokenId={88} price={100} />
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Screenshot Preview section as requested */}
      <section className="max-w-4xl mx-auto mb-20 p-4 border-2 border-dashed rounded-lg bg-gray-100">
          <p className="text-center text-gray-400 mb-2 font-mono uppercase text-sm">screenshot.png placeholder</p>
          <div className="h-64 flex items-center justify-center">
              <span className="text-gray-300 italic text-xl">The UI renders as a grid of high-fidelity NFT cards here</span>
          </div>
      </section>
    </div>
  );
}

export default App;