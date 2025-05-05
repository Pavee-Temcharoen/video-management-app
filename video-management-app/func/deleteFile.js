const fsp = require('fs').promises;

async function deleteFile(path) {
    try {
        await fsp.unlink(path);
        console.log(`File deleted: ${path}`);
    } catch (err) {
        console.error(`Failed to delete file: ${path}`, err);
    }
}

// Export
//*************************************************
module.exports = deleteFile;
