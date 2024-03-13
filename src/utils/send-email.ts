import nodemailer from 'nodemailer';
import { LogHelper } from './log-helper';
import verifyUserTemplate from '../templates/verify-user.template';

interface SendEmailOptions {
	to: string;
	subject: string;
	text?: string;
	html?: string;
	title?: string;
}

export const sendMail = async (options: SendEmailOptions) => {
	try {
		const mailOptions = {
			...options,
			from: `${options.title || 'Mekteb app'} <${process.env.EMAIL_USER}>`, // sender address
		};

		const transporter = nodemailer.createTransport({
			service: 'Gmail',
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_APP_PASSWORD,
			},
		});
		await transporter.sendMail(mailOptions);
		transporter.close();
	} catch (err) {
		LogHelper.error('Error sending email:', err);
	}
};

export const sendUserVerificationEmail = async (to: string, name: string, token: string) => {
	try {
		await sendMail({
			to,
			title: 'Mekteb app',
			subject: 'Verify your account',
			html: verifyUserTemplate(name, `${process.env.FRONTEND_URL}/verify/${token}`),
		});
	} catch (err) {
		LogHelper.error('Error sending verification email:', err);
		throw err;
	}
};
