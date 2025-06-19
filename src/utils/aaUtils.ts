import { ethers } from "ethers";
import { Presets } from "userop";
import { NERO_CHAIN_CONFIG, AA_PLATFORM_CONFIG, CONTRACT_ADDRESSES, API_KEY } from "../constants/config";
import { DEX_AGGREGATOR_ABI, SOCIAL_CONTRACT_ABI } from "../constants/abi";

export const getSigner = async () => {
  if (!window.ethereum) throw new Error("No crypto wallet found. Please install MetaMask.");
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider.getSigner();
};

export const getAAWalletAddress = async (accountSigner: ethers.Signer) => {
  try {
    const simpleAccount = await Presets.Builder.SimpleAccount.init(
      accountSigner,
      NERO_CHAIN_CONFIG.rpcUrl,
      {
        overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
        entryPoint: CONTRACT_ADDRESSES.entryPoint,
        factory: CONTRACT_ADDRESSES.accountFactory,
      }
    );
    return await simpleAccount.getSender();
  } catch (error) {
    console.error("Error getting AA wallet address:", error);
    throw error;
  }
};

export const initAAClient = async (accountSigner: ethers.Signer) => {
  const provider = new ethers.providers.JsonRpcProvider(NERO_CHAIN_CONFIG.rpcUrl);
  return provider; // Simplified for demo; extend with AA client logic if needed
};

export const initAABuilder = async (accountSigner: ethers.Signer, apiKey: string = API_KEY) => {
  const builder = await Presets.Builder.SimpleAccount.init(
    accountSigner,
    NERO_CHAIN_CONFIG.rpcUrl,
    {
      overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
      entryPoint: CONTRACT_ADDRESSES.entryPoint,
      factory: CONTRACT_ADDRESSES.accountFactory,
    }
  );
  builder.setPaymasterOptions({
    apikey: apiKey,
    rpc: AA_PLATFORM_CONFIG.paymasterRpc,
    type: "0", // Default to sponsored gas
  });
  builder.setCallGasLimit(300000);
  builder.setVerificationGasLimit(2000000);
  builder.setPreVerificationGas(100000);
  return builder;
};

export const setPaymentType = (builder: any, paymentType: number, tokenAddress: string = "") => {
  const paymasterOptions: any = {
    apikey: API_KEY,
    rpc: AA_PLATFORM_CONFIG.paymasterRpc,
    type: paymentType.toString(),
  };
  if (paymentType > 0 && tokenAddress) {
    paymasterOptions.token = tokenAddress;
  }
  builder.setPaymasterOptions(paymasterOptions);
  return builder;
};

export const executeSwap = async (
  accountSigner: ethers.Signer,
  tokenIn: string,
  tokenOut: string,
  amountIn: string,
  amountOutMin: string,
  paymentType: number = 0,
  selectedToken: string = ""
) => {
  try {
    const client = await initAAClient(accountSigner);
    const builder = await initAABuilder(accountSigner);
    setPaymentType(builder, paymentType, selectedToken);

    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.dexAggregator,
      DEX_AGGREGATOR_ABI,
      client
    );
    const callData = contract.interface.encodeFunctionData("swap", [
      tokenIn,
      tokenOut,
      ethers.utils.parseEther(amountIn),
      ethers.utils.parseEther(amountOutMin),
      await accountSigner.getAddress(),
    ]);

    const userOp = await builder.execute(CONTRACT_ADDRESSES.dexAggregator, 0, callData);
    const res = await client.sendUserOperation(userOp);
    const receipt = await res.wait();
    return {
      userOpHash: res.userOpHash,
      transactionHash: receipt?.transactionHash || "",
      receipt,
    };
  } catch (error) {
    console.error("Error executing swap:", error);
    throw error;
  }
};

export const shareTrade = async (
  accountSigner: ethers.Signer,
  strategy: string,
  amountIn: string,
  amountOut: string,
  tokenIn: string,
  tokenOut: string
) => {
  try {
    const client = await initAAClient(accountSigner);
    const builder = await initAABuilder(accountSigner);
    setPaymentType(builder, 0); // Use sponsored gas for sharing

    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.socialContract,
      SOCIAL_CONTRACT_ABI,
      client
    );
    const callData = contract.interface.encodeFunctionData("shareTrade", [
      await accountSigner.getAddress(),
      strategy,
      ethers.utils.parseEther(amountIn),
      ethers.utils.parseEther(amountOut),
      tokenIn,
      tokenOut,
    ]);

    const userOp = await builder.execute(CONTRACT_ADDRESSES.socialContract, 0, callData);
    const res = await client.sendUserOperation(userOp);
    const receipt = await res.wait();
    return {
      userOpHash: res.userOpHash,
      transactionHash: receipt?.transactionHash || "",
      receipt,
    };
  } catch (error) {
    console.error("Error sharing trade:", error);
    throw error;
  }
};

export const getSupportedTokens = async (client: any, builder: any) => {
  try {
    const sender = await builder.getSender();
    const minimalUserOp = {
      sender,
      nonce: "0x0",
      initCode: "0x",
      callData: "0x",
      callGasLimit: "0x88b8",
      verificationGasLimit: "0x33450",
      preVerificationGas: "0xc350",
      maxFeePerGas: "0x2162553062",
      maxPriorityFeePerGas: "0x40dbcf36",
      paymasterAndData: "0x",
      signature: "0x",
    };

    const provider = new ethers.providers.JsonRpcProvider(AA_PLATFORM_CONFIG.paymasterRpc);
    let tokensResponse;
    try {
      tokensResponse = await provider.send("pm_supported_tokens", [
        minimalUserOp,
        API_KEY,
        CONTRACT_ADDRESSES.entryPoint,
      ]);
    } catch (error) {
      console.warn("Error fetching tokens:", error);
      return [];
    }

    const tokens = tokensResponse?.tokens || [];
    return tokens.map((token: any) => ({
      address: token.address,
      symbol: token.symbol,
      decimal: parseInt(token.decimals || "18"),
      type: token.freepay ? 0 : token.prepay ? 1 : 2,
    }));
  } catch (error) {
    console.error("Error fetching supported tokens:", error);
    return [];
  }
};