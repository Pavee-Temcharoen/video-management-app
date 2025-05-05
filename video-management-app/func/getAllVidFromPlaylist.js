
function getAllVidFromPlaylist(idArr,allVidObj) {
    let output = {};
    idArr.forEach(id => {
        if( allVidObj[id] ){ output[id] = allVidObj[id]}
    });
    return output
}

// Export
//*************************************************
module.exports = getAllVidFromPlaylist;