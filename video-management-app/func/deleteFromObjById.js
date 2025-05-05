function deleteFromObjById(id, obj) {
    const newObj = { ...obj };
    delete newObj[id];
    return newObj;
}

// Export
//*************************************************
module.exports = deleteFromObjById;
