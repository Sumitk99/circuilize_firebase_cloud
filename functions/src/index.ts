import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

admin.initializeApp();

export const detectCircles = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) {
            res.status(400).send('Bad Request: imageBase64 is required');
            return;
        }

        // Decode the base64 image and save it to a file
        const imgBuffer = Buffer.from(imageBase64, 'base64');
        const imgPath = '/tmp/image.jpg';
        fs.writeFileSync(imgPath, imgBuffer);

        // Run the Python script to detect circles
        const scriptPath = path.join(__dirname, 'detect_circles.py');
        const output = childProcess.execSync(`python3 ${scriptPath} ${imgPath}`);
        const result = JSON.parse(output.toString());

        // Read the processed image and encode it back to base64
        const processedImgBuffer = fs.readFileSync(imgPath);
        const processedImgBase64 = processedImgBuffer.toString('base64');

        res.json({
            circleCount: result.circleCount,
            processedImageBase64: processedImgBase64
        });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).send('Internal Server Error');
    }
});
