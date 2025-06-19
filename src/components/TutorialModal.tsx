import React from "react";
import { motion } from "framer-motion";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-gray-800 p-6 rounded-lg max-w-md w-full"
      >
        <h2 className="text-xl font-semibold mb-4">Welcome to TradeRiser!</h2>
        <p className="text-sm mb-4">
          TradeRiser is a decentralized exchange aggregator that helps you get the best swap rates. Here's how to get started:
        </p>
        <ul className="list-disc list-inside text-sm space-y-2">
          <li>Connect your wallet using MetaMask or a social login.</li>
          <li>Enter the tokens you want to swap and the amount.</li>
          <li>Choose a gas payment option (free for your first 5 swaps!).</li>
          <li>Share your trades and follow top traders in the social feed.</li>
        </ul>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700"
        >
          Got It!
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default TutorialModal;