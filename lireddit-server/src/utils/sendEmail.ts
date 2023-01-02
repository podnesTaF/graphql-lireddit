/** @format */

import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, html: string) => {
  // let testAccount = await nodemailer.createTestAccount();
  // console.log('s', testAccount);

  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'qndqwloiphb6w4zu@ethereal.email',
      pass: 'MYenqb9KpAxjmWHFUm',
    },
  });

  let info = await transporter.sendMail({
    from: '"Hello everybody apodnes@gmail.com"',
    to,
    subject: 'Change password',
    html,
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview Url: %s', nodemailer.getTestMessageUrl(info));
};
