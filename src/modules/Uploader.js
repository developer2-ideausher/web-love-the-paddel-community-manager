import { imageValidator } from "@/Utilities/helpers";
import React, { useEffect, useRef, useState } from "react";

export default function Uploader({
  title,
  handler,
  existingUrl = null,
  existingFile = null,
  files = false,
  fileType = "image", // Accepts 'image' or 'video'
  ...attributes
}) {
  const ref = useRef(null);
  const [url, setUrl] = useState(null);
  const [file, setFile] = useState(null);

  const clickHandler = () => {
    if (ref.current) {
      ref.current.click();
    }
  };

  const uploadFileHandler = (val) => {
    handler && handler(val);
    setUrl(URL.createObjectURL(val));
  };

  const fileValidator = (file) => {
    if (fileType === "image") {
      return imageValidator(file); 
    } else if (fileType === "video") {
      const validVideoTypes = ["video/mp4", "video/ogg", "video/webm"];
      return validVideoTypes.includes(file.type);
    }
    return false;
  };

  const coverHandler = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (fileValidator(selectedFile)) {
        setFile(selectedFile);
        handler && handler(selectedFile); 
      } else {
        alert(`Invalid ${fileType} file. Please select a valid ${fileType}.`);
      }
    }
  };
  
  
  useEffect(() => {
    if (file) {
      uploadFileHandler(file);
    }
  }, [file]);

  return (
    <>
      {files && file && (
        <div className="group relative w-full  h-auto py-5 rounded-md flex flex-wrap items-center justify-start">
          <div className="w-auto border border-dashed bg-purple-100 p-3 rounded-md">
            {file.name}
          </div>
        </div>
      )}
      {((!url && !existingUrl && !existingFile) || files) && (
       <div
       className="w-96 border border-dashed border-[#DCDBE1] rounded-md py-6 px-4 flex flex-wrap items-center justify-center cursor-pointer"
       onClick={clickHandler}
     > 
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
             strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-arrow-up-from-line"
          >
            <path d="m18 9-6-6-6 6" />
            <path d="M12 3v14" />
            <path d="M5 21h14" />
          </svg>

          <h3 className="font-inter text-base w-full text-black-3 text-center mt-2">
            {title}
          </h3>
          <h3 className="text-neutral-5 font-medium text-sm">
            Upload {fileType} <span className="text-gray-4"> or</span>{" "}
            <span className="text-primary">Select file </span>
          </h3>
        </div>
      )}
      <input
        type="file"
        ref={ref}
        className="hidden"
        accept={fileType === "image" ? "image/*" : "video/*"} // Accept only images or videos based on prop
        onChange={coverHandler}
        {...attributes}
      />

      {!files && (url || existingUrl || existingFile) && (
      <div
      className="w-96 border border-dashed border-[#DCDBE1] rounded-md py-6 px-4 flex flex-wrap items-center justify-center cursor-pointer"
      onClick={clickHandler}
    >
          {url ? (
            fileType === "image" ? (
              <img
                src={url}
                alt="Uploaded media"
                className="w-full h-full object-cover rounded-md group-hover:brightness-50"
              />
            ) : (
              <video
                controls
                src={url}
                className="w-full h-full object-cover rounded-md group-hover:brightness-50"
              />
            )
          ) : existingUrl ? (
            fileType === "image" ? (
              <img
                src={existingUrl}
                alt="Uploaded media"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <video
                controls
                src={existingUrl}
                className="w-full h-full object-cover rounded-md"
              />
            )
          ) : (
            fileType === "image" ? (
              <img
                src={URL.createObjectURL(existingFile)}
                alt="Uploaded media"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <video
                controls
                src={URL.createObjectURL(existingFile)}
                className="w-full h-full object-cover rounded-md"
              />
            )
          )}

          <span className="absolute text-lg font-dm-sans font-semibold text-white hidden group-hover:block">
            Edit
          </span>
          
        </div>
      )}
    </>
  );
}
