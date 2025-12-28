import { useState, useEffect } from 'react';
import { connect, isConnected, disconnect, getLocalStorage } from '@stacks/connect';
import { MintSection } from './components/MintSection';
import { MarketCard } from './components/MarketCard';
import { MyNFTs } from './components/MyNFTs';

// Contract Constants
const MARKET_CONTRACT = "SP32YN03PMDGXQA9HYEZS2WBAT32AZKDJTBAPF4T.nft-marketplace";

function App() {
  const [stxAddress, setStxAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'mint' | 'market' | 'profile'>('mint');
  const [listings, setListings] = useState<any[]>([]);
  const [loadingMarket, setLoadingMarket] = useState(false);

  // 1. Authenticate user session
  useEffect(() => {
    if (isConnected()) {
      const userData = getLocalStorage() as any;
      const addr = userData?.addresses?.stx?.[0]?.address || 
                   userData?.addresses?.find?.((a: any) => a.symbol === 'STX')?.address;
      if (addr) setStxAddress(addr);
    }
  }, []);

  // 2. Fetch Active Listings from Blockchain API
  useEffect(() => {
    const fetchMarketplaceData = async () => {
      if (activeTab === 'market') {
        setLoadingMarket(true);
        try {
          // Fetch contract events to find listing IDs
          const res = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${MARKET_CONTRACT.split('.')[0]}/operations?limit=50`);
          const data = await res.json();
          
          /** * Note: To get actual MAP data without a backend, 
           * we usually fetch the 'listing-nonce' first, then loop or 
           * fetch recent successful 'list-asset' transaction events.
           */
          
          // For now, let's fetch the last 10 possible listings (simulated logic for real data)
          // In a full production app, you'd use a dedicated Indexer (like Tokenloft or Gamma API)
          setListings([]); // Clear dummy data
          
          // logic filter listing asli akan masuk ke sini
        } catch (e) {
          console.error("Error fetching market data:", e);
        } finally {
          setLoadingMarket(false);
        }
      }
    };
    fetchMarketplaceData();
  }, [activeTab]);

  const handleConnect = async () => {
    if (isConnected()) {
      disconnect();
      setStxAddress(null);
      return;
    }
    const response = await connect() as any;
    const addr = response?.addresses?.stx?.[0]?.address;
    if (addr) setStxAddress(addr);
  };

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white font-sans">
      <nav className="border-b border-white/5 p-4 flex justify-between items-center sticky top-0 bg-[#0a0b14]/80 backdrop-blur-xl z-50 px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-xl flex items-center justify-center font-black shadow-lg shadow-blue-500/20">D</div>
          <h1 className="text-xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">Dedollz</h1>
        </div>
        
        <button onClick={handleConnect} className="bg-white text-black hover:bg-blue-500 hover:text-white text-xs py-2.5 px-6 rounded-full transition-all font-bold tracking-tighter uppercase shadow-xl">
          {stxAddress ? `${stxAddress.slice(0, 4)}...${stxAddress.slice(-4)}` : "Connect Wallet"}
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-center gap-2 mb-16 p-1.5 bg-white/5 rounded-2xl w-fit mx-auto border border-white/10">
          {['mint', 'market', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
                activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
              }`}
            >
              {tab === 'profile' ? 'My Dollz' : tab}
            </button>
          ))}
        </div>

        {!stxAddress ? (
          <div className="py-32 text-center animate-pulse">
            <h2 className="text-4xl font-black mb-4">Awaiting Connection...</h2>
            <p className="text-gray-500 uppercase tracking-[0.2em] text-sm">Connect wallet to explore Dedollz</p>
          </div>
        ) : (
          <div className="transition-all duration-700">
            {activeTab === 'mint' && <div className="flex justify-center"><MintSection stxAddress={stxAddress} /></div>}
            
            {activeTab === 'market' && (
              <div>
                {loadingMarket ? (
                  <p className="text-center py-20 text-gray-500 animate-bounce uppercase text-xs font-bold tracking-widest">Fetching Active Listings...</p>
                ) : listings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {listings.map((item, idx) => (
                      <MarketCard key={idx} listingId={item.id} tokenId={item.tokenId} price={item.price} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                    <p className="text-gray-500 font-bold uppercase text-xs">No active listings found in marketplace.</p>
                    <p className="text-[10px] text-gray-600 mt-2 italic">Be the first to list your Dollz!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && <MyNFTs stxAddress={stxAddress} />}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;