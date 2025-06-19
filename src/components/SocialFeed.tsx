import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { shareTrade, SOCIAL_CONTRACT_ABI, CONTRACT_ADDRESSES } from "../utils/aaUtils";
import { toast } from "react-toastify";

interface SocialFeedProps {
  signer: ethers.Signer | undefined;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ signer }) => {
  const [strategy, setStrategy] = useState("");
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");
  const [tokenIn, setTokenIn] = useState("");
  const [tokenOut, setTokenOut] = useState("");
  const [trades, setTrades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTrades = async () => {
    if (!signer) return;
    try {
      const provider = new ethers.providers.JsonRpcProvider(NERO_CHAIN_CONFIG.rpcUrl);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.socialContract,
        SOCIAL_CONTRACT_ABI,
        provider
      );
      const userAddress = await signer.getAddress();
      const trades = await contract.getTrades(userAddress);
      setTrades(trades);
    } catch (error) {
      console.error("Error fetching trades:", error);
      toast.error("Failed to fetch trades");
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [signer]);

  const handleShareTrade = async () => {
    if (!signer || !strategy || !amountIn || !amountOut || !tokenIn || !tokenOut) {
      toast.error("Please fill all fields");
      return;
    }
    setIsLoading(true);
    try {
      await shareTrade(signer, strategy, amountIn, amountOut, tokenIn, tokenOut);
      toast.success("Trade shared successfully!");
      fetchTrades();
      setStrategy("");
      setAmountIn("");
      setAmountOut("");
      setTokenIn("");
      setTokenOut("");
    } catch (error: any) {
      toast.error(getReadableErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
    >
      <h2 className="text-xl font-semibold mb-4">Social Feed</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Trading Strategy</label>
          <textarea
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="mt-1 w-full p-2 bg-gray-700 rounded-md focus:ring-primary"
            placeholder="Share your trading strategy"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Token In</label>
            <input
              type="text"
              value={tokenIn}
              onChange={(e) => setTokenIn(e.target.value)}
              className="mt-1 w-full p-2 bg-gray-700 rounded-md focus:ring-primary"
              placeholder="Token address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Token Out</label>
            <input
              type="text"
              value={tokenOut}
              onChange={(e) => setTokenOut(e.target.value)}
              className="mt-1 w-full p-2 bg-gray-700 rounded-md focus:ring-primary"
              placeholder="Token address"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Amount In</label>
            <input
              type="text"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              className="mt-1 w-full p-2 bg-gray-700 rounded-md focus:ring-primary"
              placeholder="Amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Amount Out</label>
            <input
              type="text"
              value={amountOut}
              onChange={(e) => setAmountOut(e.target.value)}
              className="mt-1 w-full p-2 bg-gray-700 rounded-md focus:ring-primary"
              placeholder="Amount"
            />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShareTrade}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition duration-300"
        >
          {isLoading ? "Sharing..." : "Share Trade"}
        </motion.button>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Recent Trades</h3>
        {trades.length > 0 ? (
          trades.map((trade, index) => (
            <div key={index} className="mt-2 p-3 bg-gray-700 rounded-md">
              <p className="text-sm">
                <strong>{trade.trader.slice(0, 6)}...</strong>: {trade.strategy}
              </p>
              <p className="text-xs text-gray-400">
                {ethers.utils.formatEther(trade.amountIn)} {trade.tokenIn.slice(0, 6)}... →{" "}
                {ethers.utils.formatEther(trade.amountOut)} {trade.tokenOut.slice(0, 6)}...
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">No trades yet.</p>
        )}
      </div>
    </motion.div>
  );
};

export default SocialFeed;