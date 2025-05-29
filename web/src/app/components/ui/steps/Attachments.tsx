"use client";

import {Card, CardContent} from "@/app/components/ui/shadcn/card";
import {Form, FormControl, FormItem, FormLabel, FormMessage} from "@/app/components/ui/shadcn/form";
import {Input} from "@/app/components/ui/shadcn/input";
import {Button} from "@/app/components/ui/shadcn/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from "react";
import {getMaterialList} from "@/app/library/services/material_service";
import {Material, UploadFile} from "@/app/library/objects/types";
import {toast} from "sonner";
import {getUploadedFiles, uploadFile} from "@/app/library/services/file_service";
import Link from "next/link";

const formSchema = z.object({});
type FormSchema = z.infer<typeof formSchema>;

export interface AttachmentsRef {
  stepperSubmit: () => void;
}

interface AttachmentProps {
  userToken: string;
  productId: string;
  conversationId: string;
  locale: string;
  onLoadingChange: (isLoading: boolean) => void;
  onStepChange: (step: number) => void;
  onFileChange: (isDisabledNext: boolean) => void;
}

export const Attachments = forwardRef<AttachmentsRef, AttachmentProps>(function Attachments(
  {userToken, productId, conversationId, locale, onLoadingChange, onStepChange, onFileChange}, ref) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadFile[]>>({});
  const [fileChangeCounter, setFileChangeCounter] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Store selected files outside of react-hook-form
  const fileInputsRef = useRef<Record<string, FileList>>({});
  const form = useForm<FormSchema>({resolver: zodResolver(formSchema)});

  const updateNextButtonState = useCallback(() => {
    const isNextDisabled = materials.some(material => {
      if (!material.required) return false;
      const uploadedForType = uploadedFiles[material.type] || [];
      const preparedFiles = fileInputsRef.current[material.title];
      return uploadedForType.length === 0 && (!preparedFiles || preparedFiles.length === 0);
    });
    onFileChange(isNextDisabled);
  }, [materials, uploadedFiles, onFileChange]);

  // Fetch material list on mount
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const result = await getMaterialList(userToken, productId, conversationId, locale);
        setMaterials(result);
      } catch (error) {
        console.error("Failed to fetch material list:", error);
        toast.error("Failed to load required documents");
      }
    };
    fetchMaterials();
  }, [userToken, productId, conversationId, locale]);

  // Fetch already uploaded files
  useEffect(() => {
    if (!conversationId) return;

    const fetchUploadedFiles = async () => {
      try {
        onLoadingChange(true);
        const fileMap = await getUploadedFiles(userToken, conversationId);
        setUploadedFiles(fileMap);
        setFileChangeCounter(prev => prev + 1);
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to fetch uploaded files:", error);
      } finally {
        onLoadingChange(false);
      }
    };
    fetchUploadedFiles();
  }, [conversationId, userToken, onLoadingChange]);

  // Update next button state when files or materials change
  useEffect(() => {
    if (materials.length > 0) {
      updateNextButtonState();
    }
  }, [materials, uploadedFiles, fileChangeCounter, updateNextButtonState]);

  const uploadMaterialFiles = async (material: Material, files: FileList): Promise<boolean> => {
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append("files", file));
    formData.append("product_id", productId);
    formData.append("conversation_id", conversationId);
    formData.append("material_id", material.documentId);
    formData.append("file_type", material.type);

    try {
      return await uploadFile(userToken, formData);
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error(`Error uploading ${material.title}`);
      return false;
    }
  };

  const stepperSubmit = useCallback(async () => {
    try {
      onLoadingChange(true);
      let allSuccessful = true;

      for (const material of materials) {
        const files = fileInputsRef.current[material.title];
        if (!files || files.length === 0) continue;

        const success = await uploadMaterialFiles(material, files);
        if (!success) {
          toast.error(`Failed to upload ${material.title}`);
          allSuccessful = false;
        }
      }

      if (allSuccessful) {
        // Refresh uploaded files after successful upload
        const fileMap = await getUploadedFiles(userToken, conversationId);
        setUploadedFiles(fileMap);

        // Clear file inputs after successful upload
        materials.forEach(material => {
          const fileInput = document.querySelector<HTMLInputElement>(
            `input[type="file"][data-material="${material.documentId}"]`
          );
          if (fileInput) fileInput.value = "";
          fileInputsRef.current[material.title] = undefined as unknown as FileList;
        });
        
        toast.success("Successfully uploaded!");
        onStepChange(2);
      }
      setFileChangeCounter(prev => prev + 1);
    } finally {
      onLoadingChange(false);
    }
  }, [materials, onLoadingChange, onStepChange, userToken, conversationId]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({stepperSubmit}));

  const handleFileChange = (material: Material, files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Create a DataTransfer object to combine existing and new files
    let dataTransfer = new DataTransfer();

    // Add existing files if any
    const existingFiles = fileInputsRef.current[material.title];
    if (existingFiles) {
      Array.from(existingFiles).forEach(file => {
        dataTransfer.items.add(file);
      });
    }

    // Add new files
    Array.from(files).forEach(file => {
      dataTransfer.items.add(file);
    });

    // Check if total files exceed the limit
    if (dataTransfer.files.length > material.limits) {
      toast.warning(`Maximum ${material.limits} files allowed. Only the first ${material.limits} files will be used.`);
      // If exceeding limit, create a new DataTransfer with only the allowed number of files
      const limitedDataTransfer = new DataTransfer();
      for (let i = 0; i < Math.min(dataTransfer.files.length, material.limits); i++) {
        limitedDataTransfer.items.add(dataTransfer.files[i]);
      }
      dataTransfer = limitedDataTransfer;
    }

    // Update the file input element to show the combined files
    const fileInput = document.querySelector<HTMLInputElement>(
      `input[type="file"][data-material="${material.documentId}"]`
    );
    if (fileInput) fileInput.files = dataTransfer.files;

    // Update our reference
    fileInputsRef.current[material.title] = dataTransfer.files;

    // Show selected files in toast notification
    const fileNames = Array.from(dataTransfer.files).map(file => file.name).join(", ");
    toast.info(`Selected files: ${fileNames}`);
  
    setFileChangeCounter(prev => prev + 1);
  };

  const removeUploadedFile = async (material: Material, fileId: string) => {
    try {
      onLoadingChange(true);
      // Here you would typically call an API to delete the file
      // For now, we'll just update the local state

      setUploadedFiles(prev => {
        const updated = {...prev};
        const fileList = updated[material.type] || [];
        updated[material.type] = fileList.filter(file => file.file_id !== fileId);
        return updated;
      });

      toast.success(`Removed ${material.title}`);
      setFileChangeCounter(prev => prev + 1);
    } catch (error) {
      console.error("Error removing file:", error);
      toast.error("Failed to remove file");
    } finally {
      onLoadingChange(false);
    }
  };

  const removePreparedFile = (material: Material, idx: number) => {
    const currentFiles = fileInputsRef.current[material.title];
    if (!currentFiles || currentFiles.length === 0) return;

    const dataTransfer = new DataTransfer();
    Array.from(currentFiles).forEach((file, i) => {
      if (i !== idx) dataTransfer.items.add(file);
    });

    fileInputsRef.current[material.title] = dataTransfer.files;

    const fileInput = document.querySelector<HTMLInputElement>(
      `input[type="file"][data-material="${material.documentId}"]`
    );
    if (fileInput) fileInput.files = dataTransfer.files;

    toast.success("Removed file from uploading list");
    setFileChangeCounter(prev => prev + 1);
  };

  const renderFiles = (material: Material) => {
    const uploaded = uploadedFiles[material.type] || [];
    const prepared = fileInputsRef.current[material.title];

    if (uploaded.length === 0 && (!prepared || prepared.length === 0)) return null;

    return (
      <div className="uploaded-file-container mt-2 flex flex-wrap gap-2">
        {uploaded.map(file => (
          <div key={file.file_id} className="flex items-center mb-2">
            <Link
              href="#"
              onClick={e => {
                e.preventDefault();
                if (file.url) window.open(file.url, "_blank", "noopener,noreferrer");
              }}
              className="uploaded-file-name underline text-blue-500 hover:text-blue-700 mr-2"
            >
              {file.name}
            </Link>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeUploadedFile(material, file.file_id)}
            >
              Remove
            </Button>
          </div>
        ))}
        {prepared &&
          Array.from(prepared).map((file, idx) => (
            <div key={file.name + idx} className="flex items-center mb-2">
              <span className="uploaded-file-name text-gray-700 mr-2">{file.name}</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removePreparedFile(material, idx)}
              >
                Remove
              </Button>
            </div>
          ))}
      </div>
    );
  };

  const isRequiredEmpty = (material: Material) => {
    if (!material.required) return false;
    const uploadedForType = uploadedFiles[material.type] || [];
    const preparedFiles = fileInputsRef.current[material.title];
    return uploadedForType.length === 0 && (!preparedFiles || preparedFiles.length === 0);
  };

  // Calculate remaining file slots for each material
  const getRemainingSlots = (material: Material) => {
    const uploaded = uploadedFiles[material.type] || [];
    const prepared = fileInputsRef.current[material.title];
    const preparedCount = prepared ? prepared.length : 0;
    return material.limits - uploaded.length - preparedCount;
  };

  return (
    <Card className="mb-4">
      <CardContent>
        {!isInitialized ? (
          <div className="flex justify-center py-8">
            <p>Loading documents...</p>
          </div>
        ) : (
          <Form {...form}>
            <form className="flex flex-col justify-center">
              {materials.map(material => (
                <div key={`${material.documentId}-${fileChangeCounter}`} className="upload-section my-8">
                  <FormItem>
                    <FormLabel>
                      {material.required && <span className="text-red-500">*</span>}
                      {material.title}
                    </FormLabel>
                    <div className="text-sm text-gray-500 mb-2">
                      {material.required ? "Required" : "Optional"} -
                      You can upload up to {material.limits} file(s).
                      {getRemainingSlots(material) > 0
                        ? ` ${getRemainingSlots(material)} slot(s) remaining.`
                        : " No slots remaining."}
                    </div>
                    <FormControl>
                      <Input
                        type="file"
                        multiple
                        required={material.required}
                        data-material={material.documentId}
                        onChange={(e) => handleFileChange(material, e.target.files)}
                        disabled={getRemainingSlots(material) <= 0}
                      />
                    </FormControl>
                    {renderFiles(material)}
                    {isRequiredEmpty(material) && (
                      <p className="text-red-500 text-sm mt-1">
                        This document is required. Please upload at least one file.
                      </p>
                    )}
                    <FormMessage/>
                  </FormItem>
                </div>
              ))}
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
});

Attachments.displayName = "Attachments";
