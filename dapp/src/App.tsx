// src/App.tsx
import { useState, useEffect } from 'react';
import { connect, isConnected, disconnect, getLocalStorage } from '@stacks/connect';
import { MintSection } from './components/MintSection';
import { MarketCard } from './components/MarketCard';
import { MyNFTs } from './components/MyNFTs';

// Contract address for the Marketplace
const MARKET_CONTRACT = "SP32YN03PMDGXQA9HYEZS2WBAT32AZKDJTBAPF4T.nft-marketplace";

function App() {
  const [stxAddress, setStxAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'mint' | 'market' | 'profile'>('mint');
  const [listings, setListings] = useState<any[]>([]);
  const [loadingMarket, setLoadingMarket] = useState(false);

  // 1. Check wallet connection on load
  useEffect(() => {
    if (isConnected()) {
      const userData = getLocalStorage() as any;
      const addr = userData?.addresses?.stx?.[0]?.address || 
                   userData?.addresses?.find?.((a: any) => a.symbol === 'STX')?.address;
      if (addr) setStxAddress(addr);
    }
  }, []);

  // 2. Fetch real listing data from Stacks API
  useEffect(() => {
    const fetchMarketplaceData = async () => {
      if (activeTab === 'market') {
        setLoadingMarket(true);
        try {
          const res = await fetch(
            `https://api.mainnet.hiro.so/extended/v1/address/${MARKET_CONTRACT.split('.')[0]}/operations?limit=50`
          );
          const data = await res.json();

          // Filter successful 'list-asset' transactions to show real listings
          const activeListings = data.results
            .filter((op: any) => 
              op.tx_status === "success" && 
              op.contract_call?.function_name === "list-asset"
            )
            .map((op: any, index: number) => {
              // Extracting data from contract call arguments to avoid "unused variable" error
              const args = op.contract_call.function_args;
              const nftAssetArg = args?.find((a: any) => a.name === "nft-asset");
              
              // Regex to find token ID and price from the Clarity representation string
              const tokenId = nftAssetArg?.repr?.match(/token-id u(\d+)/)?.[1] || "0";
              const price = nftAssetArg?.repr?.match(/price u(\d+)/)?.[1] || "0";

              return {
                id: index, // Temporary listing index
                tokenId: parseInt(tokenId),
                price: parseInt(price) / 1000000 // Convert micro-STX to STX
              };
            });

          setListings(activeListings);
          console.log("Found", activeListings.length, "valid listings from API.");
        } catch (e) {
          console.error("Error fetching market data:", e);
        } finally {
          setLoadingMarket(false);
        }
      }
    };
    fetchMarketplaceData();
  }, [activeTab]);

  // 3. Wallet Connect/Disconnect logic
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
      {/* Navbar Section */}
      <nav className="border-b border-white/5 p-4 flex justify-between items-center sticky top-0 bg-[#0a0b14]/80 backdrop-blur-xl z-50 px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-xl flex items-center justify-center font-black shadow-lg shadow-blue-500/20">D</div>
          <h1 className="text-xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 font-mono">Dedollz</h1>
        </div>
        
        <button onClick={handleConnect} className="bg-white text-black hover:bg-blue-500 hover:text-white text-xs py-2.5 px-6 rounded-full transition-all font-bold tracking-tighter uppercase shadow-xl">
          {stxAddress ? `${stxAddress.slice(0, 4)}...${stxAddress.slice(-4)}` : "Connect Wallet"}
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Navigation Tabs */}
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

        {/* Conditional Rendering based on Connection and Tab */}
        {!stxAddress ? (
          <div className="py-32 text-center">
            <h2 className="text-4xl font-black mb-4 tracking-tighter">UNAUTHORIZED ACCESS</h2>
            <p className="text-blue-500 uppercase tracking-[0.3em] text-[10px] font-bold">Connect wallet to bypass security</p>
          </div>
        ) : (
          <div className="transition-all duration-700">
            {activeTab === 'mint' && (
              <div className="flex justify-center">
                <MintSection stxAddress={stxAddress} />
              </div>
            )}
            
            {activeTab === 'market' && (
              <div>
                {loadingMarket ? (
                  <div className="flex flex-col items-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Accessing Node Data...</p>
                  </div>
                ) : listings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {listings.map((item) => (
                      <MarketCard key={item.id} listingId={item.id} tokenId={item.tokenId} price={item.price} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 bg-[#121421] rounded-[3rem] border border-white/5 shadow-2xl">
                    <div className="text-5xl mb-6">📦</div>
                    <p className="text-white font-black uppercase text-sm tracking-widest">Market is Empty</p>
                    <p className="text-gray-500 text-[10px] mt-2 italic font-mono uppercase tracking-tighter">Be the first to establish a listing in the dollhouse</p>
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