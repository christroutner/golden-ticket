"use strict"
const BITBOXSDK = require("bitbox-sdk")
const BITBOX = new BITBOXSDK()
const converter = require("json-2-csv")
const fs = require("fs")
const addresses = []
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// Open the wallet generated with generate-wallet.
const main = async () => {
  const wfn = `motherShipWallet.json`
  const filename = `${__dirname}/../output/wallets/${wfn}`

  let mnemonicObj
  try {
    mnemonicObj = require(filename)
  } catch (err) {
    console.log(
      `Could not open goldenTicketWallet.json. Generate a mnemonic with generate-wallet first.
      Exiting.`
    )
    process.exit(0)
  }

  const addressCount = mnemonicObj.mothership.children

  // root seed buffer
  const rootSeed = BITBOX.Mnemonic.toSeed(mnemonicObj.mnemonic)

  // master HDNode
  const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed)

  // HDNode of BIP44 account
  const bip44 = BITBOX.HDNode.derivePath(masterHDNode, `m/44'/145'`)
  for (let i = 0; i <= addressCount; i++) {
    await sleep(1100)
    // derive the ith external change address HDNode
    const node = BITBOX.HDNode.derivePath(bip44, `0'/0/${i}`)

    // get the cash address
    const cashAddress = BITBOX.HDNode.toCashAddress(node)
    const details = await BITBOX.Address.details([cashAddress])

    const wif = BITBOX.HDNode.toWIF(node)

    const value = 1

    const obj = {
      cashAddress: cashAddress,
      wif: wif,
      claimed: details[0].balance === 0
    }
    obj.value = value

    addresses.push(obj)
    console.log(i, cashAddress, wif, value, obj.claimed)
  }
  converter.json2csv(addresses, json2csvCallback)
}
main()

function json2csvCallback(err, csv) {
  if (err) throw err
  fs.writeFile(`${__dirname}/../output/csv/check-addresses.csv`, csv, err => {
    if (err) return console.error(err)
    console.log(`check-addresses.csv written successfully.`)
  })
}
