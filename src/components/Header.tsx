import React from "react";
import WalletConnect from "./WalletConnect";
import { motion } from "framer-motion";

interface HeaderProps {
  onWalletConnected: (eoaAddress: string, aaAddress: string, signer: ethers.Signer) => void;
  aaAddress: string;
}

const Header: React.FC<HeaderProps> = ({ onWalletConnected, aaAddress }) => {
  return (
    <motion.header
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-secondary shadow-md p-4 flex justify-between items-center"
    >
      <h1 className="text-2xl font-bold text-primary">TradeRiser</h1>
      <div className="flex items-center space-x-4">
        {aaAddress && (
          <p className="text-sm text-gray-400">
            AA Wallet: {aaAddress.slice(0, 6)}...{aaAddress.slice(-4)}
          </p>
        )}
        <WalletConnect onWalletConnected={onWalletConnected} />
      </div>
    </motion.header>
  );
};

export default Header;