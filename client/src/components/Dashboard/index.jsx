"use client";
import React, { useEffect, useState } from "react";
import {
  Folder,
  File,
  Upload,
  MoreVertical,
  FolderPlus,
  List,
  Grid,
  Pencil,
  Trash2,
  ExternalLink,
  X,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Button from "../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFile,
  getFileStructure,
  renameFile,
} from "@/redux/slices/filesSlice";
import { UploadModal } from "../Modals/UploadModal";
import { uploadFile } from "@/redux/thunks/uploadFile";
import { createFolder as createFolderThunk } from "@/redux/thunks/createFolder";
import { getPreview } from "@/redux/thunks/getPreview";
import { generatePopup } from "@/utils/toast";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose} // Add onClick to close the modal when the backdrop is clicked
    >
      {/* Modal without overlay */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6"
      >
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-red-500"
            variant="destructive"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

const RenameModelDialog = ({ isOpen, onClose, onSubmit, title, data }) => {
  const [newName, setNewName] = useState(""); // Always initialize state at the top

  useEffect(() => {
    if (data?.name) {
      setNewName(data.name); // Update the state when `data` is available
    }
  }, [data]); // This will run on every change in `data`

  if (!isOpen) return null; // Ensure modal is not rendered if `isOpen` is false

  const handleSubmit = () => {
    onSubmit(newName);
    onClose();
    setNewName(""); // Clear the input state after submit
  };

  const handleCancel = () => {
    onClose();
    setNewName(""); // Clear the input state on cancel
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6"
      >
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={handleCancel}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>

        {/* Input */}
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new name"
          className="w-full px-4 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 mb-6"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!newName.trim()}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

const CreateFolderModal = ({ isOpen, onClose, onSubmit }) => {
  const [folderName, setFolderName] = useState("");

  const handleSubmit = () => {
    if (folderName.trim()) {
      onSubmit(folderName.trim());
      setFolderName("");
      onClose();
    }
  };

  const handleCancel = () => {
    setFolderName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative z-10 w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={handleCancel}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Create New Folder
        </h2>

        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Folder name"
          className="w-full px-4 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 mb-6"
        />

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!folderName.trim()}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

const PreviewModal = ({ isOpen, onClose, file }) => {
  if (!isOpen || !file) return null;

  const previewUrl = file.url?.replace(/\\/g, "/") || ""; // Sanitize URL
  const fileType = file?.type || "";
  const fileName = file?.name || "";

  const extension = previewUrl.split(".").pop()?.toLowerCase() || "";

  const isImageExt = ["jpg", "jpeg", "png", "webp", "gif", "bmp"].includes(
    extension
  );
  const isImage = previewUrl.startsWith("image/") || isImageExt;
  const isPDF = previewUrl === "application/pdf" || previewUrl.endsWith(".pdf");
  const isText = previewUrl.endsWith(".txt");
  const isJSX = previewUrl.endsWith(".jsx");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Preview: {fileName}
        </h2>

        {isImage ? (
          <img
            src={previewUrl}
            alt={fileName}
            className="max-h-[60vh] mx-auto rounded"
          />
        ) : isPDF ? (
          <iframe
            src={previewUrl}
            className="w-full h-[70vh] rounded"
            title="PDF Preview"
          ></iframe>
        ) : isText || isJSX ? (
          <iframe
            src={previewUrl}
            className="w-full h-[70vh] rounded bg-white dark:bg-gray-900 text-left"
            title="Text Preview"
          ></iframe>
        ) : (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            No preview available for this file type.
          </p>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState("grid");
  const [currentFolder, setCurrentFolder] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToRename, setItemToRename] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data, loading, error } = useSelector((state) => state.files);

  const handleFilesUpload = (uploadedFiles) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    uploadedFiles.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        generatePopup("info", `File size exceeds the 2MB limit: ${file.name}`);
        return;
      }

      dispatch(uploadFile({ file, id: currentFolder || null }))
        .unwrap()
        .then((res) => {
          if (res.newFile) {
            generatePopup("success", res?.message);
            dispatch(getFileStructure()).then((res) => {
              const updatedStructure = res.payload?.data;
              if (currentFolder) {
                const folder = findItemById(updatedStructure, currentFolder);
                setFiles(folder?.children || []);
              } else {
                setFiles(updatedStructure);
              }
            });
          }
        })
        .catch((err) => {
          console.error("Upload error:", err);
        });
    });
  };

  useEffect(() => {
    dispatch(getFileStructure());
  }, [dispatch]);

  useEffect(() => {
    if (data?.data) {
      setFiles(data.data);
    }
  }, [data]);

  const [files, setFiles] = useState();

  const createFolder = async (folderName) => {
    try {
      const result = await dispatch(
        createFolderThunk({ name: folderName, parentId: currentFolder })
      );

      if (createFolderThunk.fulfilled.match(result)) {
        const updatedStructure = await dispatch(getFileStructure()).unwrap();

        // Use helper to find current folder again from the updated structure
        if (currentFolder) {
          const folder = findItemById(updatedStructure.data, currentFolder);
          setFiles(folder?.children || []);
        } else {
          setFiles(updatedStructure.data);
        }
      } else {
        console.error("Folder creation failed:", result.payload);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleRename = (data) => {
    setItemToRename(data);
    setIsRenameOpen(true);
  };

  const confirmRename = async (name) => {
    try {
      const resultAction = await dispatch(
        renameFile({ id: itemToRename?._id, newName: name })
      );

      if (renameFile.fulfilled.match(resultAction)) {
        const updatedStructure = await dispatch(getFileStructure()).unwrap();

        // Re-find the current folder and set the view accordingly
        if (currentFolder) {
          const folder = findItemById(updatedStructure.data, currentFolder);
          setFiles(folder?.children || []);
        } else {
          setFiles(updatedStructure.data);
        }
      } else {
        console.error("Rename failed:", resultAction.payload);
      }
    } catch (err) {
      console.error("Unexpected error during rename:", err);
    }
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const resultAction = await dispatch(deleteFile(itemToDelete));

      if (deleteFile.fulfilled.match(resultAction)) {
        generatePopup("success", resultAction?.payload);

        const updatedStructure = await dispatch(getFileStructure()).unwrap();

        if (currentFolder) {
          const folder = findItemById(updatedStructure.data, currentFolder);
          setFiles(folder?.children || []);
        } else {
          setFiles(updatedStructure.data);
        }
      } else {
        console.error("Delete failed:", resultAction.payload);
      }
    } catch (err) {
      console.error("Unexpected error during deletion:", err);
    }
  };

  const findParentId = (items, id, parentId = null) => {
    if (!Array.isArray(items)) return null;
    for (const item of items) {
      if (item._id === id) return parentId;
      if (Array.isArray(item.children)) {
        const result = findParentId(item.children, id, item._id);
        if (result) return result;
      }
    }
    return null;
  };

  const navigateBack = () => {
    const parentId = findParentId(data?.data, currentFolder);
    if (parentId) {
      handleOpenFolder(parentId);
    } else {
      setCurrentFolder(null);
      setFiles(data?.data); // root
    }
  };

  const findItemById = (items, id) => {
    if (!Array.isArray(items)) return null;
    for (const item of items) {
      if (item._id === id) return item;
      if (Array.isArray(item.children)) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleOpenFolder = (id) => {
    const folder = findItemById(data?.data, id);
    if (folder && folder.type === "folder") {
      setCurrentFolder(id);
      setFiles(folder.children || []);
    }
  };

  const handleFilePreview = async (id) => {
    try {
      const result = await dispatch(getPreview(id)).unwrap();

      if (result?.url) {
        setPreviewFile({ ...result, name: result.originalname }); // Adjust if your backend returns different keys
        setIsPreviewOpen(true);
      } else {
        generatePopup("error", "Preview not available");
      }
    } catch (error) {
      console.error("Error fetching preview:", error);
    }
  };

  const getFolderNameById = (folderId) => {
    // Assuming 'data.data' is your file structure (root and subfolders)
    const folder = findItemById(data?.data, folderId);
    return folder ? folder.name : "Unknown Folder";
  };

  const FileActions = ({ item }) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="min-w-[160px] bg-white dark:bg-gray-800 rounded-md shadow-lg p-1 z-50">
          <DropdownMenu.Item
            className="flex items-center px-2 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
            onClick={() =>
              item.type === "folder"
                ? handleOpenFolder(item._id)
                : handleFilePreview(item._id)
            }
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex items-center px-2 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
            onClick={() => handleRename(item)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex items-center px-2 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer"
            onClick={() => handleDelete(item._id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );

  return (
    <>
      <div className="min-h-full">
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Item"
          message="Are you sure you want to delete this item? This action cannot be undone."
        />
        <RenameModelDialog
          isOpen={isRenameOpen}
          onClose={() => setIsRenameOpen(false)}
          onSubmit={confirmRename}
          title="Rename"
          data={itemToRename}
        />
        <CreateFolderModal
          isOpen={isCreateFolderOpen}
          onClose={() => setIsCreateFolderOpen(false)}
          onSubmit={createFolder}
        />
        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          file={previewFile}
        />
        {/* Main content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Navigation and Action buttons */}
          <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              {currentFolder && (
                <Button
                  variant="outline"
                  onClick={navigateBack}
                  className="flex items-center text-nowrap"
                >
                  ← Back
                </Button>
              )}
              <Button
                onClick={() => setIsCreateFolderOpen(true)}
                className="flex items-center text-nowrap"
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
              </Button>
              <Button
                variant="outline"
                className="flex items-center text-nowrap"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Folder Name Display Section */}
          {currentFolder && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 mb-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {getFolderNameById(currentFolder)}
              </h3>
            </div>
          )}

          {/* File/Folder Grid */}
          {files && viewMode === "grid" ? (
            files.length === 0 ? (
              <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <p className="text-gray-600 dark:text-gray-400 text-lg font-semibold">
                  No content found in this folder.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {files.map((item) => (
                  <div
                    key={item._id}
                    className="relative group bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    onDoubleClick={() =>
                      item.type === "folder"
                        ? handleOpenFolder(item._id)
                        : handleFilePreview(item._id)
                    }
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FileActions item={item} />
                    </div>
                    <div className="flex flex-col items-center">
                      {item.type === "folder" ? (
                        <Folder className="h-16 w-16 text-blue-500 mb-3" />
                      ) : item.url ? (
                        <img
                          src={`http://localhost:5000/${item.url}`}
                          alt={item.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-file-icon.png"; // <-- Default image path
                          }}
                          className="h-16 w-16 object-cover rounded-lg mb-3"
                        />
                      ) : (
                        <File className="h-16 w-16 text-gray-400 mb-3" />
                      )}
                      <span
                        title={item.name}
                        className="text-sm font-medium text-gray-900 dark:text-white text-center truncate max-w-full"
                      >
                        {item.name}
                      </span>
                      {item.size && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {item.size}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-x-auto no-scrollbar">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {files &&
                    files.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        onDoubleClick={() =>
                          item.type === "folder" && handleOpenFolder(item._id)
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.type === "folder" ? (
                              <Folder className="h-5 w-5 text-blue-500 mr-3" />
                            ) : item.url ? (
                              <img
                                src={`http://localhost:5000/${item.url}`}
                                alt={item.name}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/default-file-icon.png"; // <-- Default image path
                                }}
                                className="h-5 w-5 object-cover rounded-lg mr-3"
                              />
                            ) : (
                              <File className="h-5 w-5 text-gray-400 mr-3" />
                            )}
                            <span
                              title={item.name}
                              className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px] block"
                            >
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <FileActions item={item} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDrop={handleFilesUpload}
      />
    </>
  );
};

export default Dashboard;
