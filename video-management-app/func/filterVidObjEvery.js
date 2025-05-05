const fsp = require('fs').promises;

/* let filterInput = { feat: "char1(serie1)", artist: "artist1", input: "depend on user",
                    tagPositive: ["tag1","tag2"], tagNegative: ["tag3","tag4"]
} */

function filterVidObjEvery(allVidObj, filterObj) {

    if ( filterObj["tagPositive"] ) {filterObj["tagPositive"] =  filterObj["tagPositive"].split("+") }
    else { filterObj["tagPositive"] = [] }

    if ( filterObj["tagNegative"] ) { filterObj["tagNegative"] = filterObj["tagNegative"].split("+") }
    else { filterObj["tagNegative"] = [] }

    let output = {};

    // check each video
    for (const id in allVidObj) {
        const eachIdObj = allVidObj[id];

        let isMatch = true;

        // check each filter key
        for (const key in filterObj) {
            const val = filterObj[key]; // char1(serie1),artist1

            // Ignore "" or [] filters
            if (val === "" || (Array.isArray(val) && val.length === 0)) { continue; }

            // check feat
            if( key === "feat" ){
                if( !checkFeat(val,eachIdObj) ){ isMatch = false; break; };
            }

            //check artist
            if( key === "artist" ){
                if( !checkArtist(val,eachIdObj) ){ isMatch = false; break; };
            }

            //check input
            if( key === "input" ){
                if( !isCloseMatch(val,eachIdObj["vName"]) ){ isMatch = false; break; };
            }

            // check tagPositive
            if( key === "tagPositive" ){
                if( !checkTagP(val,eachIdObj) ){ isMatch = false; break; };
            }

            // check tagPositive
            if( key === "tagNegative" ){
                if( checkTagN(val,eachIdObj) ){ isMatch = false; break; };
            }

            // check Score
            if( key === "min" ){ if( parseFloat(eachIdObj["vScore"]) < parseFloat(val) ){ isMatch = false; break;} }
            if( key === "max" ){ if( parseFloat(eachIdObj["vScore"]) > parseFloat(val) ){ isMatch = false; break;} }
        }
        if (isMatch) { output[id] = eachIdObj; } // Add matching vid to output
    }

    return output;
}


// Helping Function check if include
//*************************************************

// eachIdObj = { vFeat:[],vArtist:[], ... } || val = char1(serie1) / ["tag1","tag2"]

function checkFeat(val,eachIdObj) { return val.split("+").every(elem => eachIdObj["vFeat"].includes(elem)); }

function checkArtist(val,eachIdObj) { return val.split("+").every(elem => eachIdObj["vArtist"].includes(elem)); }

function checkTagP(val,eachIdObj) { return val.every(elem => eachIdObj["vTag"].includes(elem)); }

function checkTagN(val,eachIdObj) { return val.some(elem => eachIdObj["vTag"].includes(elem)); }

// Helping Function name (Search Algoritm)
//*************************************************

function isCloseMatch(inputStr, str) {

    // Normalize
    inputStr = inputStr.toLowerCase().trim();
    str = str.toLowerCase().trim();

    // Exact match
    if (str === inputStr) return true;
    // Partial match
    if (str.includes(inputStr)) return true;

    // Fuzzy Match (any word in input appears)
    /* const inputWords = inputStr.split(" ");
    return inputWords.some(word => str.includes(word)); */
}



// Export
//*************************************************
module.exports = filterVidObjEvery;