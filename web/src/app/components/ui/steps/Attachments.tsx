"use client";

import {Card, CardContent} from "@/app/components/ui/shadcn/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/app/components/ui/shadcn/form";
import {Input} from "@/app/components/ui/shadcn/input";
import {Button} from "@/app/components/ui/shadcn/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

const formSchema = z.object({
  images: z.instanceof(FileList).optional().refine(
    (files) => !files || files.length <= 3,
    {message: '最多只能上传3个图片文件'}
  ),
  pdf: z.instanceof(FileList).optional().refine(
    (files) => !files || files.length <= 1,
    {message: '最多只能上传1个PDF文件'}
  ),
  excel: z.instanceof(FileList).optional().refine(
    (files) => !files || files.length <= 2,
    {message: '最多只能上传2个Excel文件'}
  ),
});

type FormSchema = z.infer<typeof formSchema>;

export function Attachments({conversationId}: { conversationId: string }) {

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema)
  });

  return (
    <Card className="mb-4">
      <CardContent>
        <div className="upload-form">
          <Form {...form}>
            <form>
              <div className="upload-section">
                <FormField
                  name="images"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>图片文件 (最多3个)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 3) {
                              alert('最多只能上传3个图片文件');
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

              <div className="upload-section">
                <FormField
                  name="pdf"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>PDF文档 (最多1个)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 1) {
                              alert('最多只能上传1个PDF文件');
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

              <div className="upload-section">
                <FormField
                  name="excel"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Excel文件 (最多2个)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          accept=".xlsx,.xls"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 2) {
                              alert('最多只能上传2个Excel文件');
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
              <Button type="submit">提交</Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}