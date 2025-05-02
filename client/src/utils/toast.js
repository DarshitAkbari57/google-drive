// utils/showToast.js
import { toast } from "react-toastify";

export const generatePopup = (type, message) => {
  switch (type.toLowerCase()) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
      toast.info(message);
      break;
    case "warning":
      toast.warn(message);
      break;
    default:
      toast(message); // default toast
  }
};
