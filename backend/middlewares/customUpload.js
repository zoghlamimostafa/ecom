const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');

const customUpload = (req, res, next) => {
  console.log("\n🚀 CUSTOM UPLOAD HANDLER");
  
  const files = [];
  const busboy = Busboy({ 
    headers: req.headers,
    limits: {
      fileSize: 500 * 1024 * 1024, // 500MB
      files: 50
    }
  });

  let fileCount = 0;
  let filesCompleted = 0;

  busboy.on('file', (fieldname, file, info) => {
    fileCount++;
    const { filename, encoding, mimeType } = info;
    console.log(`📁 Receiving file ${fileCount}: ${filename} (${mimeType})`);
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const newFilename = `images-${uniqueSuffix}.jpeg`;
    const savePath = path.join(__dirname, '../public/images', newFilename);
    
    console.log(`💾 Saving to: ${newFilename}`);
    
    const writeStream = fs.createWriteStream(savePath);
    file.pipe(writeStream);
    
    let fileSize = 0;
    file.on('data', (data) => {
      fileSize += data.length;
    });
    
    file.on('end', () => {
      console.log(`📦 File stream ended: ${newFilename}`);
    });
    
    writeStream.on('finish', () => {
      filesCompleted++;
      console.log(`✅ File saved ${filesCompleted}/${fileCount}: ${newFilename} (${fileSize} bytes)`);
      files.push({
        fieldname,
        originalname: filename,
        filename: newFilename,
        path: savePath,
        size: fileSize,
        mimetype: mimeType
      });
      
      // Si tous les fichiers sont terminés, passer au next()
      if (filesCompleted === fileCount) {
        console.log(`🎉 ALL FILES COMPLETED - Calling next()`);
        req.files = files;
        next();
      }
    });
    
    writeStream.on('error', (err) => {
      console.error(`❌ Write error: ${err.message}`);
    });
  });

  busboy.on('finish', () => {
    console.log(`� BUSBOY FINISHED EVENT - ${fileCount} fichiers reçus, ${filesCompleted} complétés`);
    // Ne pas appeler next() ici, le faire dans writeStream.on('finish')
    // pour être sûr que tous les fichiers sont écrits
    if (fileCount === 0) {
      // Aucun fichier reçu
      req.files = [];
      next();
    }
  });

  busboy.on('error', (err) => {
    console.error('❌ BUSBOY ERROR:', err);
    res.status(500).json({ message: 'Upload error', error: err.message });
  });

  // IMPORTANT: Ne pas consommer req si body-parser l'a déjà fait
  // Vérifier si req est readable
  if (req.readable) {
    console.log("✅ req is readable, piping to busboy");
    req.pipe(busboy);
  } else {
    console.log("⚠️ req is NOT readable, trying to recover...");
    // Essayer de reconnecter busboy
    busboy.end(req.body);
  }
};

module.exports = customUpload;
