
import { createWeb3Modal, defaultConfig, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { shortenAddress } from "./lib/utils";
import { contractABI, contractAdr } from "./contracts/contractData";
import {ExternalLink} from "lucide-react"
import { BrowserProvider, Contract, formatEther} from 'ethers'
import { useEffect, useState } from "react";
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
  const {walletProvider} = useWeb3ModalProvider()
  const [crowdfindingBalance, setCrowdfundingBalance] = useState<string| null>(null)
  const [funderLength, setFUnderLength] =  useState<number | null>(null)
  const fetchContractData = async () => {
    if(walletProvider){
      const ethersProvider = new BrowserProvider(walletProvider)
      const contract = new Contract (contractAdr, contractABI, ethersProvider )
      const contractBalance = await ethersProvider.getBalance(contractAdr)
      const funderLength = await contract.getFundersLength()
      setFUnderLength(Number(funderLength))
      setCrowdfundingBalance(formatEther(contractBalance))
    }
    
  }
  //useEffect được chạy sau khi mọi thứ chạy xong
  useEffect(() => {fetchContractData()}, [walletProvider])

  return (
    <>
    <header className=" mx-auto px-2 py-2 border-b">
      <div className=" flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Crowdfunding</h1>
          <a className="text-sm hover:bg-gray-200 p-1 rounded-lg flex items-center" target="_blank" href={`https://sepolia.etherscan.io/address/${contractAdr}`}>{shortenAddress((contractAdr))} <ExternalLink className="w-4 h-4"/></a>
        </div>
        <button onClick={() => open()}   className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">{isConnected ? `${shortenAddress(address)}` : "Connect Wallet"}</button>

      </div>
    </header>
    <main className="pt-4 mx-auto px-2">
      <div className="flex justify-start items-center">
        <div className="space-y-2 w-[30%]">
          <div className="p-2 border shadow-lg rouded-lg">
            <h2 className="text-lg font-bold">Total Amount Funding</h2>
            <p className="font-bold"><span className="text-3xl font-bold">{crowdfindingBalance}</span> ETH</p>
          </div>
          <div className="p-2 border shadow-lg rouded-lg">
            <h2 className="text-lg font-bold">Funders</h2>
            <p className="text-3xl font-bold">{(funderLength)}</p>
          </div>
        </div>
      </div>
    </main>
    </>
  )
}

export default App
