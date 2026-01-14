import React, { useState, useRef, useEffect } from "react";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
import { editorConfig } from "@/config/joditEditorConfig";
import dynamic from "next/dynamic";
import Button from "../Button";
import { getContent, updatetncContent } from "@/services/contentServices";
import Loader from "../ui/Loader";
import { toast } from "react-toastify";

const Tnc = () => {
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const editorRef = useRef(null);

  const descriptionHandler = (newDescription) => {
    setDescription(newDescription);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (description.trim() === originalDescription.trim()) {
        toast.info("Nothing changed to update.");
        return;
      }

      if (!description.trim()) {
        toast.error("Terms and conditions cannot be empty.");
        return;
      }

      const payload = {
        termsAndConditions: description?.trim(),
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
      type: "terms",
    };
    const res = await getContent(payload);

    if (res.status) {
      setDescription(res.data.termsAndConditions || "");
      setOriginalDescription(res.data.termsAndConditions || "");
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

        <Button variant={"primary"} className="w-1/4 mt-8" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default Tnc;
