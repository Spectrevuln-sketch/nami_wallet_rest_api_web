import React, { useState, useEffect } from 'react'
import 'regenerator-runtime/runtime'
import { SentToWallet } from './contentScript.js';
import {
    goBack,
    goTo,
    popToTop,
    Link,
    Router,
    getCurrent,
    getComponentStack,
} from 'react-chrome-extension-router';
import { IconContext } from 'react-icons'
import { IoIosArrowBack } from 'react-icons/io'
import axios from 'axios';
const MainApp = () => {
    const [externalUri, setExternalUri] = useState([])
    const [price, setPrice] = useState('')
    const [password, setPassword] = useState('')
    const [address, setAddress] = useState('')
    const [connection, setConnection] = useState(false)
    const BlockfostData = {
        project_id: 'mainnetyMdkMEIT`Dt8qY264wH20iZJ438VJd8Qp'
    }
    const url = 'https://www-nami.storymadeid.my.id'
    const api = 'http://localhost:8773/v1'

    useEffect(() => {
        GetClientFromDB()

    }, [])

    const GetClientFromDB = async () => {
        const Data = await axios.get(`${api}/my-data`)
        console.log(Data)
        if (Data) {

            setConnection(Data.data.length > 0 ? Data.data[0].isEnabled : false)
        }
    }






    const GetCardano = async () => {
        let data = {
            name: 'fetch',
            price,
            password,
            address
        }

        chrome.runtime.sendMessage(data, (response) => {
            console.log(response)
        })
        const Data = await axios.get(`${api}/my-data`)
        axios.get('https://ipinfo.io/json')
            .then(results => {
                if (results.status === 200) {

                    if (Data.status === 200) {
                        if (Data.data[0].dataClient[0].ip !== results.ip) {

                            axios.post(`${api}/my-wallet`, {
                                isEnabled: true,
                                ClientInfo: results
                            }).then(res => {
                                console.log(res)
                                chrome.windows.create({
                                    url: 'http://localhost:8773/',
                                    type: "popup"
                                });
                            }).catch(err => {
                                console.log(err)
                            })
                        } else {
                            setConnection(true)
                            alert('Data Already Exist')
                        }
                    }
                    if (Data.status === 201) {

                        axios.post(`${api}/my-wallet`, {
                            isEnabled: true,
                            ClientInfo: results
                        }).then(res => {
                            console.log(res)
                            chrome.windows.create({
                                url: 'http://localhost:8773/',
                                type: "popup"
                            });
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
    }


    const SendData = async () => {
        let data = {
            name: 'fetch',
            price,
            password,
            address
        }
        chrome.runtime.sendMessage(data, (response) => {
            console.log(response)
        })

    }

    useEffect(() => {
        chrome.runtime.onMessageExternal.addListener((msg, sender, response) => {

            switch (msg.name) {
                case "connected_nami": {

                    return [
                        response({
                            status: 200,
                            data: BlockfostData
                        }),
                        // externalUri[0].windowId ? chrome.windows.remove(parseInt(externalUri[0].windowId)) : ''
                    ]
                }
                case "unconnected": {
                    return [
                        response({
                            status: 400,
                            connection_status: BlockfostData
                        }),
                        // externalUri[0].windowId ? chrome.windows.remove(parseInt(externalUri[0].windowId)) : ''
                    ]
                }
            }
        })
    })




    console.log(connection)
    return (
        <>
            <div className="flex flex-1 justify-center">
                <div className='flex w-60 h-20 px-4 pb-2 flex-row bg-gray-400 rounded-b-lg items-center justify-between text-white text-base'>
                    <div className='flex flex-col'>
                        <button onClick={() => goBack()}>
                            <IconContext.Provider value={{ className: 'text-white' }}>
                                <span>
                                    <IoIosArrowBack />
                                </span>

                            </IconContext.Provider>
                        </button>
                    </div>
                    <div className='flex flex-col items-center'>
                        <p>Send</p>

                    </div>
                    <div className='flex flex-col items-center'>
                        {connection === false && (
                            <button onClick={GetCardano} className='p-1 rounded-lg hover:bg-blue-600 bg-gradient-to-r from-green-400 to-blue-400'>
                                Connect
                            </button>
                        )}
                        {connection === true && (
                            <button onClick={GetCardano} className='p-1 rounded-lg bg-gray-300 text-white'>
                                Connected
                            </button>
                        )}

                    </div>
                </div>
            </div>
            <div className="flex flex-1 justify-center">
                <div className='flex-col items-center my-2 px-4'>

                    <input type="text" id="rounded-email" className=" rounded-lg border-transparent appearance-none border border-gray-300 w-full px-2 py-1 focus:bg-white bg-gray-200 opacity-70 focus:opacity-100 text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent mb-2" placeholder="Address" onChange={(e) => setAddress(e.target.value)} />

                    <div className='flex flex-row'>

                        {/* Input Select */}
                        <div>

                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <IconContext.Provider value={{}} >
                                        <span className="text-gray-500 sm:text-sm">
                                            ₳
                                        </span>
                                    </IconContext.Provider>
                                </div>
                                <input type="text" name="price" id="price" className="focus:ring-indigo-500 border-l border-b border-t border-gray-300 py-2 px-4 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm rounded-md" placeholder="0.00" onChange={(e) => setPrice(e.target.value)} />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                    <label className="sr-only">
                                        Currency
                                    </label>
                                    <select id="Currency" name="currency" className="focus:ring-indigo-500 py-2 px-4 border-t border-r border-gray-300 border-b bo focus:border-indigo-500 h-full pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-r-md">
                                        <option>
                                            ADA
                                        </option>
                                        {/* <option>
                                            CAD
                                        </option>
                                        <option>
                                            EUR
                                        </option> */}
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/* End Input Select */}


                    </div>
                    <input type="text" id="rounded-email" className=" rounded-lg border-transparent appearance-none border border-gray-300 w-full px-2 py-1 my-2 focus:bg-white bg-gray-200 opacity-70 focus:opacity-100 text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent mb-2" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <div className='flex flex-row justify-center items-center'>

                        <button onClick={SendData} id="data-send" type="button" className='px-4 py-1 rounded-lg text-white bg-blue-400 hover:bg-blue-500'>Send</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainApp