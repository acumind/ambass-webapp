import Head from "next/head";
import Link from "next/link";
import { BigNumber, Contract, providers, utils } from "ethers";
import Web3Modal from "web3modal";

import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import Header from "./components/Header";

import { AMBASS_CONTRACT_ADDRESS, AMBASS_CONTRACT_ABI } from "../constants";

export default function Home() {
  const zero = BigNumber.from(0);
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(zero);
  const [balanceOfAMBTokens, setBalanceOfAMBTokens] = useState(zero);
  const [tokensMinted, setTokensMinted] = useState(zero);
  const web3ModalRef = useRef();
  const walletAddressRef = useRef();

  const getProvider = async () => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Connect with Rinkey Network");
      throw new Error("Incorrect Network: Connect with Rinkeyu");
    }
    return web3Provider;
  };

  const getSigner = async () => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Connect with Rinkey Network");
      throw new Error("Incorrect Network: Connect with Rinkeyu");
    }
    return web3Provider.getSigner();
  };

  const getBalanceOfAMBTokens = async () => {
    try {
      const provider = await getProvider();
      const tokenContract = new Contract(
        AMBASS_CONTRACT_ADDRESS,
        AMBASS_CONTRACT_ABI,
        provider
      );
      const signer = await getSigner();
      const address = await signer.getAddress();
      const balance = await tokenContract.balanceOf(address);
      setBalanceOfAMBTokens(balance);
    } catch (err) {
      console.error(err);
    }
  };

  const getTotalTokenMinted = async () => {
    try {
      const provider = await getProvider();
      const tokenContract = new Contract(
        AMBASS_CONTRACT_ADDRESS,
        AMBASS_CONTRACT_ABI,

        provider
      );
      const _tokensMinted = await tokenContract.totalSupply();
      setTokensMinted(_tokensMinted);
    } catch (err) {
      console.error(err);
    }
  };
  const mintAMBToken = async (amount) => {
    setLoading(true);
    try {
      const signer = await getSigner();
      const tokenContract = new Contract(
        AMBASS_CONTRACT_ADDRESS,
        AMBASS_CONTRACT_ABI,
        signer
      );
      const value = 0.001 * amount;
      const tx = await tokenContract.mint(amount, {
        value: utils.parseEther(value.toString()),
      });

      await tx.wait();
      setLoading(false);
      //window.alert("Minted AMB Token");
      await getBalanceOfAMBTokens();
      await getTotalTokenMinted();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      await getProvider();
      setWalletConnected(true);
      //const walletAddress = await provider.getSigner().getAddress();
    } catch (error) {
      console.error(error);
    }
  };
  async function getWalletAddress() {
    console.log("getWalletAddress():", walletAddressRef.current);

    return walletAddressRef.current;
  }

  const displayConnectButton = () => {
    if (isWalletConnected) {
      // if (loading) {
      //   return (
      //     // <div className={styles.card}>
      //     //   <button>Loading..</button>
      //     // </div>
      //     <LoadingSpinner />
      //   );
      // } else {
      return (
        <div className={styles.grid}>
          <div className={styles.card}>
            <button>
              <h2>Wallet Connected</h2>
            </button>
            <p>
              You have {utils.formatEther(balanceOfAMBTokens).toString()}/
              {utils.formatEther(tokensMinted).toString()} AMB Tokens
            </p>
            <p>Creaet campaigns using these AMB tokens.</p>
          </div>
          {/* <div className={styles.button}>Address: {getWalletAddress()}</div> */}
          <div className={styles.card}>
            <input
              type="number"
              placeholder="AMB Token Amount to Mint"
              onChange={(e) => setTokenAmount(BigNumber.from(e.target.value))}
              className="appearance-none rounded-none relative block
                  w-full px-6 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 rounded-t-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
            />

            <button
              disabled={!(tokenAmount > 0) || loading}
              onClick={() => mintAMBToken(tokenAmount)}
              className="mt-4 group relative w-full flex justify-center
                py-2 px-4 border border-transparent text-sm font-medium
                rounded-md text-white bg-indigo-600 hover:bg-indigo-700
                focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-indigo-500"
            >
              Get AMB Token
            </button>
          </div>
        </div>
      );
      //}
    } else {
      return (
        <div className={styles.card}>
          <button onClick={connectWallet} disabled={loading}>
            Connect Wallet
          </button>
        </div>
      );
    }
  };

  useEffect(() => {
    if (!isWalletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getTotalTokenMinted();
      getBalanceOfAMBTokens();
    }
  }, [isWalletConnected]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Ambass</title>
        <meta name="Ambass Web App" content="Ambass Web App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header isLoading={loading} />
      <main className={styles.main}>
        <div className="bg-zinc-100 pt-10  w-full">
          <h1 className={styles.title}>Ambass!</h1>
          <p className={styles.description}>
            An Incentivising Platform for Campaign Ambassdors!!!
          </p>
        </div>

        {/* <div className={styles.card}>{displayConnectButton()}</div> */}
        {displayConnectButton()}
        <div className={styles.grid}>
          <Link href={!loading ? "/components/new_campaign" : "#"}>
            <a className={styles.card}>
              <h2>Create Campaign &rarr;</h2>
              <p>Create and Configure your public campaign.</p>
            </a>
          </Link>

          <Link href={!loading ? "/components/list_campaign" : "#"}>
            <a className={styles.card}>
              <h2>My Campaigns &rarr;</h2>
              <p>View And Analyze All Your Campaigns</p>
            </a>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://twitter.com/acumind"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by Acumind
        </a>
      </footer>
    </div>
  );
}
