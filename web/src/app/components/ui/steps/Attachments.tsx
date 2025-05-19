"use client";

import {Card, CardContent} from "@/app/components/ui/shadcn/card";
import {Form, FormControl, FormItem, FormLabel, FormMessage} from "@/app/components/ui/shadcn/form";
import {Input} from "@/app/components/ui/shadcn/input";
import {Button} from "@/app/components/ui/shadcn/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useCallback, useEffect, useRef, useState} from "react";
import {getMaterialList} from "@/app/library/services/material_service";
import {Material, UploadFile} from "@/app/library/objects/types";
import {toast} from "sonner";
import {getUploadedFiles, uploadFile} from "@/app/library/services/file_service";
import Link from "next/link";

const formSchema = z.object({});
type FormSchema = z.infer<typeof formSchema>;

interface AttachmentProps {
  userToken: string;
  productId: string;
  conversationId: string;
  locale: string;
  onStepChange: (step: number) => void;
}

export function Attachments({
                              userToken,
                              productId,
                              conversationId,
                              locale,
                              onStepChange,
                            }: AttachmentProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadFile[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [fileChangeCounter, setFileChangeCounter] = useState(0);

  // Store selected files outside of react-hook-form
  const fileInputsRef = useRef<Record<string, FileList>>({});

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  // Fetch material list on mount
  useEffect(() => {
    (async () => {
      try {
        const result = await getMaterialList(userToken, productId, conversationId, locale);
        setMaterials(result);
      } catch (error) {
        console.error("Failed to fetch material list:", error);
        toast.error("Failed to load required documents");
      }
    })();
  }, [userToken, productId, conversationId, locale]);

  // Fetch already uploaded files
  useEffect(() => {
    if (!conversationId) return;
    (async () => {
      try {
        const fileMap = await getUploadedFiles(userToken, conversationId);
        setUploadedFiles(fileMap);
        setFileChangeCounter(prev => prev + 1);
      } catch (error) {
        console.error("Failed to fetch uploaded files:", error);
      }
    })();
  }, [conversationId, userToken]);

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

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
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

    setIsLoading(false);

    if (allSuccessful) {
      toast.success("Successfully uploaded!");
      onStepChange(2);
    }
    setFileChangeCounter(prev => prev + 1);
  }, [materials, uploadMaterialFiles, onStepChange]);

  const handleFileChange = (material: Material, files: FileList | null) => {
    if (!files) return;
    if (files.length > material.limits) {
      toast.warning(`Maximum ${material.limits} files allowed`);
      const fileNames = Array.from(files).map(file => file.name).join(", ");
      toast.info(`Selected files: ${fileNames}`);
    }
    fileInputsRef.current[material.title] = files;
    setFileChangeCounter(prev => prev + 1);
  };

  const removeUploadedFile = (material: Material) => {
    setUploadedFiles(prev => {
      const updated = {...prev};
      delete updated[material.type];
      return updated;
    });

    // Reset file input
    const fileInput = document.querySelector<HTMLInputElement>(
      `input[type="file"][data-material="${material.documentId}"]`
    );
    if (fileInput) fileInput.value = "";
    fileInputsRef.current[material.title] = undefined as unknown as FileList;
    toast.success(`Removed ${material.title}`);
    setFileChangeCounter(prev => prev + 1);
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
      <div className="uploaded-file-container mt-2 flex items-center flex-wrap gap-2">
        {Array.from(uploaded).map(file => (
          <div key={file.file_id} className="flex items-center">
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
              onClick={() => removeUploadedFile(material)}
            >
              Remove
            </Button>
          </div>
        ))}
        {prepared &&
          Array.from(prepared).map((file, idx) => (
            <div key={file.name + idx} className="flex items-center">
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

  return (
    <Card className="mb-4">
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col justify-center"
            onSubmit={e => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {materials.map(material => (
              <div key={`${material.documentId}-${fileChangeCounter}`} className="upload-section my-8">
                <FormItem>
                  <FormLabel>{material.title}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      data-material={material.documentId}
                      onChange={(e) => {
                        handleFileChange(material, e.target.files);
                      }}
                    />
                  </FormControl>
                  {renderFiles(material)}
                  <FormMessage/>
                </FormItem>
              </div>
            ))}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}