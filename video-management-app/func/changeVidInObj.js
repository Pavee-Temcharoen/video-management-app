
function changeVidInObj(reqForm,mainDB) {
    try {
        let newData = convertFormDataToObj(reqForm); // create new data as obj
        delete mainDB[reqForm.vID]; // delete old vid
        mainDB[reqForm.vID] = newData; // add to old Data
        return mainDB
    } catch (err) { console.error("Error convert req to Obj", err); }
};

function convertFormDataToObj(reqForm) {

    let output = {};
    // Name
    output["vName"] = reqForm["vName"] || "Unknown";

    // Feat
    if (reqForm["vFeat"]) { output["vFeat"] = reqForm["vFeat"].split("+") }
    else {output["vFeat"] = [ "Unknown(Unknown)" ] }
    // Artist
    if (reqForm["vArtist"]) { output["vArtist"] = reqForm["vArtist"].split("+") }
    else {output["vArtist"] = [ "Unknown" ] }
    // Package
    /* if (reqForm["vPackage"]) { output["vPackage"] = reqForm["vPackage"].split("+") }
    else {output["vPackage"] = [] } */
    // Tag
    if (reqForm["vTag"]) { output["vTag"] = reqForm["vTag"].split("+") }
    else {output["vTag"] = [] }
    // Score
    output["vScore"] = reqForm["vScore"] || 0 ;
    // Upload
    output["vUpload"] = new Date().toISOString().split('T')[0];
    // View
    output["vView"] = 0;
    // Link

    return output
}

// Export
//*************************************************
module.exports = changeVidInObj;
