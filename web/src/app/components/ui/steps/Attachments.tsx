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
import {useRouter} from "@/i18n/routing";

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
  const [materialList, setMaterialList] = useState<Material[]>([]);
  const [uploadedFilesMap, setUploadedFilesMap] = useState<Record<string, UploadFile | undefined>>({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Store selected files outside of react-hook-form
  const fileInputsRef = useRef<Record<string, FileList | null>>({});

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema)
  });

  // Fetch material list on component mount
  useEffect(() => {
    const fetchMaterialList = async () => {
      try {
        const materials = await getMaterialList(userToken, productId, conversationId, locale);
        setMaterialList(materials);
      } catch (error) {
        console.error("Failed to fetch material list:", error);
        toast.error("Failed to load required documents");
      }
    };

    fetchMaterialList();
  }, [userToken, productId, conversationId, locale]);

  // Fetch already uploaded files
  useEffect(() => {
    const fetchUploadedFiles = async () => {
      if (!conversationId) return;

      try {
        const fileMap = await getUploadedFiles(userToken, conversationId);
        setUploadedFilesMap(fileMap);
      } catch (error) {
        console.error("Failed to fetch uploaded files:", error);
      }
    };

    fetchUploadedFiles();
  }, [conversationId, userToken]);

  const handleUploadFile = async (material: Material, files: FileList): Promise<boolean> => {
    const formData = new FormData();

    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    formData.append('product_id', productId);
    formData.append('conversation_id', conversationId);
    formData.append('material_id', material.documentId);
    formData.append('file_type', material.type);

    try {
      const result = await uploadFile(userToken, formData);
      return result;
    } catch (error) {
      console.error('Error during upload:', error);
      toast.error(`Error uploading ${material.title}`);
      return false;
    }
  };

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    let allUploadsSuccessful = true;

    for (const material of materialList) {
      const files = fileInputsRef.current[material.title];
      if (!files || files.length === 0) continue;

      const uploadSuccess = await handleUploadFile(material, files);
      if (!uploadSuccess) {
        toast.error(`Failed to upload ${material.title}`);
        allUploadsSuccessful = false;
      }
    }

    setIsLoading(false);

    if (allUploadsSuccessful) {
      toast.success("Successfully uploaded!");
      onStepChange(2);
    }

    router.refresh()
  }, [materialList, onStepChange, productId, conversationId, userToken]);

  const handleFileChange = (material: Material, files: FileList | null) => {
    if (files && files.length > material.limits) {
      toast.warning(`Maximum ${material.limits} files allowed`);
    }
    fileInputsRef.current[material.title] = files;
  };

  const removeUploadedFile = (material: Material) => {
    const updatedFilesMap = {...uploadedFilesMap};
    delete updatedFilesMap[material.type];
    setUploadedFilesMap(updatedFilesMap);

    // Reset file input
    const fileInput = document.querySelector(`input[type="file"][data-material="${material.documentId}"]`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    fileInputsRef.current[material.title] = null;

    toast.success(`Removed ${material.title}`);
  };

  const renderUploadedFile = (material: Material) => {
    const uploadedFile = uploadedFilesMap[material.type];
    if (!uploadedFile) return null;

    return (
      <div className="uploaded-file-container mt-2 flex items-center">
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            const fileUrl = uploadedFile.url;
            if (fileUrl) {
              window.open(fileUrl, '_blank', 'noopener,noreferrer');
            }
          }}
          className="uploaded-file-name underline text-blue-500 hover:text-blue-700 mr-2"
        >
          {uploadedFile.name}
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
    );
  };

  return (
    <Card className="mb-4">
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col justify-center"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {materialList.map((material) => (
              <div key={material.documentId} className="upload-section my-8">
                <FormItem>
                  <FormLabel>{material.title}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      data-material={material.documentId}
                      onChange={(e) => handleFileChange(material, e.target.files)}
                    />
                  </FormControl>
                  {renderUploadedFile(material)}
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