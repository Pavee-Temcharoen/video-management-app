const fsp = require('fs').promises;

// Main Function
//*************************************************
async function createDataObj(allVidObj) {
    let output = { feat: {}, tag: {}, artist: {} };

    try {
        const idArray = Object.keys(allVidObj); // ["id1", "id2", "id3"]

        // Add All Data From allVidObj to output
        idArray.forEach(id => {

            // feat
            let featArr = allVidObj[id]["vFeat"]; // [ char1(serie1), char2(serie1) ]
            featArr.forEach(feat => {

                if ( isGroup(feat) ){
                    let char = parseStr(feat)[0] , serie = parseStr(feat)[1];
                    updateOutputData("feat",output, char, serie);
                    // char = char1 , serie = serie1
                }
                else {
                    let char = feat , serie = "Ungroup";
                    updateOutputData("feat",output, char, serie);
                }
                
            });

            //tag
            let tagArr = allVidObj[id]["vTag"]; // [ subtype1(type1), subtype2(type1) ]
            tagArr.forEach(tag => {
                let subtype = parseStr(tag)[0] , type = parseStr(tag)[1];
                updateOutputData( "tag", output, subtype, type);
            });
            
            //artist
            let artistArr = allVidObj[id]["vArtist"]; // [A1,A2,A3]
            artistArr.forEach(artist => { updateArtist( output, artist); });
        });
        return output;
    } catch (err) {
        console.error("Error in createDataObj:", err); return null
    }
}

// Helping Function (Feat,Tag)
//*************************************************

// update data for Feat & Tag
function updateOutputData( key, output, char, serie) {
    // Update or Create serie/type
    if(!output[key][serie]){ output[key][serie] = {} }

    // Update or Create char/subtype
    output[key][serie][char] ? output[key][serie][char]++ : output[key][serie][char] = 1;
}

// "char1(serie1)"" => ["char1","serie1"]
function parseStr(str) {
    try {
        let left = str.split('(')[0].trim();
        let right = str.split('(')[1].replace(')', '').trim();
        return [left,right];
      } catch (error) {
        console.error(`Error parsing "${str}"  :`, error);
        return [NaN,NaN];
      }
}

// lion(feline) => true  lion,loin[feline] => false 
function isGroup(str) {
    const regex = /^[^()]+\(.*?\)$/;
    return regex.test(str);
}

// Helping Function (Artist)
//*************************************************
function updateArtist( output, artist) {
    // Update or Create char/subtype
    output["artist"][artist] ? output["artist"][artist]++ : output["artist"][artist] = 1;
}

// Export
//*************************************************
module.exports = createDataObj;


