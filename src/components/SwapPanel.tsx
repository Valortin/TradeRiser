import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { executeSwap, getSupportedTokens, initAAClient, initAABuilder } from "../utils/aaUtils";
import { toast } from "react-toastify";

interface SwapPanelProps {
  signer: ethers.Signer | undefined;
}

const SwapPanel: React.FC<SwapPanelProps> = ({ signer }) => {
  const [tokenIn, setTokenIn] = useState("");
  const [tokenOut, setTokenOut] = useState("");
  const [amountIn, setAmountIn] = useState("");
  const [amountOutMin, setAmountOutMin] = useState("");
  const [paymentType, setPaymentType] = useState(0);
  const [selectedToken, setSelectedToken] = useState("");
  const [supportedTokens, setSupportedTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTokens = async () => {
      if (signer) {
        try {
          const client = await initAAClient(signer);
          const builder = await initAABuilder(signer);
          const tokens = await getSupportedTokens(client, builder);
          setSupportedTokens(tokens);
        } catch (error) {
          console.error("Error fetching tokens:", error);
          toast.error("Failed to fetch supported tokens");
        }
      }
    };
    fetchTokens();
  }, [signer]);

  const handleSwap = async () => {
    if (!signer || !tokenIn || !tokenOut || !amountIn || !amountOutMin) {
      toast.error("Please fill all fields");
      return;
    }
    setIsLoading(true);
    try {
      const result = await executeSwap(
        signer,
        tokenIn,
        tokenOut,
        amountIn,
        amountOutMin,
        paymentType,
        selectedToken
      );
      toast.success(`Swap successful! Tx Hash: ${result.transactionHash}`);
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
      <h2 className="text-xl font-semibold mb-4">Swap Tokens</h2>
      <div className="space-y-4">
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
          <label className="block text-sm font-medium">Minimum Amount Out</label>
          <input
            type="text"
            value={amountOutMin}
            onChange={(e) => setAmountOutMin(e.target.value)}
            className="mt-1 w-full p-2 bg-gray-700 rounded-md focus:ring-primary"
            placeholder="Minimum amount out"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Gas Payment Type</label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(Number(e.target.value))}
            className="mt-1 w-full p-2 bg-gray-700 rounded-md focus:ring-primary"
          >
            <option value={0}>Sponsored (Free for first 5 swaps)</option>
            <option value={1}>Prepay with Token</option>
            <option value={2}>Postpay with Token (Premium Analytics)</option>
          </select>
        </div>
        {paymentType > 0 && (
          <div>
            <label className="block text-sm font-medium">Select Token</label>
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="mt-1 w-full p-2 bg-gray-700 rounded-md focus:ring-primary"
            >
              <option value="">Select a token</option>
              {supportedTokens.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol} ({token.type === 1 ? "Prepay" : "Postpay"})
                </option>
              ))}
            </select>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSwap}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 transition duration-300"
        >
          {isLoading ? "Swapping..." : "Swap"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SwapPanel;