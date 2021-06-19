const Mailgen = require("mailgen");
require("dotenv").config();

class EmailService {
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case "development":
        this.link = "http://localhost:3000/";
        break;

      case "production":
        this.link = "link fro production";
        break;

      default:
        this.link = "http://localhost:3000/";
        break;
    }
  }

  #createTemplateEmailMassege(verifyToken) {
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        // Appears in header & footer of e-mails
        name: "Dmitriy Kramskiy",
        link: "https://mailgen.js/",
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
      },
    });

    const email = {
      body: {
        name: "Dmitriy Kramskiy",
        intro:
          "Welcome to System Sender! We're very excited to have you on board.",
        action: {
          instructions: "To get started with System Sender, please click here:",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Confirm your account",
            link: `${this.link}api/users/verify/${verifyToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    return mailGenerator.generate(email);
  }

  async sendVerifyEmail(verifyToken, email) {
    const emailHtml = this.#createTemplateEmailMassege(verifyToken);
    const msg = {
      to: email, // Change to your recipient
      from: process.env.SENDER_EMAIL,
      subject: "Verify your account",
      html: emailHtml,
    };

    const result = await this.sender.send(msg);
    console.log(result);
  }
}

module.exports = EmailService;
