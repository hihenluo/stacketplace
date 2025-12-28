// src/App.tsx
import { useState, useEffect } from 'react';
import { connect, isConnected, disconnect, getLocalStorage } from '@stacks/connect';
import { MintSection } from './components/MintSection';
import { MarketCard } from './components/MarketCard';

function App() {
  const [stxAddress, setStxAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'mint' | 'market'>('mint');

  // Load address from local storage if already connected
  useEffect(() => {
    if (isConnected()) {
      const userData = getLocalStorage() as any;
      const addr = userData?.addresses?.stx?.[0]?.address || 
                   userData?.addresses?.find?.((a: any) => a.symbol === 'STX')?.address;
      if (addr) setStxAddress(addr);
    }
  }, []);

  const handleConnect = async () => {
    try {
      if (isConnected()) {
        disconnect();
        setStxAddress(null);
        return;
      }

      const response = await connect() as any;
      const addr = response?.addresses?.stx?.[0]?.address || 
                   response?.addresses?.find?.((a: any) => a.symbol === 'STX')?.address;
      
      if (addr) setStxAddress(addr);
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-800 p-4 flex justify-between items-center sticky top-0 bg-slate-950/90 backdrop-blur-sm z-50 px-6">
        <h1 className="text-2xl font-black text-blue-500 tracking-tighter uppercase">Dedollz</h1>
        <button 
          onClick={handleConnect}
          className="bg-blue-600 hover:bg-blue-500 text-sm py-2 px-6 rounded-full transition-all font-bold shadow-lg"
        >
          {stxAddress ? `${stxAddress.slice(0, 5)}...${stxAddress.slice(-4)}` : "Connect Wallet"}
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 text-center">
        {/* Tab Switcher */}
        <div className="flex justify-center gap-8 mb-12">
          <button 
            onClick={() => setActiveTab('mint')}
            className={`text-xl font-bold pb-2 ${activeTab === 'mint' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500'}`}
          >
            MINT
          </button>
          <button 
            onClick={() => setActiveTab('market')}
            className={`text-xl font-bold pb-2 ${activeTab === 'market' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500'}`}
          >
            MARKET
          </button>
        </div>

        {!stxAddress ? (
          <div className="py-20 bg-slate-900/50 rounded-3xl border border-slate-800">
            <h2 className="text-3xl font-bold mb-4">Welcome to Dedollz</h2>
            <p className="text-slate-400">Please connect your Stacks wallet to continue.</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'mint' ? (
              <div className="flex justify-center"><MintSection stxAddress={stxAddress} /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MarketCard listingId={0} tokenId={1} price={10} />
                <MarketCard listingId={1} tokenId={5} price={25} />
                <MarketCard listingId={2} tokenId={12} price={50} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;