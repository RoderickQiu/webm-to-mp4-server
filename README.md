# WebM to MP4 Convert Server

This is a simple web server that converts WebM files to MP4 files. It is built using `express` and `webm-to-mp4` via Node.js.

This project is built, because I needed to convert WebM files, which is the only applicable file format for recording videos inside a browser, to MP4 files in a web application. The conversion is done on the server side, because the conversion library is not available in the browser.

## Installation

```bash
npm install
node convert.cjs
```

The server will be running on `http://localhost:3000`.

Or, you may set `PORT` environment variable in `.env` file.

## Usage

A typical usage:

```javascript
try {
    const response = await axios.post(`http://localhost:3000/convert`, {
        // Send the webm video in base64 string without the data URL prefix
        videoData: base64Video
    }, {
        responseType: 'arraybuffer' // Ensure the response is received as an array buffer
    });

    // Create a Blob from the response data
    const blob = new Blob([response.data], { type: 'video/mp4' });

    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Release the object URL
    URL.revokeObjectURL(url);
} catch (error) {
    console.error('Error sending base64 video:', error);
}
```

Roderick Qiu, 2025.