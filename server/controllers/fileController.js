const FileItem = require('../models/FileItem');
const path = require('path');
const fs = require('fs');

// Create Folder
exports.createFolder = async (req, res) => {
    try {
        const { name, parentId } = req.body;
        const createdId = req.user.id;

        const newFolder = new FileItem({
            name,
            type: 'folder',
            createdId,
            parentId: parentId || null
        });

        await newFolder.save();

        res.status(201).json({ message: 'Folder created successfully', newFolder });
    } catch (err) {
        res.status(500).json({ message: 'Error creating folder', error: err.message });
    }
};

// Upload File
exports.uploadFile = async (req, res) => {
    try {
        const { folderId } = req.params;
        const { originalname, filename } = req.file;
        const createdId = req.user.id;

        const fileUrl = path.join('uploads', filename);

        const newFile = new FileItem({
            name: originalname,
            type: 'file',
            url: fileUrl,
            createdId,
            parentId: folderId || null
        });

        await newFile.save();

        res.status(201).json({ message: 'File uploaded', newFile });
    } catch (err) {
        res.status(500).json({ message: 'Error uploading file', error: err.message });
    }
};

// Get Tree Structure
const buildTree = (items, parentId = null) => {
    return items
        .filter(item => String(item.parentId) === String(parentId))
        .map(item => ({
            ...item.toObject(),
            children: buildTree(items, item._id)
        }));
};

exports.getFileStructure = async (req, res) => {
    try {
        const createdId = req.user.id;
        const allItems = await FileItem.find({ createdId });
        const tree = buildTree(allItems);
        res.json({ message: 'File structure fetched successfully', data: tree });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching structure', error: err.message });
    }
};

// Rename
exports.renameItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { newName } = req.body;

        const item = await FileItem.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        item.name = newName;
        await item.save();

        res.json({ message: 'Renamed successfully', item });
    } catch (err) {
        res.status(500).json({ message: 'Error renaming item', error: err.message });
    }
};

// Delete
const deleteRecursive = async (id) => {
    const children = await FileItem.find({ parentId: id });

    for (const child of children) {
        await deleteRecursive(child._id);
    }

    const item = await FileItem.findById(id);
    if (item?.type === 'file' && item.url) {
        fs.unlink(path.join(__dirname, '..', item.url), err => {
            if (err) console.warn('File deletion error:', err.message);
        });
    }

    await FileItem.deleteOne({ _id: id });
};

exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await FileItem.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        await deleteRecursive(id);

        res.json({ message: 'Deleted item and its children successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting item', error: err.message });
    }
};

// Preview
exports.previewFile = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await FileItem.findById(id);

        if (!item || item.type !== 'file') {
            return res.status(404).json({ message: 'File not found or not a file' });
        }

        res.json({
            name: item.name,
            type: item.type,
            url: `https://${req.get('host')}/${item.url}`
        });
    } catch (err) {
        res.status(500).json({ message: 'Error previewing file', error: err.message });
    }
};