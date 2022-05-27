import React, { useState, useRef, useEffect } from "react";
import { BigNumber, Contract, providers, utils } from "ethers";
//import Calendar from "react-calendar";
//import "react-calendar/dist/Calendar.css";
import styles from "../../styles/Home.module.css";
import Header from "./Header";
import Web3Modal from "web3modal";
import { AMBASS_CONTRACT_ADDRESS, AMBASS_CONTRACT_ABI } from "../../constants";

export default function CampaignList() {
  const [subTokens, setSubTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();

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

  const getAllSubTokens = async () => {
    console.log("getAllSubTokens()");
    setLoading(true);
    try {
      const signer = await getProvider();
      const tokenContract = new Contract(
        AMBASS_CONTRACT_ADDRESS,
        AMBASS_CONTRACT_ABI,
        signer
      );

      const subTokenArray = await tokenContract.getSubTokens();

      //await subTokenArray;
      console.log(subTokenArray);
      setSubTokens([...subTokenArray]);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    web3ModalRef.current = new Web3Modal({
      network: "rinkeby",
      providerOptions: {},
      disableInjectedProvider: false,
    });
    getAllSubTokens();
  }, []);

  const showCampaignDetail = async () => {};

  const joinAndGetSubtoken = async (subTokenTicker) => {
    console.log("Get SubToken and Join Campaign");
    setLoading(true);
    try {
      const signer = await getSigner();
      const signerAddress = await signer.getAddress();
      const tokenContract = new Contract(
        AMBASS_CONTRACT_ADDRESS,
        AMBASS_CONTRACT_ABI,
        signer
      );

      const tx = await tokenContract.joinAndGetSubToken(
        subTokenTicker, //subTokenName
        subTokenTicker,
        10,
        signerAddress
      );

      await tx.wait();
      setLoading(false);
      //router.push("/");
      console.log("Got  %s and Joined Campaign", subTokenTicker);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleJoin = (e) => {
    console.log("joining a campaign for token: ", e.target.value);
    joinAndGetSubtoken(e.target.value);
  };

  return (
    <div className={styles.container}>
      <Header isLoading={loading} />
      <main>
        <div>
          {subTokens.map((token, idx) => {
            return (
              <div
                key={idx}
                className={styles.campaign_card}
                onClick={showCampaignDetail}
              >
                <div className="columns-3">
                  <span className="px-2 text-3xl">{token}</span>

                  <button
                    disabled={loading}
                    value={token}
                    onClick={handleJoin}
                    className=" flex mt-4 group relative w-30 flex justify-center
                                py-2 px-4 border border-transparent text-sm font-medium
                                rounded-md text-white bg-blue-300 hover:bg-indigo-300
                                focus:outline-none focus:ring-2 focus:ring-offset-2
                                focus:ring-indigo-500"
                  >
                    Join
                  </button>
                  <button
                    disabled={loading}
                    value={token}
                    className=" flex mt-4 group relative w-30 flex justify-center
                                py-2 px-4 border border-transparent text-sm font-medium
                                rounded-md text-white bg-blue-300 hover:bg-indigo-300
                                focus:outline-none focus:ring-2 focus:ring-offset-2
                                focus:ring-indigo-500"
                  >
                    Detail
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
