//*************************************************************************************
// REQUIRE & SETTING
//*************************************************************************************
//----------
// module //
//----------
const path = require('path');
const methodOverride = require('method-override');
const multer = require('multer');
const fs = require('fs'); const fsp = require('fs').promises;
const express = require('express'); const app = express();
//--------------
// middleware //
//--------------
app.use(express.urlencoded({ extended: true })) //To parse form data in POST request body:
app.use(express.json()) // To parse incoming JSON in POST request body:
app.use(methodOverride('_method')) // To 'fake' put/patch/delete requests:
app.use(express.static(path.join(__dirname/* , '../' */))); /* './public' */
//-----------
// setting //
//-----------
app.set('views', path.join(__dirname, 'views')) // Views folder and EJS setup:
app.set('view engine', 'ejs')

//*************************************************************************************
// EXTERNAL FILE
//*************************************************************************************

// Files Altering
const upload = require('./func/upload');
const readJson = require('./func/readJson');
const writeJson = require('./func/writeJson');
const deleteFile = require('./func/deleteFile');

// Obj Altering
const createDataObj = require('./func/createDataObj');
const filterVidObj = require('./func/filterVidObj');
const filterVidObjEvery = require('./func/filterVidObjEvery');
const addNewVidToObj = require('./func/addNewVidToObj');
const changeVidInObj = require('./func/changeVidInObj');
const changePlaylistInObj = require('./func/changePlaylistInObj');
const generateId = require('./func/generateId');
const getAllVidFromPlaylist = require('./func/getAllVidFromPlaylist');
const deleteFromObjById = require('./func/deleteFromObjById');
const deleteIdFromPlaylistObj = require('./func/deleteIdFromPlaylistObj');
const getAllTag = require('./func/getAllTag');

//*************************************************************************************
// Variable
//*************************************************************************************

// path
let jsonVidPath = "./db/dataVid/dataVid.json"
let jsonPlaylistPath = "./db/dataVid/dataPlaylist.json"
let vidDir = "./db/dataVid/vid";
let tbnDir = "./db/dataVid/tbn";

// obj
let allVidObj ;
let allDataObj ;
let allPlaylistObj ;
let filterObj = {
    feat: "",
    artist: "",
    input:"",
    tagPositive:[],
    tagNegative:[]
}

/* let packageObj = {
    a1: [],
    a2: [],
    a3: []
} */

//*************************************************************************************
// ROUTER
//*************************************************************************************

//------------
// get MAIN //
//------------
app.get('/main',async (req, res) => {
    // read all video from json
    allVidObj = await readJson(jsonVidPath);
    // get data from all video 
    allDataObj = await createDataObj(allVidObj);

    res.render('01main/main',{});
})

//-----------
// get Add //
//-----------
app.get('/main/add',async (req, res) => {

    let id =  generateId()
    // read all video from json
    allVidObj = await readJson(jsonVidPath);
    allPlaylistObj = await readJson(jsonPlaylistPath);
    // get data from all video 
    allDataObj = await createDataObj(allVidObj);

    res.render('02add/add',{ allDataObj , allPlaylistObj , id });
})

//------------
// post Add //
//------------
app.post('/main/add', upload.fields([ { name: 'vidFile', maxCount: 1 }, { name: 'tbnFile', maxCount: 1 } ]),async (req, res) => {

    console.log("request",req.body)
    if (!req.files) {return res.status(400).send('No files uploaded.');}

    // write data to vid
    let oldJsonData = await readJson(jsonVidPath);
    let newJsonData = addNewVidToObj(req.body,oldJsonData);
    writeJson(jsonVidPath,newJsonData);

    // add to playlist
    let playlistName = req.body.vPackage, vID = req.body.vID
    if( playlistName ){
        allPlaylistObj = await readJson(jsonPlaylistPath);

        let playlistArr = playlistName.split("+");
        playlistArr.forEach(each => { allPlaylistObj[each]?.push(vID); });
  
        await writeJson(jsonPlaylistPath,allPlaylistObj);
    }
    
    res.redirect('/main');
});

//-----------
// get Data //
//-----------
app.get('/main/data',async (req, res) => {

    // read all video from json
    allVidObj = await readJson(jsonVidPath);
    let tagGroups = getAllTag(allVidObj);
    console.log(tagGroups)

    res.render('08data/08data',{ allVidObj , tagGroups});
})

//--------------
// get Filter //
//--------------
app.get('/main/filter',async (req, res) => {
    // read all video from json
    allVidObj = await readJson(jsonVidPath);
    // get data from all video 
    allDataObj = await createDataObj(allVidObj);

    res.render('03filter/filter',{ allDataObj });
})

//---------------
// Post Filter //
//---------------
app.post('/main/filter',async (req, res) => {
    // filter by req
    if (req.body.filterType == "some") {
        allVidObjFiltered = filterVidObj(allVidObj, req.body);
    }
    else {
        allVidObjFiltered = filterVidObjEvery(allVidObj, req.body);
    }
    
    let playlist = "Custom-Playlist"

    res.render('04show/show',{ allVidObjFiltered ,playlist });
})

//----------------
// get Playlist //
//----------------
app.get('/main/playlist',async (req, res) => {
    // read all vid & playlist from json
    allVidObj = await readJson(jsonVidPath);
    allPlaylistObj = await readJson(jsonPlaylistPath);

    res.render('05playlist/playlist',{ allPlaylistObj });
})

//-----------------
// Post Playlist //
//-----------------
app.post('/main/playlist',async (req, res) => {
    allVidObj = await readJson(jsonVidPath);
    allPlaylistObj = await readJson(jsonPlaylistPath);

    let playlist = req.body.playlistName
    let idArr = allPlaylistObj[playlist];
    allVidObjFiltered = getAllVidFromPlaylist(idArr,allVidObj);

    res.render('04show/show',{ allVidObjFiltered, playlist });
})

//------------
// get Edit //
//------------
app.get('/main/:id',async (req, res) => {

    // read all video from json
    allVidObj = await readJson(jsonVidPath);
    allDataObj = await createDataObj(allVidObj);
    
    const id = req.params.id ;
    const vidObj = { [id] : allVidObj[id] }

    if ( vidObj[id] ) { res.render('06edit/edit',{ allVidObj,allDataObj,vidObj }) }
    else { res.render('00error/error') } 
})

//--------------
// patch Edit //
//--------------
app.patch('/main/:id',async (req, res) => {

    // write data to vid
    let oldJsonData = await readJson(jsonVidPath);
    let newJsonData = changeVidInObj(req.body,oldJsonData);
    writeJson(jsonVidPath,newJsonData);
    
    res.redirect('/main');
});

//---------------
// Delete Edit //
//---------------
app.delete('/main/:id',async (req, res) => {

    const { id } = req.params;

    // delete from dataVid
    allVidObj = await readJson(jsonVidPath);
    allVidObj = deleteFromObjById(id, allVidObj);
    await writeJson(jsonVidPath,allVidObj);

    // delete from dataPlaylist
    allPlaylistObj = await readJson(jsonPlaylistPath);
    allPlaylistObj = deleteIdFromPlaylistObj(id, allPlaylistObj);
    await writeJson(jsonPlaylistPath,allPlaylistObj);

    // delete file
    await deleteFile(`./db/dataVid/vid/${id}.mp4`)
    await deleteFile(`./db/dataVid/tbn/${id}.jpg`)
 
    res.redirect('/main');
});

//---------------------
// get playlist edit //
//---------------------
app.get('/main/playlist/:title',async (req, res) => {

    // read all video from json
    allVidObj = await readJson(jsonVidPath);
    allPlaylistObj = await readJson(jsonPlaylistPath);
    
    let title = req.params.title ;
    let playlistObj = { [title] : allPlaylistObj[title] }
    console.log(title)
    // new playlist
    if ( title === "NewPlaylist" ) {
        title = "Playlist " + generateId()
        playlistObj = { [title] : [] }
        res.render('07editPlaylist/editPlaylist',{ playlistObj , title , allVidObj })
        return
    }
    // exist playlist
    if ( playlistObj[title] ) {
        res.render('07editPlaylist/editPlaylist',{ playlistObj , title , allVidObj }) 
    }
    else { res.render('00error/error') } 
})

//-----------------------
// patch playlist edit //
//-----------------------
app.patch('/main/playlist/edit',async (req, res) => {

    console.log(req.body);
    allPlaylistObj = await readJson(jsonPlaylistPath);
    let newJsonData = changePlaylistInObj(req.body,allPlaylistObj);
    await writeJson(jsonPlaylistPath,newJsonData);
 
    res.redirect('/main/playlist');
});

//------------------------
// delete playlist edit //
//------------------------
app.delete('/main/playlist/edit',async (req, res) => {
    let name = req.body.namePlaylistOld;
    allPlaylistObj = await readJson(jsonPlaylistPath);
    delete allPlaylistObj[name]
    await writeJson(jsonPlaylistPath,allPlaylistObj);

    res.redirect('/main/playlist');
})


//*************************************************************************************
// LISTENING
//*************************************************************************************
app.listen(3000, () => {
    console.log("ON PORT 3000!")
})

