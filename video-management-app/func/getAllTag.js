function getAllTag(videoObj) {
    const tagGroups = {};
  
    for (const vid of Object.values(videoObj)) {
      for (const tag of vid.vTag || []) {
        const match = tag.match(/(.*)\((.*)\)/);
        let tagName, category;
  
        if (match) {
          tagName = match[1].trim();
          category = match[2].trim();
        } else {
          tagName = tag.trim();
          category = 'Unclassified';
        }
  
        if (!tagGroups[category]) tagGroups[category] = new Set();
        tagGroups[category].add(tagName);
      }
    }
  
    // Convert sets to arrays and sort them
    for (const key in tagGroups) {
      tagGroups[key] = [...tagGroups[key]].sort();
    }
  
    return tagGroups;
  }
  


// Export
//*************************************************
module.exports = getAllTag;