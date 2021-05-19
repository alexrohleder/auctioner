import sendgrid from "@sendgrid/mail";

if (process.env.SENDGRID_KEY) {
  sendgrid.setApiKey(process.env.SENDGRID_KEY);
}

const mail = sendgrid;

export default mail;
