"use client";

import {Card, CardContent} from "@/app/components/ui/shadcn/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/app/components/ui/shadcn/form";
import {Input} from "@/app/components/ui/shadcn/input";
import {Button} from "@/app/components/ui/shadcn/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useCallback, useEffect, useState} from "react";
import {getMaterialList} from "@/app/library/services/material_service";
import {Material} from "@/app/library/objects/types";
import {toast} from "sonner";
import {uploadFile} from "@/app/library/services/file_service";

// Dynamic schema creation based on material list would be better
const formSchema = z.object({
  images: z.any().optional(),
  pdf: z.any().optional(),
  excel: z.any().optional(),
});

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
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema)
  });

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

  const handleUploadFile = async (material: Material, files: FileList): Promise<boolean> => {
    const formData = new FormData();

    // Append files to FormData
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    // Add required metadata
    formData.append('product_id', productId);
    formData.append('conversation_id', conversationId);
    formData.append('file_type', material.type);

    try {
      const result = await uploadFile(userToken, formData)

      if (result) {
        console.log('Upload successful');
        return true;
      } else {
        toast.error(`Failed to upload ${material.title}`);
        return false;
      }
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
      const files = form.getValues(material.title as any) as FileList;

      if (!files || files.length === 0) {
        continue;
      }

      const uploadSuccess = await handleUploadFile(material, files);
      if (!uploadSuccess) {
        allUploadsSuccessful = false;
      }
    }

    setIsLoading(false);

    if (allUploadsSuccessful) {
      onStepChange(2);
    }
  }, [materialList, form, onStepChange]);

  return (
    <Card className="mb-4">
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col justify-center"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {materialList.map((material) => (
              <div key={material.documentId} className="upload-section my-8">
                <FormField
                  name={material.title}
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>{material.title}</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > material.limits) {
                              toast.warning(`Maximum ${material.limits} files allowed`);
                            }
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
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
