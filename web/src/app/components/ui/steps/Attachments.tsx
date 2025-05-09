"use client";

import {Card, CardContent} from "@/app/components/ui/shadcn/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/app/components/ui/shadcn/form";
import {Input} from "@/app/components/ui/shadcn/input";
import {Button} from "@/app/components/ui/shadcn/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useEffect, useState} from "react";
import {getMaterialList} from "@/app/library/services/material_service";
import {Material} from "@/app/library/objects/types";
import {toast} from "sonner";

const formSchema = z.object({
  images: z.any().optional().refine(
    (files) => !files || files.length <= 0,
  ),
  pdf: z.any().optional().refine(
    (files) => !files || files.length <= 0,
  ),
  excel: z.any().optional().refine(
    (files) => !files || files.length <= 0,
  ),
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

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema)
  });

  useEffect(() => {
    const fetchMaterialList = async () => {
      const materials = await getMaterialList(userToken, productId, conversationId, locale)
      setMaterialList(materials);
    }
    fetchMaterialList();
  }, []);

  return (
    <Card className="mb-4">
      <CardContent>
        <div className="upload-form">
          <Form {...form}>
            <form className="flex flex-col justify-center">
              {
                materialList.length > 0 && materialList.map((material: Material) => {

                  const limits = material.limits

                  return (
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
                                  if (files && files.length > limits) {
                                    toast.warning("Max files limit with " + limits)
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
                  )
                })
              }
              <Button type="submit">提交</Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}