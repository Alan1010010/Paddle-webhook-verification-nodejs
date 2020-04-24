const crypto = require('crypto');
const Serialize = require('php-serialize');
const express = require( 'express' );
const bodyParser = require("body-parser");
const app = express();

// Parses urlencoded webhooks from paddle to JSON with keys sorted alphabetically ascending and values as strings
app.use(bodyParser.urlencoded({ extended: true }));

// Webhook request handling
app.post("/", (req, res) => {
  if (validateWebhook(req.body)) {
    console.log('WEBHOOK_VERIFIED');
    res.status(200).end();
  } else {
    res.sendStatus(403);
    console.log('WEBHOOK_NOT_VERIFIED')
  }
})

app.listen( 8080, () => console.log( 'Node.js server started on port 8080.' ) );

// Public key from your paddle dashboard
const pubKey = `-----BEGIN PUBLIC KEY-----

-----END PUBLIC KEY-----`

function validateWebhook(jsonObj) {
    // Grab p_signature
    const mySig = Buffer.from(jsonObj.p_signature, 'base64');
    // Remove p_signature from object - not included in array of fields used in verification.
    delete jsonObj.p_signature;
    // Serialise remaining fields of jsonObj
    const serialized = Serialize.serialize(jsonObj);
    // verify the serialized array against the signature using SHA1 with your public key.
    const verifier = crypto.createVerify('sha1');
    verifier.update(serialized);
    verifier.end();

    const verification = verifier.verify(pubKey, mySig);
    // Used in response if statement
    return verification;
}
