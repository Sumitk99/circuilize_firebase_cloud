import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as cors from 'cors';

admin.initializeApp();

const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
};

const corsHandler = cors(corsOptions);

export const detectCircles = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }

        try {
            const { image } = req.body;
            if (!image) {
                res.status(400).send('Bad Request: imageBase64 is required');
                return;
            }

            const imgBuffer = Buffer.from(image, 'base64');
            const imgPath = '/tmp/image.jpg';
            fs.writeFileSync(imgPath, imgBuffer);

            const scriptPath = path.join(__dirname, 'detect_circles.py');
            const output = childProcess.execSync(`python3 ${scriptPath} ${imgPath}`);
            const result = JSON.parse(output.toString());

            const processedImgBuffer = fs.readFileSync(imgPath);
            const processedImgBase64 = processedImgBuffer.toString('base64');

            res.json({
                circleCount: result.circleCount,
                processedImage: processedImgBase64
            });
        } catch (error) {
            console.error('Error processing image:', error);
            res.status(500).send('Internal Server Error');
        }
    });
});
