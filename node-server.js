const crypto = require('crypto');
const Serialize = require('php-serialize');
const express = require( 'express' );
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  console.log(req.body);
  validateWebhook(req.body);
  res.status(200).end(); // Responding is important
})

app.listen( 8080, () => console.log( 'Node.js server started on port 8080.' ) );


// const generator = () => {
//   var result           = '';
//   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   var charactersLength = 12;
//   for ( var i = 0; i < charactersLength; i++ ) {
//      result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// }



// Node.js & Express implementation
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

function ksort(obj){
    const keys = Object.keys(obj).sort();
    let sortedObj = {};
    for (let i in keys) {
      sortedObj[keys[i]] = obj[keys[i]];
    }

    return sortedObj;
  }

function validateWebhook(jsonObj) {
    const mySig = Buffer.from(jsonObj.p_signature, 'base64');
    delete jsonObj.p_signature;
    // Need to serialize array and assign to data object
    jsonObj = ksort(jsonObj);
    for (let property in jsonObj) {
        if (jsonObj.hasOwnProperty(property) && (typeof jsonObj[property]) !== "string") {
            if (Array.isArray(jsonObj[property])) { // is it an array
                jsonObj[property] = jsonObj[property].toString();
            } else { //if its not an array and not a string, then it is a JSON obj
                jsonObj[property] = JSON.stringify(jsonObj[property]);
            }
        }
    }
    const serialized = Serialize.serialize(jsonObj);
    // End serialize data object
    const verifier = crypto.createVerify('sha1');
    verifier.update(serialized);
    verifier.end();

    const verification = verifier.verify(pubKey, mySig);

    if (verification) {
        return 'Yay! Signature is valid!';
    } else {
        return 'The signature is invalid!';
    }
}

