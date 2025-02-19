const express = require('express');
const webmToMp4 = require('webm-to-mp4');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

require('dotenv').config();
const app = express();

app.use(cors({
    origin: '*', // Allow requests from any origin
}));

app.use(express.json({ limit: '50mb' })); // Increase the limit if needed

app.post('/convert', async (req, res) => {
    try {
        const videoData = req.body['videoData'];
        console.log('Received base64 video content', videoData.length);

        // Decode the base64 string to get the WebM buffer
        const webmBuffer = Buffer.from(videoData, 'base64');

        // Define the path to save the WebM file
        const webmFilePath = path.join(__dirname, 'video.webm');

        // Save the WebM buffer to a file
        fs.writeFile(webmFilePath, webmBuffer, async (err) => {
            if (err) {
                console.error('Error saving WebM file:', err);
                return res.status(500).send('Internal server error');
            }

            try {
                // Convert the webmBuffer to mp4
                const arrayBuffer = await webmToMp4(webmBuffer);

                // Convert ArrayBuffer to Buffer
                const mp4Buffer = Buffer.from(arrayBuffer);

                // Define the path to save the MP4 file
                const mp4FilePath = path.join(__dirname, 'video.mp4');

                // Save the MP4 buffer to a file
                fs.writeFile(mp4FilePath, mp4Buffer, (err) => {
                    if (err) {
                        console.error('Error saving MP4 file:', err);
                        return res.status(500).send('Internal server error');
                    }

                    // Send the file in the response
                    res.setHeader('Content-Type', 'video/mp4; charset=utf-8');
                    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
                    res.sendFile(mp4FilePath, (err) => {
                        if (err) {
                            console.error('Error sending file:', err);
                            res.status(500).send('Internal server error');
                        }
                    });
                });
            } catch (conversionError) {
                console.error('Error during conversion:', conversionError);
                res.status(500).send('Internal server error');
            }
        });
    } catch (error) {
        console.error('Error during processing:', error);
        res.status(500).send('Internal server error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
