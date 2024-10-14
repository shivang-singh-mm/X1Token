import X1Racing from "./artifacts/contracts/X1Racing.sol/X1Racing.json"
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [balance, setBalance] = useState(0);
  const [mintNo, setmintNo] = useState(0);
  const [stakeNo, setStake] = useState(0);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

        const contract = new ethers.Contract(
          contractAddress,
          X1Racing.abi,
          signer
        );
        //console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);


  async function handleShowBalance() {
    const balance = await contract.balanceOf(account);
    const formattedBalance = ethers.utils.formatUnits(balance, 18);
    setBalance(formattedBalance);
  }

  async function handleMint() {
    const mint = await contract.mint(account, mintNo);
    setmintNo(0);
  }

  async function handleStake() {
    // console.log(contract);
    const stake = await contract.stake(account, stakeNo);
    setStake(0);
  }

  async function handleUnstake() {
    const usntake = await contract.unstake(account, {
      gasLimit: ethers.utils.hexlify(100000) // Adjust the gas limit as needed
    })
  }

  return (
    <>
      <div className="App">
        <h1 style={{ color: "white" }}>X1 Racing</h1>
        <div class="bg"></div>
        <div class="bg bg2"></div>
        <div class="bg bg3"></div>

        <p style={{ color: "white" }}>
          Account : {account ? account : "Not connected"}
        </p>
        {balance} Tokens
        <br />
        <button onClick={handleShowBalance}>Show Balance</button>
        <br />
        <br />
        <input value={mintNo} onChange={(e) => { setmintNo(e.target.value) }} />
        <br />
        <button onClick={handleMint}>Mint Tokens</button>
        {/* <Display contract={contract} account={account}></Display> */}
        <br />
        <br />
        <br />
        <input placeholder="Input value to keep at stake" value={stakeNo} onChange={(e) => setStake(e.target.value)} />
        <br />
        <button onClick={handleStake} >Click TO Keep At Stake</button>
        <br />
        <br />
        <br />
        <br />
        <button onClick={handleUnstake}>Click To Unstake All Tokens</button>
      </div>
    </>
  );
}

export default App;
