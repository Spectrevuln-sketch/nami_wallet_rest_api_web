/** window Worked Here */
import { async } from 'regenerator-runtime';
import Loader from './Loader'
import axios from 'axios'
const Nami = window.cardano
const api = 'http://localhost:8773/v1'





window.nami_support = {
    ...(window.nami_support || {}),
    enable: () => enable(),
    isEnabled: () => isEnabled(),
    myInfo: () => ClientInfo(),
    SaveMyData: () => SaveMyData()
}




async function ClientInfo() {
    return await axios.get('https://ipinfo.io/json')
        .then(results => {
            return results.data
        })
        .catch(err => {
            console.log(err)
        })
}



/**WEB Function */
async function isEnabled() {
    return await Nami.isEnabled()
}


async function enable() {
    if (!await isEnabled()) {
        try {
            await Nami.enable()
        } catch (error) {
            throw error
        }
    }
}

// await enable()

async function SaveMyData() {
    const Client = await ClientInfo()
    const Cardano = await isEnabled()
    const Data = await axios.get(`${api}/my-data`)
    if (Data.status === 200) {
        if (Data.data[0].dataClient[0].ip !== Client.ip) {

            axios.post(`${api}/my-wallet`, {
                isEnabled: Cardano,
                ClientInfo: Client
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        } else {
            console.log('Data Already Exist')
        }
    }
    if (Data.status === 201) {

        axios.post(`${api}/my-wallet`, {
            isEnabled: Cardano,
            ClientInfo: Client
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }
}


    // window.nami_support = {
        //     ...(window.nami_support || {}),
//     SendCost: () => SendCost,
//     _event: {}
// }







