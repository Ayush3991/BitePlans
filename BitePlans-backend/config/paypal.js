const axios = require("axios");

const getPayPalAccessToken = async () => {
  const base64Credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const response = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("PayPal Auth Error:", error.response?.data || error.message);
    throw new Error("Unable to get PayPal access token");
  }
};

module.exports = { getPayPalAccessToken };
