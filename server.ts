import geoip from 'fast-geoip';
import express from 'express';
import {spawn} from 'child_process';
import {existsSync} from 'fs';

export default async function getDoxInfo(
	req: express.Request
): Promise<string[]> {
	const funnyLines: string[] = [];

	// Check for x-forwarded-for header
	const {ip} = req;
	funnyLines.push(`IP: ${ip}`);

	// Get port
	funnyLines.push(`Port: ${req.socket.localPort}`);

	// Get geoip info
	const geo = await geoip.lookup(ip);
	if (geo) {
		funnyLines.push(`Country: ${geo.country}`);
		funnyLines.push(`Region: ${geo.region}`);
		funnyLines.push(`City: ${geo.city}`);
		funnyLines.push(`Timezone: ${geo.timezone}`);
		funnyLines.push(`Latitude: ${geo.ll[0]}`);
		funnyLines.push(`Longitude: ${geo.ll[1]}`);
	}

	// Get http version
	funnyLines.push(`HTTP Version: ${req.httpVersion}`);

	// Get user agent
	const userAgent = req.get('User-Agent');
	if (userAgent) {
		funnyLines.push(`User Agent: ${userAgent}`);
	}

	// Get referer
	const referer = req.get('Referer');
	if (referer) {
		funnyLines.push(`Referer: ${referer}`);
	}

	// Get path
	funnyLines.push(`Path: ${req.path}`);

	return funnyLines;
}

if (require.main === module) {
	const app = express();

	// Enable trust proxy
	app.enable('trust proxy');

	app.get('/', async (req, res) => {
		const outputVideo = `${__dirname}/out/${req.ip}.mp4`;

		if (existsSync(outputVideo)) {
			res.sendFile(outputVideo);
			return;
		}

		const funnyLines = await getDoxInfo(req);
		const env = {
			...process.env,
			REMOTION_DOX_LINES: JSON.stringify(funnyLines),
		};
		const child = spawn(
			'npx',
			['remotion', 'render', 'src/index.tsx', 'MyComp', outputVideo],
			{
				env,
			}
		);
		// Log output
		child.stdout.on('data', (data) => {
			console.log(data.toString());
		});

		// Wait for the child process to exit
		await new Promise((resolve) => {
			child.on('exit', resolve);
		});
		res.sendFile(outputVideo);
	});

	app.listen(3091, '0.0.0.0');
}
