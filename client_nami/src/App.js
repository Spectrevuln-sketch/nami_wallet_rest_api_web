import React, { useEffect, useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import './App.css';

import NamiWalletApi, { Cardano } from './nami-js';
import blockfrostApiKey from './config';
import { useHistory } from 'react-router-dom'
let nami;


export default function App() {
    let history = useHistory()
    const [connected, setConnected] = useState()
    const [address, setAddress] = useState()
    const [nfts, setNfts] = useState([])
    const [balance, setBalance] = useState()
    const [transaction, setTransaction] = useState()
    const [amount, setAmount] = useState("10")
    const [txHash, setTxHash] = useState()
    const [recipientAddress, setRecipientAddress] = useState("addr_test1qqsjrwqv6uyu7gtwtzvhjceauj8axmrhssqf3cvxangadqzt5f4xjh3za5jug5rw9uykv2klc5c66uzahu65vajvfscs57k2ql")
    const [witnesses, setWitnesses] = useState()
    const [policy, setPolicy] = useState()
    const [builtTransaction, setBuiltTransaction] = useState()
    const [MultiTrans, setMultiTrans] = useState(false)

    const [complextxHash, setComplextxHash] = useState()
    const [policyExpiration, setPolicyExpiration] = useState(new Date());
    const [complexTransaction, setComplexTransaction] = useState({
        recipients: [{
            address: "addr_test1qqsjrwqv6uyu7gtwtzvhjceauj8axmrhssqf3cvxangadqzt5f4xjh3za5jug5rw9uykv2klc5c66uzahu65vajvfscs57k2ql",
            amount: "3",
            mintedAssets: [{
                assetName: "MyNFT", quantity: '1', policyId: "Example PolicyID",
                policyScript: "ExamplePolicy"
            }]
        }]
    })

    useEffect(() => {
        const defaultDate = new Date();
        defaultDate.setTime(defaultDate.getTime() + (1 * 60 * 90 * 1000))
        setPolicyExpiration(defaultDate);

    }, [])
    useEffect(() => {
        t()
        if (connected) {
            getAddress()
            getBalance()
        }
    }, [])

    async function t() {

        const S = await Cardano();
        nami = new NamiWalletApi(
            S,
            window.cardano,
            blockfrostApiKey
        )


        if (await nami.isInstalled()) {
            await nami.isEnabled().then(result => { setConnected(result) })

        }
    }


    const connect = async () => {
        // Connects nami wallet to current website 
        await nami.enable()
            .then(result => {
                console.log(result)
                setConnected(result)
            })
            .catch(e => console.log(e))
    }

    const getAddress = async () => {
        // retrieve address of nami wallet
        if (!connected) {
            await connect()
        }
        await nami.getAddress().then((newAddress) => { console.log(newAddress); setAddress(newAddress) })
    }


    const getBalance = async () => {
        if (!connected) {
            await connect()
        }
        await nami.getBalance().then(result => { console.log(result); setNfts(result.assets); setBalance(result.lovelace) })
    }


    const buildTransaction = async () => {
        if (!connected) {
            await connect()
        }

        const recipients = [{ "address": recipientAddress, "amount": amount }]
        let utxos = await nami.getUtxosHex();
        const myAddress = await nami.getAddress();

        let netId = await nami.getNetworkId();
        const t = await nami.transaction({
            PaymentAddress: myAddress,
            recipients: recipients,
            metadata: null,
            utxosRaw: utxos,
            networkId: netId.id,
            ttl: 3600,
            multiSig: MultiTrans
        })
        console.log(t)
        setTransaction(t)
        if (transaction) {
            signTransaction()
            if (witnesses) {
                submitTransaction()
                history.go(0)
            }
        }

    }




    const buildFullTransaction = async () => {
        if (!connected) {
            await connect()
        }
        try {
            const recipients = complexTransaction.recipients
            const metadataTransaction = complexTransaction.metadata
            console.log(metadataTransaction)
            let utxos = await nami.getUtxosHex();

            const myAddress = await nami.getAddress();
            console.log(myAddress)
            let netId = await nami.getNetworkId();

            const t = await nami.transaction({
                PaymentAddress: myAddress,
                recipients: recipients,
                metadata: metadataTransaction,
                utxosRaw: utxos,
                networkId: netId.id,
                ttl: 3600,
                multiSig: null
            })
            setBuiltTransaction(t)
            const signature = await nami.signTx(t)
            console.log(t, signature, netId.id)
            const txHash = await nami.submitTx({
                transactionRaw: t,
                witnesses: [signature],

                networkId: netId.id
            })
            console.log(txHash)
            setComplextxHash(txHash)
        } catch (e) {
            console.log(e)
        }
    }


    const signTransaction = async () => {
        if (!connected) {
            await connect()
        }

        const witnesses = await nami.signTx(transaction)
        setWitnesses(witnesses)
    }

    const submitTransaction = async () => {
        console.log(witnesses)

        let netId = await nami.getNetworkId();
        const txHash = await nami.submitTx({
            transactionRaw: transaction,
            witnesses: [witnesses],

            networkId: netId.id
        })
        setTxHash(txHash)

    }

    const createPolicy = async () => {
        console.log(policyExpiration)
        try {
            await nami.enable()


            const myAddress = await nami.getHexAddress();

            let networkId = await nami.getNetworkId()
            const newPolicy = await nami.createLockingPolicyScript(myAddress, networkId.id, policyExpiration)

            setPolicy(newPolicy)
            setComplexTransaction((prevState) => {
                const state = prevState; state.recipients[0].mintedAssets[0].policyId = newPolicy.id;
                state.recipients[0].mintedAssets[0].policyScript = newPolicy.script;
                state.metadata = {
                    "721": {
                        [newPolicy.id]:
                            { [state.recipients[0].mintedAssets[0].assetName]: { name: "MyNFT", description: "Test NFT", image: "ipfs://QmUb8fW7qm1zCLhiKLcFH9yTCZ3hpsuKdkTgKmC8iFhxV8" } }
                    }
                };
                return { ...state }
            })

        } catch (e) {
            console.log(e)
        }

    }

    console.log(address)

    console.log(MultiTrans)
    return (<>
        <div className="flex flex-1 bg-blue-400 absolute h-full w-screen">
            <div className='mx-auto relative'>
                <div className='flex flex-row justify-center'>
                    <div className='flex flex-col gap-2 bg-green-300 rounded-b-full px-24 py-16'>

                        <div className='flex flex-col items-center capitalize text-white font-semibold text-lg'>
                            <p>Nami Wallet Support</p>
                        </div>
                        <div className='flex flex-col items-center'>
                            <button className={`${connected ? "bg-white px-4 py-2 text-neutral-200 rounded-lg" : "hover:bg-cyan-600 bg-cyan-400 px-4 py-2 rounded-lg text-white"}`} onClick={connect} > {connected ? "Connected" : "Connect to Nami"} </button>
                        </div>
                    </div>

                </div>
                <div className='flex flex-row justify-center mt-2'>
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-row'>
                            <div class=" relative ">
                                <label for="required-email" class="text-white">
                                    Address
                                    <span class="text-red-500 required-dot">
                                        *
                                    </span>
                                </label>
                                <input type="text" id="required-email" class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="address" placeholder="Address" onChange={(event) => setRecipientAddress(event.target.value.toString())} />
                            </div>
                        </div>
                        <div className='flex flex-row'>

                            <div class="flex relative w-full">
                                <span class="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                                    ₳
                                </span>
                                <input type="number" id="email-with-icon" class=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-max py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="ada" placeholder="0.0000" onChange={(event) => setAmount(event.target.value.toString())} />
                            </div>

                        </div>
                        <div className='flex flex-row justify-center items-center'>
                            <div className="mb-3 flex flex-col">
                                <div class="relative inline-block w-10 mr-2 align-middle select-none">
                                    <input type="checkbox" name="toggle" id="Blue" class="checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" onChange={(event) => setMultiTrans(event.target.checked)} />
                                    <label for="Blue" class="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                                    </label>
                                </div>
                                <span class="text-white font-medium">
                                    Multi Send
                                </span>
                            </div>
                        </div>
                        <button className={`${(transaction) ? "bg-white px-4 py-2 text-neutral-200 rounded-lg" : "hover:bg-green-600 bg-green-300 px-4 py-2 rounded-lg text-white"}`} onClick={() => { if (amount && recipientAddress) buildTransaction() }}> Build Transaction</button>
                    </div>
                </div>
            </div>
            {/* <div className="container">


                <div className="row" >
                    <h1> 3. Retrieve your balance and NFTs</h1>
                </div>
                <div className="row" >
                    <button className={`button ${balance ? "success" : ""}`} onClick={getBalance}> Get Your Balance and NFTs </button>
                    {balance && <> <div className="column" >
                        <div className="item balance"><p>Balance ₳:  {balance / 1000000.} </p>

                        </div>


                        {nfts.map((nft) => {
                            return <><div className="item nft"><p>unit: {nft.unit}</p>
                                <p>quantity: {nft.quantity}</p>
                                <p>policy: {nft.policy}</p>
                                <p>name: {nft.name}</p>
                                <p>fingerprint: {nft.fingerprint}</p>
                            </div>
                            </>

                        })}
                    </div>
                    </>
                    }

                </div>
                <div className="row" >
                    <h1> 4. Build Transaction</h1>
                </div>
                <div className="row" >
                    <button className={`button ${(transaction) ? "success" : ""}`} onClick={() => { if (amount && recipientAddress) buildTransaction() }}> Build Transaction</button>
                    <div className="column" >



                        <div className="item address"><p> Amount</p><input style={{ width: "400px", height: "30px", }}
                            value={amount}
                            onChange={(event) => setAmount(event.target.value.toString())} /></div>

                        <div className="item address"><p> Recipient Address</p>
                            <input style={{ width: "400px", height: "30px" }}
                                value={recipientAddress}
                                onChange={(event) => setRecipientAddress(event.target.value.toString())} /></div>

                    </div>




                </div>

                <div className="row" >
                    <h1> 5. Sign Transaction</h1>
                </div>
                <div className="row" >
                    <button className={`button ${(witnesses) ? "success" : ""}`} onClick={() => { if (transaction) signTransaction() }}> Sign Transaction</button>
                    <div className="column" >






                    </div>
                </div>
                <div className="row" >
                    <h1> 6. Submit Transaction</h1>
                </div>
                <div className="row" >
                    <button className={`button ${(txHash) ? "success" : ""}`} onClick={() => { console.log(witnesses); if (witnesses) submitTransaction() }}> Submit Transaction</button>

                    <div className="column" >
                        <div className="item address">
                            <p>TxHash:  {txHash} </p>
                        </div>





                    </div>

                </div>
                <div className="row" >
                    <h1> 7. Create Policy Script</h1>
                </div>
                <div className="row" >
                    <button className={`button ${(policy) ? "success" : ""}`} onClick={() => { if (policyExpiration) createPolicy() }}> Create Policy</button>

                    <div className="column" >
                        <p>Set Policy Expriaton Date: <DateTimePicker

                            onChange={setPolicyExpiration}
                            value={policyExpiration}
                            minDate={new Date()}
                        />
                        </p>
                        <div className="item address">

                            <p>policyId:  {policy?.id} </p>
                            <p>policyScript:  {policy?.script} </p>
                            <p>paymentKeyHash:  {policy?.paymentKeyHash} </p>
                            <p>ttl:  {policy?.ttl} </p>
                        </div>





                    </div>

                </div>



            </div>



            <div className="row" >
                <h1> 8. Build Full Transaction (incl. Minting)</h1>
            </div>
            <div className="row" >
                <button className={`button ${(complextxHash) ? "success" : ""}`} onClick={buildFullTransaction}> Build Transaction</button>
                <div className="column" >


                    <div className="item address">
                        <p>Complex TxHash:  {complextxHash} </p>
                    </div>

                    <div className="item address"><p> Recipients Input</p><textarea style={{ width: "400px", height: "500px", }}
                        value={JSON.stringify(complexTransaction)}
                        onChange={(event) => { setComplexTransaction((prevState) => ({ ...JSON.parse(event.target.value) })) }} />
                    </div>




                    <div className="item address"><p>Transaction Hash: </p> <textarea style={{ width: "400px", height: "500px", }}
                        value={builtTransaction} />

                    </div>
                </div>



            </div> */}


        </div>

    </>
    )
}



