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
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA0KnQongaimSiCjLTUBPH
ag9/CON8s2Ex/Hp+qu5f+peDoQQ3+Vk4ssG47AK7Svw7FvKWsAGHhnUlE21RV3pI
btgnRLer0IY10tGPAHfuwmQFooOSlSHh5LKmBz7FAM9vD9wW7UX1YshAnVMcSV62
ct6KFimneqzfdiCAnPlcWFgGLZOd6TKLCS0EnM04UO9TnekDWtuZuMHe1hTH1ImL
QEO8sjpP6UXtOwmutdcf7Au2+TJMzVtlnaojmFZUFyZ4sx8IxJPEBPbXV6veH4zn
oTsMDhEDOlA6rgRwe1xNnPV8V39IJ09mY/UDsPadCNRijLZk/KPTaaTEC70v+g/5
+rViT65DLsVw5oxMTh5t+Ra6a2QjBvIla6LWIcxmwwg1vr3FFRfRe4435gvaxJUy
pBXT3k6oe4HuydlJX09ygZVXv1MvDpIRsUrwhQ1bSLZQ+0WAv9carJVYaSRAXhRq
CHxnbdPiFZLue5Eyr1/f9VdV98zSoPqlJcJlhu19wvIParkT344xK40stNaj40pR
Hu3rtcvsEjLz+VFXrZVThBTzMJNHLCI+bZgIWwb5PyKtYp5V4BDbiMX8zrTKbu0F
3ZyA3jAA9y/FempnaQVJ+/9JdXqBdSDRrscTC52GjSCpAgHHj2JipW9rf+1kCjJ1
aJWSqSaxevTTXmZbhqYZGt8CAwEAAQ==
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
