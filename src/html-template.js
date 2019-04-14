/*
  This file encodes the html template for the golden ticket.
*/

"use strict"

const htmlTemplate = function(wifQR) {
  return `
  <body style="padding: 0; margin: 0;">
    <div style="border: 1px solid black; width: 350px; height: 400px; padding: 25px;">
      <center>
      <p>Here is a tip in Bitcoin Cash!</p>
      <p>Scan the QR code below with a BCH wallet to collect your tip.</p>
      <img src='${wifQR}' />
      <p>Need a wallet? Get one here:</p>
      </center>
      <ul style="padding-left: 75px;">
      <li>Phone: wallet.bitcoin.com</li>
      <li>Web Browser: badger.bitcoin.com</li>
      </ul>
    </div>
  </body>
`
}

module.exports = htmlTemplate
