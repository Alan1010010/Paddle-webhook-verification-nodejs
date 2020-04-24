# Paddle-webhook-verification-nodejs

This is an example of how to verify webhooks from the software billing and subscription management service [Paddle](www.paddle.com) written in node.js. 

## Getting started

If you haven't already, [sign up for a vendor account](https://vendors.paddle.com/login) with Paddle. Next, within "developer tools" on your Paddle dashboard, enable webhook alerts and set your webhook end point. For local development I recommend using [ngrok](https://ngrok.com/) to generate an external url which will tunnel to your localhost port.

Next, grab your public key from within the same section of your Paddle dashboard and replace it within the code. 

Then start your node server `$node node-server.js`

Then fire a test webhook from your Paddle dashboard and keep and eye on your terminal.

Happy verifying!


## License
This project is licensed under the MIT License - see the LICENSE.md file for details

This code example is not provided by nor supported by Paddle, and Paddle does not provide technical support or maintenance for this code or any derivations of it.
