import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import { initializeEthers } from "./utils/contract";
import ConnectWallet from "./components/connectWallet/ConnectWallet1";
import BlockchainStatus from "./components/BlockchainStatus/BlockchainStatus";
import AidRecords from "./components/AidRecords/AidRecords";

// Lazy-loaded pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const checkMetaMask = async () => {
            if (window.ethereum) {
                console.log("✅ MetaMask detected!");

                try {
                    const chainId = await window.ethereum.request({ method: "eth_chainId" });
                    console.log("🔗 Connected to chain:", chainId);
                } catch (error) {
                    console.error("❌ Error fetching chain ID:", error);
                }

                window.ethereum.on("accountsChanged", (accounts) => {
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        localStorage.setItem("connectedAccount", accounts[0]);
                    } else {
                        setAccount(null);
                        localStorage.removeItem("connectedAccount");
                    }
                });

                window.ethereum.on("chainChanged", () => window.location.reload());
            } else {
                console.warn("⚠️ MetaMask not detected! Please install it.");
            }
        };

        const loadConnectedWallet = () => {
            const savedAccount = localStorage.getItem("connectedAccount");
            if (savedAccount) {
                setAccount(savedAccount);
            }
        };

        checkMetaMask();
        initializeEthers();
        loadConnectedWallet();
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setAccount(accounts[0]);
                localStorage.setItem("connectedAccount", accounts[0]);
            } catch (error) {
                console.error("❌ Wallet connection failed:", error);
            }
        } else {
            alert("MetaMask is not installed. Please install MetaMask to continue.");
        }
    };

    return (
        <Router>
            <Navbar account={account} connectWallet={connectWallet} />
            <Suspense fallback={<div>Loading...</div>}>
                <ErrorBoundary>
                    <ConnectWallet account={account} connectWallet={connectWallet} />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <div className="blockchain-container">
                        <BlockchainStatus />
                        <AidRecords />
                    </div>
                </ErrorBoundary>
            </Suspense>
            <Footer />
        </Router>
    );
};

export default App;

