const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const authenticate = require('../middleware/auth');
const {
    createFolder,
    uploadFile,
    getFileStructure,
    renameItem,
    deleteItem,
    previewFile
} = require('../controllers/fileController');

router.post('/create-folder', authenticate, createFolder);
router.post('/upload/:folderId', authenticate, upload.single('file'), uploadFile);
router.post('/upload', authenticate, upload.single('file'), uploadFile)
router.get('/structure', authenticate, getFileStructure);
router.put('/rename/:id', authenticate, renameItem);
router.delete('/delete/:id', authenticate, deleteItem);
router.get('/preview/:id', authenticate, previewFile);

module.exports = router;
