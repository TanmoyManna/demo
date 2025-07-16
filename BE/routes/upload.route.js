const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        const time = Date.now();
        const extension = file.originalname.split('.').pop();
        const finalFileName = `image-${time}.${extension}`;
        cb(null, finalFileName);
    }
})
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const filter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, PNG, and WEBP files are allowed'), false);
    }
}

const upload = multer({ storage: storage, fileFilter: filter, limits: { fileSize: 2 * 1024 * 1024 } });

const fileModel = require('../models/file.model')
module.exports = (app) => {
    app.post('/interview/api/v1/upload-image', upload.single('image'), async (req, res, next) => {
        if (req.file) {
            console.log(req.file)
            const obj = {
                fileUrl: `http://localhost:8000/${req.file.path}`
            };
            try {
                const savedFile = await fileModel.create(obj)
                return res.status(201).send({ msg: 'Image uploaded successfully', imageUrl: savedFile.fileUrl })
            } catch (e) {
                console.log('Error while uploading images', e)
                return res.status(500).send({ msg: 'Internal server error' })
            }
        } else {
            res.status(400).send({ msg: 'Invalid file format' })
        }
    })

    app.get('/interview/api/v1/images', async (req, res, next) => {
        try {
            const savedFiles = await fileModel.find({}).sort({ createdAt: -1 });
            return res.status(201).send({ msg: 'Fetched files successfully', data: savedFiles })
        } catch (e) {
            console.log('Error while fetching files', e)
            return res.status(500).send({ msg: 'Internal server error' })
        }
    })
}