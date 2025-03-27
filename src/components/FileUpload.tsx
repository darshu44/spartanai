import React, { useState, useCallback } from "react";
import { Upload, FileX, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";

interface FileUploadProps {
  onFileUploaded?: (file: File) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
}

const FileUpload = ({
  onFileUploaded = () => {},
  acceptedFileTypes = [".imscc"],
  maxFileSize = 100 * 1024 * 1024, // 10MB default
  isUploading = false,
  uploadProgress = 0,
  error = "",
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = useCallback(
    (file: File): boolean => {
      // Check file type
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!acceptedFileTypes.includes(fileExtension)) {
        setFileError(
          `Invalid file type. Accepted types: ${acceptedFileTypes.join(", ")}`,
        );
        return false;
      }

      // Check file size
      if (file.size > maxFileSize) {
        setFileError(
          `File is too large. Maximum size: ${maxFileSize / (1024 * 1024)}MB`,
        );
        return false;
      }

      setFileError("");
      return true;
    },
    [acceptedFileTypes, maxFileSize],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (validateFile(file)) {
          setSelectedFile(file);
          onFileUploaded(file);
        }
      }
    },
    [validateFile, onFileUploaded],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (validateFile(file)) {
          setSelectedFile(file);
          onFileUploaded(file);
        }
      }
    },
    [validateFile, onFileUploaded],
  );

  const handleButtonClick = useCallback(() => {
    document.getElementById("file-upload")?.click();
  }, []);

  const displayError = fileError || error;

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? "border-primary bg-primary/5" : "border-gray-300"} transition-colors duration-200 ease-in-out`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={acceptedFileTypes.join(",")}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {!selectedFile ? (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  Upload Canvas Course Export
                </h3>
                <p className="text-sm text-gray-500">
                  Drag and drop your Canvas course export file (.imscc) here, or
                  click to browse
                </p>
                <p className="text-xs text-gray-400">
                  Accepted file types: {acceptedFileTypes.join(", ")}
                </p>
              </div>
              <Button onClick={handleButtonClick} className="mt-4">
                Browse Files
              </Button>
            </>
          ) : (
            <div className="w-full space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFile(null)}
                  disabled={isUploading}
                >
                  <FileX className="h-5 w-5 text-gray-500" />
                </Button>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {!isUploading && (
                <Button
                  className="w-full"
                  onClick={() => onFileUploaded(selectedFile)}
                >
                  Process File
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {displayError && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{displayError}</p>
        </div>
      )}

      <div className="mt-6">
        <h4 className="text-sm font-medium mb-2">Instructions:</h4>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>Export your Canvas course from the Settings page</li>
          <li>Select the "Course Content" export option</li>
          <li>Download the .imscc export file when ready</li>
          <li>Upload the file here to generate your course map</li>
        </ol>
      </div>
    </div>
  );
};

export default FileUpload;
