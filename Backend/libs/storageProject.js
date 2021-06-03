const multer = require('multer')
const storage = multer.diskStorage({
     destination : function (req, file, cb){
         //console.log(req.body);
         cb(null, `./storage/img/`)
     },
     filename: function(req, file, cb){
         cb(null, `${file.fieldname}-${Date.now()}.png`)
     }
 })
 

 const upload = multer({storage})

 module.exports = upload