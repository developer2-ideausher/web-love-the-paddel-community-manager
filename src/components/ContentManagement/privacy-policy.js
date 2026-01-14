import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});
import { editorConfig } from "@/config/joditEditorConfig";

import { BeatLoader } from "react-spinners";
import { getPrivacy, updatePrivacyContent, updatetncContent } from "@/services/contentServices";
import Loader from "../ui/Loader";
import { toast } from "react-toastify";

const Privacypolicy = () => {
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [originalDescription, setOriginalDescription] = useState(""); 
  const editorRef = useRef(null);

  const descriptionHandler = (newDescription) => {
    setDescription(newDescription);
  };

  const handleSave = async () => {
    try {
      if (description.trim() === originalDescription.trim()) {
        toast.info("Nothing changed to update.");
        return;
      }

      if (!description.trim()) {
        toast.error("Privacy Policy cannot be empty.");
        return;
      }

      setLoading(true);

      const payload = {
        privacyPolicy: description?.trim(),
      };

      const result = await updatetncContent(payload);

      if (result.status) {
        setOriginalDescription(description.trim());
      }

    } catch (error) {
      console.error("Error updating privacy content:", error);
      toast.error("An error occurred while saving. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchpolicyDetails = async () => {
    setLoading(true);
    const payload = {
      type: "privacy",
    };
    const res = await getPrivacy(payload);

    if (res.status) {
      setDescription(res.data.privacyPolicy || "");
      setOriginalDescription(res.data.privacyPolicy || ""); 
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchpolicyDetails();
  }, []);

  return (
    <div className="app-container bg-white rounded-2xl">
      <div className="w-full p-8">
        <>
          <Loader loading={loading} />
          <JoditEditor
            ref={editorRef}
            value={description || " "}
            onChange={descriptionHandler}
            className="w-full h-[70%] bg-white"
            config={editorConfig}
          />
          <style>{`.jodit-wysiwyg{height:300px !important}`}</style>
        </>

        <Button
          variant={"primary"}
          className="w-1/4 mt-8"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? (
            <>
              Processing <BeatLoader size={8} color="#fff" />
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Privacypolicy;
