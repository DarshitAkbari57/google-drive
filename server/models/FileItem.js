const mongoose = require('mongoose');

const fileItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['folder', 'file'], required: true },
    url: { type: String, default: '' },
    createdId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'FileItem', default: null },
}, { timestamps: true });

module.exports = mongoose.model('FileItem', fileItemSchema);
