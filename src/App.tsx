
import { createWeb3Modal, defaultConfig, useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { shortenAddress } from "./lib/utils";


const projectId = import.meta.env.VITE_PROJECT_ID;

const sepolia = {
  chainId: 11155111,
  name: "Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io/",
  rpcUrl: import.meta.env.VITE_SEPOLIA_RPC_URL,
};

const metadata = {
  name: "Crowfunding",
  description: "Website help people donation for me",
  url: "https://mywebsite.com", // custom your domain here
  icons: ["https://avatars.mywebsite.com/"], //custom your logo here
};

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
});

createWeb3Modal({
  ethersConfig,
  chains: [sepolia],
  projectId,
  enableAnalytics: true,
});

function App() {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useWeb3ModalAccount()
  open()

  return (
    <div>
      <button onClick={() => open()}   className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">{isConnected ? `${shortenAddress(address)}` : "Connect Wallet"}</button>
      
    </div>
  )
}

export default App
