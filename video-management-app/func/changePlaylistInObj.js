
function changePlaylistInObj(reqForm,mainDB) {
    try {
        let newData = reqForm.idArray.split("+"); // create new data as obj
        delete mainDB[reqForm.namePlaylistOld]; // delete old vid
        mainDB[reqForm.namePlaylist] = newData; // add to old Data
        return mainDB
    } catch (err) { console.error("Error convert req to Obj of Playlist", err); }
};

// Export
//*************************************************
module.exports = changePlaylistInObj;
