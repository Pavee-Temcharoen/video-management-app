function deleteIdFromPlaylistObj(id, obj) {
    const newObj = {};

    for (const [playlist, idList] of Object.entries(obj)) {
        newObj[playlist] = idList.filter(vid => vid !== id);
    }

    return newObj;
}
// Export
//*************************************************
module.exports = deleteIdFromPlaylistObj;