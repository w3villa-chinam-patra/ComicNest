import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import toast from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";
import Avatar from "../../../components/Avatar";
import {
  skipUploadProfilePhoto,
  uploadProfilePhoto,
} from "../../../api/auth.api";
import { useNavigate } from "react-router-dom";
import { appConstants } from "../../../constants";

const UploadProfilePhoto: React.FC = () => {
  const { user, setUser } = useAuth();
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(
    appConstants.TRUTHY_FALSY_VALUES.FALSE
  );
  const [isSkipLoading, setIsSkipLoading] = useState(
    appConstants.TRUTHY_FALSY_VALUES.FALSE
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Optional cleanup for blob URL
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error("Please select an image before uploading.");
      return;
    }

    setIsUploading(appConstants.TRUTHY_FALSY_VALUES.TRUE);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await uploadProfilePhoto(formData);
      if (response.isSuccess) {
        toast.success(response.message);
        navigate(appConstants.APP_ROUTES.DASHBOARD);
        setUser(null);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    } finally {
      setIsUploading(appConstants.TRUTHY_FALSY_VALUES.FALSE);
    }
  };

  const handleSkip = async () => {
    try {
      setIsSkipLoading(appConstants.TRUTHY_FALSY_VALUES.TRUE);
      const response = await skipUploadProfilePhoto();
      if (response.isSuccess) {
        toast.success(response.message);
        navigate(appConstants.APP_ROUTES.DASHBOARD);
        setUser(null);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    } finally {
      setIsSkipLoading(appConstants.TRUTHY_FALSY_VALUES.FALSE);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl text-neutral-300">Your Current Profile Photo</h2>

      <div className="flex items-center justify-center rounded-full overflow-hidden">
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            width={120}
            className="rounded-full object-cover"
          />
        ) : (
          <Avatar name={`${user?.firstName} ${user?.lastName}`} width={120} />
        )}
      </div>

      {/* Dropzone */}
      <div className="flex items-center justify-center w-full sm:min-w-xl">
        <label
          htmlFor="dropzone-file"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-neutral-300 border-dashed rounded-lg cursor-pointer bg-neutral-50 dark:hover:bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:hover:border-neutral-500 dark:hover:bg-neutral-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-neutral-500 dark:text-neutral-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
              aria-hidden="true"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              SVG, PNG, JPG or WEBP
            </p>
          </div>
          <input
            id="dropzone-file"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Upload Button */}
      <button
        disabled={isUploading}
        onClick={handleUpload}
        className={`w-full flex justify-center items-center gap-2 px-4 py-2 text-white font-medium ${
          isUploading ? "bg-amber-500" : "bg-amber-600"
        } hover:bg-amber-500 active:bg-amber-600 rounded-lg duration-150 cursor-pointer`}
      >
        Upload
        {isUploading && <AiOutlineLoading3Quarters className="animate-spin" />}
      </button>

      {/* Skip Button */}
      <button
        disabled={isSkipLoading}
        onClick={handleSkip}
        className={`w-full flex justify-center items-center gap-2 px-4 py-2 text-white font-medium ${
          isSkipLoading ? "bg-blue-500" : "bg-blue-600"
        } hover:bg-blue-500 active:bg-blue-600 rounded-lg duration-150 cursor-pointer`}
      >
        Skip
        {isSkipLoading && (
          <AiOutlineLoading3Quarters className="animate-spin" />
        )}
      </button>
    </div>
  );
};

export default UploadProfilePhoto;
