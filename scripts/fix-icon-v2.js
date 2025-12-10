const fs = require('fs');

// 64x64 grey square base64
const iconBase64 = "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAARklEQVRo3u3PQREAAAgDMCD/PotbwM3GqYHA1932wMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDwLQA9tQCR/rE3bAAAAABJRU5ErkJggg==";

try {
    fs.writeFileSync('public/icon.png', Buffer.from(iconBase64, 'base64'));
    console.log("Success: Wrote public/icon.png");
} catch (e) {
    console.error("Error writing file:", e);
}
