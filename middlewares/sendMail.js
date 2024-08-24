import { createTransport } from "nodemailer";

const sendMail = async (email, subject, text) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  await transport.sendMail({
    from: process.env.MAIL_EMAIL,
    to: email,
    subject,
    text,
  });
};

export default sendMail;
