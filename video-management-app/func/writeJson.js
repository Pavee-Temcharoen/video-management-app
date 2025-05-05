const fsp = require('fs').promises;

async function writeJson(jsonPath,data) {
    try {
        await fsp.writeFile(jsonPath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing JSON file:", err);
        return null;
    }
};

// Export
//*************************************************
module.exports = writeJson;
