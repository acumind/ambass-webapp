import React, { useState, useRef, useEffect } from "react";
import { BigNumber, Contract, providers, utils } from "ethers";
//import Calendar from "react-calendar";
//import "react-calendar/dist/Calendar.css";
import styles from "../../styles/Home.module.css";
import Header from "./Header";
import Web3Modal from "web3modal";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { AMBASS_CONTRACT_ADDRESS, AMBASS_CONTRACT_ABI } from "../../constants";

export default function MyCampaignList() {
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

  const getAllJoinedSubTokensByAddress = async () => {
    console.log("getAllJoinedSubTokensByAddress()");
    setLoading(true);
    try {
      const signer = await getSigner();
      const address = await signer.getAddress();
      const tokenContract = new Contract(
        AMBASS_CONTRACT_ADDRESS,
        AMBASS_CONTRACT_ABI,
        signer
      );

      const subTokenArray = await tokenContract.getJoinedSubTokens(address);

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
    getAllJoinedSubTokensByAddress();
  }, []);

  const showCampaignDetail = async () => {};

  const joinAndGetSubtoken = async () => {
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
        subTokenName,
        subTokenTicker,
        10,
        signerAddress
      );

      await tx.wait();
      setLoading(false);
      //router.push("/");
      console.log("Got `{subTokenTicker}` and Joined Campaign");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleJoin = (e) => {
    console.log("joining a campaign");
    joinAndGetSubtoken();
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
                <div className="felx justify-end">
                  <span className="px-2 text-3xl">{token}</span>
                  {/* 
                  <button
                    onClick={handleJoin}
                    className=" flex mt-4 group relative w-30 flex justify-center
                py-2 px-4 border border-transparent text-sm font-medium
                rounded-md text-white bg-blue-300 hover:bg-indigo-300
                focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-indigo-500"
                  >
                    Join
                  </button> */}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
