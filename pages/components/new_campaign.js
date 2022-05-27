import React, { useState, useRef, useEffect } from "react";
import Router, { useRouter } from "next/router";
import { BigNumber, Contract, providers, utils } from "ethers";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "../../styles/Home.module.css";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Header from "./Header";
import Web3Modal from "web3modal";
import { AMBASS_CONTRACT_ADDRESS, AMBASS_CONTRACT_ABI } from "../../constants";

const airdrop_options = [
  {
    label: "10",
    value: "5",
  },
  {
    label: "20",
    value: "20",
  },
  {
    label: "30",
    value: "30",
  },
  {
    label: "40",
    value: "40",
  },
  {
    label: "50",
    value: "50",
  },
];

export default function Campaign() {
  const [campaignStartDate, setCampaignStartDate] = useState(new Date());
  const [airdropDate, setAirdropDate] = useState(new Date());
  const [campaignName, setCampaignName] = useState("");
  const [subTokenName, setSubTokenName] = useState("");
  const [subTokenTicker, setSubTokenTicker] = useState("");
  const [subTokenMaxSupply, setSubTokenMaxSupply] = useState(0);
  const [ambAllocation, setAMBAllocation] = useState(0);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();
  const router = useRouter();

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

  useEffect(() => {
    web3ModalRef.current = new Web3Modal({
      network: "rinkeby",
      providerOptions: {},
      disableInjectedProvider: false,
    });
  }, []);

  const createSubToken = async () => {
    console.log("Creating Campaign SubTokens");
    setLoading(true);
    try {
      const signer = await getSigner();
      const signerAddress = await signer.getAddress();
      const tokenContract = new Contract(
        AMBASS_CONTRACT_ADDRESS,
        AMBASS_CONTRACT_ABI,
        signer
      );

      const tx = await tokenContract.createSubToken(
        campaignName,
        subTokenName,
        subTokenTicker,
        subTokenMaxSupply,
        ambAllocation,
        campaignStartDate,
        airdropDate,
        10,
        signerAddress
      );

      await tx.wait();
      setLoading(false);
      //router.push("/");
      console.log("Campaign SubTokens Created by ", signerAddress);
      toast.success(
        `Campaign ${subTokenName} Created. ${subTokenTicker} Minted.`
      );
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error(`Campaign ${subTokenName} Creation Failed.`);
    }
  };

  const handleSubmit = (e) => {
    console.log("handleSubmit()");
    e.preventDefault();
    createSubToken();
  };

  return (
    <div className={styles.container}>
      <Header isLoading={loading} />
      <main className={styles.main}>
        <div className="min-h-full flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <form className="mt-1 space-y-6">
              <div className="rounded-md shadow-sm -space-y-ps">
                <div className="mt-1">
                  <label htmlFor="campaign_name" className="">
                    Title
                  </label>

                  <input
                    type="text"
                    id="campaign_name"
                    name="campaign_name"
                    placeholder="Campaing Title"
                    onChange={(e) => setCampaignName(e.target.value)}
                    required
                    className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 rounded-b-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>
                <div className="mt-5">
                  <label htmlFor="subtoken_name">SubToken Name</label>

                  <input
                    type="text"
                    id="subtoken_name"
                    name="subtoken_name"
                    placeholder="e.g Liberty Token"
                    onChange={(e) => setSubTokenName(e.target.value)}
                    required
                    className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 rounded-t-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>

                <div className="mt-5">
                  <label htmlFor="subtoken_ticker">SubToken Ticker</label>

                  <input
                    type="text"
                    id="subtoken_ticker"
                    name="subtoken_ticker"
                    placeholder="e.g LBT"
                    onChange={(e) => setSubTokenTicker(e.target.value)}
                    required
                    className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 rounded-b-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>
                <div className="mt-5">
                  <label htmlFor="subtoken_quantity">SubToken Amount </label>

                  <input
                    type="text"
                    id="subtoken_quantity"
                    name="subtoken_quantity"
                    placeholder="Max supply of subtoken e.g 1000"
                    onChange={(e) =>
                      setSubTokenMaxSupply(BigNumber.from(e.target.value))
                    }
                    required
                    className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 rounded-b-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>

                <div className="mt-5">
                  <label htmlFor="amb_allocation">AMB Allocation </label>

                  <input
                    type="text"
                    id="amb_allocation"
                    name="subtoken_ticker"
                    placeholder="No of AMB token allocated for SubToken e.g 5 AMB "
                    onChange={(e) =>
                      setAMBAllocation(BigNumber.from(e.target.value))
                    }
                    required
                    className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 rounded-b-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>
                <div className="mt-5">
                  <label htmlFor="amb_allocation">SubToken Rate</label>

                  <p
                    className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 rounded-b-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
                  >
                    {ambAllocation ? subTokenMaxSupply / ambAllocation : 0}{" "}
                    {subTokenTicker}/AMB
                  </p>
                </div>

                <div className="mt-5">
                  <label htmlFor="subtoken_airdrop">Airdrop[%] </label>
                  <div>
                    <select
                      className="mt-2 group relative w-full flex justify-center
                py-2 px-4 border border-transparent text-sm font-medium
                rounded-md text-white bg-gray-600"
                    >
                      {airdrop_options.map((option) => (
                        <option value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.calendar_grid}>
                  <div className={styles.calendar_card}>
                    <label htmlFor="campaign_start_date" className="">
                      Campaign Start Date
                    </label>

                    <Calendar
                      onChange={setCampaignStartDate}
                      value={campaignStartDate}
                    />
                  </div>
                  <div className={styles.calendar_card}>
                    <label htmlFor="airdropDate" className="mb-10">
                      Airdrop Date
                    </label>

                    <Calendar onChange={setAirdropDate} value={airdropDate} />
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleSubmit}
                    className="mt-4 group relative w-full flex justify-center
                py-2 px-4 border border-transparent text-sm font-medium
                rounded-md text-white bg-indigo-600 hover:bg-indigo-700
                focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-indigo-500"
                  >
                    Create
                  </button>
                </div>
              </div>
            </form>
          </div>
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
