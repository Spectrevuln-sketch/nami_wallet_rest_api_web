

exports.NamiWallet = async (walletObj, blockfrostApiKey, serializationLib) => {
    const NamiObj = walletObj
    return NamiObj
}
const isEnabled = async () => {
    console.log(NamiWallet)
    return await NamiWallet.isEnabled()
}

exports.enable = async () => {
    if (!await isEnabled()) {
        try {
            return await NamiWallet.enable()
        } catch (error) {
            throw error
        }
    }
}

