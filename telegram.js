const axios = require("axios");

module.exports = async function sendTelegram(message) {
  try {
    const res = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML"
      }
    );

    console.log("TELEGRAM SENT ✔", res.data?.result?.message_id);
    return res.data;
  } catch (err) {
    console.error("TELEGRAM ERROR ❌", err.response?.data || err.message);
    return null;
  }
};
