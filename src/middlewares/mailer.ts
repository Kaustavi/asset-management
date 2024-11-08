import { transporter } from "@src/utils/nodemailer";
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

const emailTemplate = fs.readFileSync(path.join(__dirname, "../email-template/index.handlebars"), "utf-8");

const template = handlebars.compile(emailTemplate);

const messageBody = (template({
  name: "David Islo", 
  interviewer: "Scott Greenwich"
}));

export const transportMailer = async (newEmployee: any) => {
    await transporter.sendMail({
        from: 'kaustavi@trial-351ndgwe1yrgzqx8.mlsender.net', // Your email
        to: newEmployee.email, // Receiver email
        subject: 'Welcome to Our Service!',
        text: 'Thank you for signing up! We’re excited to have you on board.',
        html: messageBody
    });
};
