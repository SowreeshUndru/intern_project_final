const multer= require('multer');
const path = require('path');
const storage=multer.memoryStorage();
const upload=multer({
    storage:storage,
    
    fileFilter:(req,file,cb)=>{
        const ext=path.extname(file.originalname);
        if(ext!=='.jpg' && ext!=='.jpeg' && ext!=='.png'){
            return cb(new Error('Only images are allowed'));
        }
        cb(null,true);
    }
}).single('image');

module.exports=upload;