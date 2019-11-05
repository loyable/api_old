const request = require("request");
const md5 = require("md5");

class SMS {
  constructor(phone) {
    this.phone = phone;
  }

  expired(time) {
    if (time) {
      const remaining = (time - Date.now()) / (60 * 1000);
      return remaining <= 0;
    }
    return true;
  }

  generateHash() {
    // 6 numbers random
    const code = Math.floor(100000 + Math.random() * 900000);

    this.code = code;

    if (process.env.NODE_ENV === "development") {
      console.log(`SMS token for phone ${this.phone}:`, `${code}`.bold.green);
    }

    return md5(`${process.env.SMS_TOKEN_SALT}${code.toString()}`);
  }

  verifyHash(code, hash) {
    return hash === md5(`${process.env.SMS_TOKEN_SALT}${code.toString()}`);
  }

  async send() {
    await request.post({
      url: process.env.SMS_API_URL,
      oauth: {
        consumer_key: process.env.SMS_API_KEY,
        consumer_secret: process.env.SMS_API_SECRET
      },
      json: true,
      body: {
        sender: "Loyable",
        message: `Il tuo codice di verifica è: ${this.code}`,
        recipients: [{ msisdn: this.phone }]
      }
    });
  }
}

module.exports = SMS;
