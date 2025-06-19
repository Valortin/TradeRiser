import React, { useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import SwapPanel from "./components/SwapPanel";
import SocialFeed from "./components/SocialFeed";
import TutorialModal from "./components/TutorialModal";

const App: React.FC = () => {
  const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);
  const [eoaAddress, setEoaAddress] = useState("");
  const [aaAddress, setAaAddress] = useState("");
  const [showTutorial, setShowTutorial] = useState(true);

  const handleWalletConnected = async (eoaAddr: string, aaAddr: string, signer: ethers.Signer) => {
    try {
      setEoaAddress(eoaAddr);
      setAaAddress(aaAddr);
      setSigner(signer);
      toast.success("Wallet connected successfully!");
    } catch (error) {
      toast.error("Failed to connect wallet");
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Header onWalletConnected={handleWalletConnected} aaAddress={aaAddress} />
      <main className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
        <SwapPanel signer={signer} />
        <SocialFeed signer={signer} />
      </main>
      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default App;