import multer from 'multer';

const extensionsMap = new Map([
    ['image/png', 'png'],
    ['image/jpeg', 'jpg'],
]);

const generateFileName = (extension) => {
    const firstPart = Date.now().toString();
    const secondPart = Math.random().toString().substring(3, 12);

    return `${firstPart}_${secondPart}.${extension}`;
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        
        if (extensionsMap.has(file.mimetype)) {
            const extension = extensionsMap.get(file.mimetype);
            
            cb(null, generateFileName(extension)); //Appending .jpg
        } else {
            cb(new Error(`Unsupported mime type: ${file.mimetype}`));
        }
    },
});

export default storage;