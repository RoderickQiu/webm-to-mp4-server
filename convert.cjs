const express = require('express');
const webmToMp4 = require('webm-to-mp4');
const fs = require('fs');
const path = require('path');
const app = express();

app.post('/convert', async (req, res) => {
    try {
        const chunks = [];

        // Collect the binary data from the request
        req.on('data', (chunk) => {
            chunks.push(chunk);
        });

        req.on('end', async () => {
            const webmBuffer = Buffer.concat(chunks);

            // Convert the webmBuffer to mp4
            const arrayBuffer = await webmToMp4(webmBuffer);

            // Convert ArrayBuffer to Buffer
            const mp4Buffer = Buffer.from(arrayBuffer);

            // Define the path to save the file
            const filePath = path.join(__dirname, 'video.mp4');

            // Save the MP4 buffer to a file
            fs.writeFile(filePath, mp4Buffer, (err) => {
                if (err) {
                    console.error('Error saving file:', err);
                    return res.status(500).send('Internal server error');
                }

                // Send the file in the response
                res.setHeader('Content-Type', 'video/mp4');
                res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
                res.sendFile(filePath, (err) => {
                    if (err) {
                        console.error('Error sending file:', err);
                        res.status(500).send('Internal server error');
                    } else {
                        // Optionally, delete the file after sending
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error('Error deleting file:', err);
                            }
                        });
                    }
                });
            });
        });
    } catch (error) {
        console.error('Error during conversion:', error);
        res.status(500).send('Internal server error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
