import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { LogHelper } from './log-helper';
import verifyUserTemplate from '../templates/verify-user.template';

interface SendEmailOptions {
	to: string;
	subject: string;
	text?: string;
	html?: string;
	title?: string;
}

const createTransporter = async () => {
	try {
		const oauth2Client = new google.auth.OAuth2(
			process.env.GCP_CLIENT_ID,
			process.env.GCP_CLIENT_SECRET,
			'https://developers.google.com/oauthplayground'
		);

		oauth2Client.setCredentials({
			refresh_token: process.env.GCP_REFRESH_TOKEN,
		});

		const accessToken = await new Promise((resolve, reject) => {
			oauth2Client.getAccessToken((err, token) => {
				if (err) {
					console.log('*ERR: ', err);
					reject();
				}
				resolve(token);
			});
		});

		// Create a Nodemailer transporter with OAuth2 authentication
		const smtpTransport = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: process.env.EMAIL_USER,
				clientId: process.env.GCP_CLIENT_ID,
				clientSecret: process.env.GCP_CLIENT_SECRET,
				refreshToken: process.env.GCP_REFRESH_TOKEN,
				accessToken: `${accessToken}`,
			},
		});
		return smtpTransport;
	} catch (err) {
		LogHelper.error('Error creating transporter:', err);
		return err;
	}
};

export const sendMail = async (options: SendEmailOptions) => {
	try {
		const mailOptions = {
			...options,
			from: `${options.title || 'Mekteb app'} <${process.env.EMAIL_USER}>`, // sender address
		};

		const smtpTransport = await createTransporter();
		smtpTransport.sendMail(mailOptions, (error, response) => {
			error ? console.log(error) : console.log(response);
			smtpTransport.close();
		});
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
	}
};
