"use client"
import React, { useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../constants";

const Pay = () => {
    const [amount, setAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [isDepositing, setIsDepositing] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const connect = async () => {
        try {
            setIsConnecting(true);
            if (window.ethereum) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                return new ethers.Contract(contractAddress, contractABI, signer);
            } else {
                throw new Error("Ethereum provider not found.");
            }
        } catch (error) {
            console.error('Error connecting to contract', error);
            throw error;
        } finally {
            setIsConnecting(false);
        }
    }

    const toWei = (amount) => {
        return ethers.utils.parseEther(amount.toString());
    }

    const deposit = async (amount) => {
        try {
            setIsDepositing(true);
            const contract = await connect();
            const weiAmount = toWei(amount);
            const options = { value: weiAmount };
            const tx = await contract.deposit(weiAmount, options);
            await tx.wait();
            return true;
        } catch (error) {
            console.error('Error depositing funds', error);
            throw error;
        } finally {
            setIsDepositing(false);
        }
    }

    const withdraw = async (amount) => {
        try {
            setIsWithdrawing(true);
            const contract = await connect();
            const weiAmount = toWei(amount);
            const tx = await contract.withdraw(weiAmount);
            await tx.wait();
            return true;
        } catch(error) {
            console.error('Error withdrawing funds', error);
            throw error;
        } finally {
            setIsWithdrawing(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        try {
            await deposit(amount);
            alert(`Successfully deposited ${amount} ETH`);
            setAmount('');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    const handleWithdrawSubmit = async (e) => {
        e.preventDefault();

        if (!withdrawAmount || isNaN(parseFloat(withdrawAmount)) || parseFloat(withdrawAmount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        try {
            await withdraw(withdrawAmount);
            alert(`Successfully withdrawn ${withdrawAmount} ETH`);
            setWithdrawAmount('');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    return (
        <div className="mt-6">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Amount(ETH) </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter Amount"
                        className="h-10 w-full text-black rounded p-2"
                        step="0.0001"
                        min="0"
                    />
                </div>
                <button
                    type="submit"
                    className="h-10 w-full bg-blue-500 text-white rounded"
                    disabled={isDepositing}
                >
                    {isDepositing ? "Processing..." : "Pay"}
                </button>
            </form>

            <form onSubmit={handleWithdrawSubmit} className="mt-6">
                <div className="mb-4">
                    <label className="block mb-2">Withdraw Amount(ETH) </label>
                    <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Enter Amount"
                        className="h-10 w-full text-black rounded p-2"
                        step="0.0001"
                        min="0"
                    />
                </div>
                <button 
                    type="submit" 
                    className="h-10 w-full bg-blue-500 text-white rounded" 
                    disabled={isWithdrawing}
                >
                    {isWithdrawing ? "Processing..." : "Withdraw"}
                </button>
            </form>
        </div>
    );
}

export default Pay;   
