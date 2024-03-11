import express, { Express, Request, Response } from 'express';
import expressOasGenerator, { SPEC_OUTPUT_FILE_BEHAVIOR } from 'express-oas-generator';
import { StatusCodes } from 'http-status-codes';
import { apiRouter } from './modules/router';
import { corsMiddleware } from './middlewares/cors';
import errorMiddleware from './middlewares/error.middleware';
import { sendUserVerificationEmail } from './utils/send-email';

export function bootstrapApp(): Express {
	const app = express();

	expressOasGenerator.handleResponses(app, {
		specOutputPath: 'swagger.json',
		writeIntervalMs: 2000,
		swaggerUiServePath: 'docs',
		specOutputFileBehavior: SPEC_OUTPUT_FILE_BEHAVIOR.PRESERVE,
		swaggerDocumentOptions: {
			version: '3.0.3',
		},
	});
	app.use(express.json());

	app.options('*', corsMiddleware);
	app.use(corsMiddleware);

	app.use('/api', apiRouter);

	app.use('/ping', (req: Request, res: Response) => {
		res.status(StatusCodes.OK).send('pong');
	});

	app.post('/send-email', async (req, res) => {
		const { to } = req.body;

		try {
			// Send the email
			await sendUserVerificationEmail(to, 'Test', 'This is a test email from the API.');
			res.status(200).send('Email sent successfully');
		} catch (error) {
			console.error('Error sending email:', error);
			res.status(500).send('Internal Server Error');
		}
	});

	app.use(errorMiddleware);
	expressOasGenerator.handleRequests();
	return app;
}
