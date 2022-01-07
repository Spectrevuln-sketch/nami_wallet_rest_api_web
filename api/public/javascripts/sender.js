
async function EnableNami() {

    const nami_lib = await import('nami-wallet-api')

    const Nami = await nami_lib.NamiWalletApi(
        window.cardano,
        "mainnetyMdkMEITDt8qY264wH20iZJ438VJd8Qp"
    )
    await Nami.enable()
    console.log('Connected To Nami ', await Nami.isEnabled())
}
EnableNami()