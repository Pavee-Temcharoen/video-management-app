const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Directories for each file
      const dir1 = './db/dataVid/vid'; const dir2 = './db/dataVid/tbn';
  
      if (!fs.existsSync(dir1)) { fs.mkdirSync(dir1, { recursive: true });}// Ensure dir exist, if not, create them
      if (!fs.existsSync(dir2)) { fs.mkdirSync(dir2, { recursive: true });}
  
      // Store file1 in dir1, file2 in dir2
      if (file.fieldname === 'vidFile') { cb(null, dir1);} 
      else if (file.fieldname === 'tbnFile') { cb(null, dir2);}
    },
    filename: (req, file, cb) => {
      // Get custom filename from form
      const customFilename = req.body.vID;
  
      const fileExtension = path.extname(file.originalname); // Ensure filename has correct extension
  
      cb(null, customFilename + fileExtension); // Set filename to be same custom name with extension
    }
});

const upload = multer({ storage: storage }); // Initialize multer with the storage configuration

module.exports = upload;