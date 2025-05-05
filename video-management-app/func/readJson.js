const fsp = require('fs').promises;

async function readJson(jsonPath) {
    try {
        const data = await fsp.readFile(jsonPath, "utf8");
        const jsonData = JSON.parse(data);
        return jsonData;
    } catch (err) {
        console.error("Error reading JSON file:", err);
        return null;
    }
}

// Export
//*************************************************
module.exports = readJson;



