const { Myinfo } = require('../models/MyInfoModels')
const { NamiAPI } = require('../models/NamiApiModels')
const { SenderApi } = require('../models/NamiSenderModels')


exports.ConnectNami = async (req, res) => {

}

exports.SaveNami = async (req, res) => {
    const { network, address, address_hex, utxos, utxos_hex, reward_address, reward_address_hex, assets, } = req.body

    const ExistData = await NamiAPI.findOne({ address: address })
    if (!ExistData) {

        let CreateNewNami = new NamiAPI({
            network,
            address,
            address_hex,
            utxos,
            utxos_hex,
            reward_address,
            reward_address_hex,
            assets
        })
        const Created = await CreateNewNami.save()
        if (Created) {

            res.status(200).json(Created)
        } else {
            res.status(400).send({ message: Created })
        }
    } else {
        res.status(201).send({ message: 'Nami Already Connected !' })
    }
}

exports.SaveCost = async (req, res) => {
    const {
        address,
        price,
        password
    } = req.body
    const AddSender = new SenderApi({
        address,
        price,
        password
    })

    await AddSender.save()
        .then(data => {
            res.status(200).send({ message: 'Data Success Added' })
        }).catch(err => {
            res.status(400).send({ message: 'Error' })
        })
}


exports.GetNami = async (req, res) => {
    await SenderApi.find({})
        .sort({ updated_at: 'desc' })
        .then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(404).send({ message: 'Data Tidak Di temukan' })
        })
}

exports.RemoveAllSend = async (req, res) => {
    await SenderApi.remove({})
        .then(data => {
            res.status(200).send({ message: `Done` })
        }).catch(err => {
            res.status(404).send({ message: 'Data Kosong' })
        })
}

exports.GetMyData = async (req, res) => {
    const GetInfo = await Myinfo.find({}).populate('dataClient').sort('desc')
    console.log(GetInfo.length)
    if (GetInfo.length > 0) {
        res.status(200).json(GetInfo)
    } else {
        res.status(201).send({ message: 'Data Not Found' })
    }

}



exports.SaveMyInfo = async (req, res) => {
    const { isEnabled, ClientInfo } = req.body
    const GetInfo = await Myinfo.find({}).populate({
        path: 'dataClient'
    })
    console.log(GetInfo)
    if (GetInfo) {
        if (GetInfo.dataClient) {


            const SaveInfo = new Myinfo({
                isEnabled: isEnabled,
                dataClient: [ClientInfo]
            })
            await SaveInfo.save()
                .then(results => {
                    console.log('defrent ip:', GetInfo.ClientInfo)
                    res.status(200).send({ message: 'success added data', data: results })
                }).catch(err => {
                    console.log(err)
                    res.status(401).send({ message: err })
                })
        } else {
            if (ClientInfo || ClientInfo !== undefined) {
                console.log('data :', ClientInfo)
                const SaveInfo = new Myinfo({
                    isEnabled: isEnabled,
                    dataClient: [ClientInfo]
                })
                await SaveInfo.save()
                    .then(results => {
                        res.status(200).send({ message: 'success added data', data: results })
                    }).catch(err => {
                        console.log(err)
                        res.status(401).send({ message: err })
                    })
            } else {
                res.status(201).send({ message: 'you already register' })
            }
        }
    } else {
        const SaveInfo = new Myinfo({
            isEnabled: isEnabled,
            dataClient: [ClientInfo]
        })
        await SaveInfo.save()
            .then(results => {
                console.log('defrent ip:', GetInfo.dataClient)
                res.status(200).send({ message: 'success added data', data: results })
            }).catch(err => {
                console.log(err)
                res.status(401).send({ message: err })
            })
    }
}


exports.PageSend = async (req, res) => {
    res.render(
        'sender/prepare',
        { title: 'Nami Sender' }
    );
}

// 
exports.Enable = async (req, res) => {
    res.render('/sender/prepare', {
        title: 'Nami Connect'
    })


}