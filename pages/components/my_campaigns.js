import React, { useState, useRef, useEffect } from "react";
import { BigNumber, Contract, providers, utils } from "ethers";
//import Calendar from "react-calendar";
//import "react-calendar/dist/Calendar.css";
import styles from "../../styles/Home.module.css";
import Header from "./Header";
import Web3Modal from "web3modal";
import { AMBASS_CONTRACT_ADDRESS, AMBASS_CONTRACT_ABI } from "../../constants";

export default function MyCampaignList() {
  const [subTokens, setSubTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRandomAirDropChecked, setRandomAirDropChecked] = useState(false);
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

  const getAllSubTokensByAddress = async () => {
    console.log("getAllSubTokensByAddress()");
    try {
      const signer = await getSigner();
      const address = await signer.getAddress();
      const tokenContract = new Contract(
        AMBASS_CONTRACT_ADDRESS,
        AMBASS_CONTRACT_ABI,
        signer
      );

      const subTokenArray = await tokenContract.getSubTokensByAddress(address);
      setLoading(true);
      //await subTokenArray;
      console.log(subTokenArray);
      setSubTokens([...subTokenArray]);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    web3ModalRef.current = new Web3Modal({
      network: "rinkeby",
      providerOptions: {},
      disableInjectedProvider: false,
    });
    getAllSubTokensByAddress();
  }, []);

  const showCampaignDetail = async () => {
    console.log("showCampaignDetail():");
  };

  const doAirDrop = async (subTokenTicker) => {
    console.log("doAirDrop");
    setLoading(true);
    try {
      const signer = await getSigner();
      const signerAddress = await signer.getAddress();
      const tokenContract = new Contract(
        AMBASS_CONTRACT_ADDRESS,
        AMBASS_CONTRACT_ABI,
        signer
      );

      const tx = await tokenContract.doAirDrop(
        subTokenTicker,
        isRandomAirDropChecked
      );

      await tx.wait();
      setLoading(false);
      //router.push("/");
      console.log("AirDrop Completed.");
    } catch (err) {
      console.error(err);
    }
  };

  const doDistro = async (subTokenTicker) => {
    console.log("doDistro");
    setLoading(true);
    try {
      const signer = await getSigner();
      const signerAddress = await signer.getAddress();
      const tokenContract = new Contract(
        AMBASS_CONTRACT_ADDRESS,
        AMBASS_CONTRACT_ABI,
        signer
      );

      const tx = await tokenContract.doDistro(subTokenTicker);

      await tx.wait();
      setLoading(false);
      router.push("/");
      console.log("Got `{subTokenTicker}` and Joined Campaign");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAirDrop = (e) => {
    console.log("handleAirDrop");
    doAirDrop(e.target.value);
  };

  const handleDistro = (e) => {
    console.log("handleDistro");
    doDistro(e.target.value);
  };

  const handleOnChange = () => {
    console.log("handleOnChange():");
    setRandomAirDropChecked(!isRandomAirDropChecked);
  };
  return (
    <div className={styles.container}>
      <Header />
      <main>
        <div>
          {subTokens.map((token, idx) => {
            return (
              <div key={idx} className={styles.campaign_card}>
                <div className="columns-4 ">
                  <span className="px-2 text-3xl">{token}</span>

                  <button
                    value={token}
                    onClick={handleAirDrop}
                    className=" flex mt-3 group relative w-30  justify-center
                py-2 px-4 border border-transparent text-sm font-medium
                rounded-md text-white bg-blue-300 hover:bg-indigo-300
                focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-indigo-500"
                  >
                    AirDrop
                  </button>
                  <div>
                    <input
                      type="checkbox"
                      id="rand-airdrop"
                      name="Random AirDrop"
                      value="rand-airdtop"
                      className="m-4"
                      checked={isRandomAirDropChecked}
                      onChange={handleOnChange}
                    />
                    Auto
                  </div>
                  <button
                    value={token}
                    onClick={handleDistro}
                    className=" flex mt-4 group relative w-30 flex justify-center
                py-2 px-4 border border-transparent text-sm font-medium
                rounded-md text-white bg-blue-300 hover:bg-indigo-300
                focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-indigo-500"
                  >
                    Distro
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
