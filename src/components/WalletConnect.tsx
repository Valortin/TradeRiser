import React, { useState, useEffect } from "react";
import { getSigner, getAAWalletAddress } from "../utils/aaUtils";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { ethers } from "ethers";

interface WalletConnectProps {
  onWalletConnected: (eoaAddress: string, aaAddress: string, signer: ethers.Signer) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onWalletConnected }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);

  useEffect(() => {
    const initWeb3Auth = async () => {
      const web3authInstance = new Web3Auth({
        clientId: process.env.REACT_APP_WEB3AUTH_CLIENT_ID || "",
        chainConfig: {
          chainNamespace: "eip155",
          chainId: "0x2b1", // NERO Chain ID (689 in hex)
          rpcTarget: NERO_CHAIN_CONFIG.rpcUrl,
        },
      });

      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          network: "testnet",
          uxMode: "popup",
        },
      });
      web3authInstance.configureAdapter(openloginAdapter);
      await web3authInstance.initModal();
      setWeb3auth(web3authInstance);
    };
    initWeb3Auth();
  }, []);

  const connectWallet = async (method: "metamask" | "social") => {
    setIsLoading(true);
    setError(null);
    try {
      let signer: ethers.Signer;
      let eoaAddress: string;

      if (method === "metamask") {
        signer = await getSigner();
        eoaAddress = await signer.getAddress();
      } else {
        if (!web3auth) throw new Error("Web3Auth not initialized");
        await web3auth.connect();
        const provider = new ethers.providers.Web3Provider(web3auth.provider as any);
        signer = provider.getSigner();
        eoaAddress = await signer.getAddress();
      }

      const aaAddress = await getAAWalletAddress(signer);
      setIsConnected(true);
      onWalletConnected(eoaAddress, aaAddress, signer);
    } catch (error: any) {
      setError(getReadableErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => connectWallet("metamask")}
        disabled={isLoading}
        className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition duration-300"
      >
        {isLoading ? "Connecting..." : "Connect MetaMask"}
      </button>
      <button
        onClick={() => connectWallet("social")}
        disabled={isLoading}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 transition duration-300"
      >
        {isLoading ? "Connecting..." : "Connect with Social"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default WalletConnect;