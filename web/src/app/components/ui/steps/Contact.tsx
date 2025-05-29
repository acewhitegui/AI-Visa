"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Input} from "@/app/components/ui/shadcn/input";
import {Textarea} from "@/app/components/ui/shadcn/textarea";
import {Button} from "@/app/components/ui/shadcn/button";
import {AlertCircle} from "lucide-react";
import {Alert, AlertDescription} from "@/app/components/ui/shadcn/alert";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/app/components/ui/shadcn/card";
import {submitFormData} from "@/app/library/services/form_service";
import {StrapiForm} from "@/app/library/objects/types";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/app/components/ui/shadcn/form";

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, {message: "Name is required"}),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  wechat: z.string().optional(),
  email: z.string().email({message: "Invalid email address"}).optional(),
  message: z.string().optional(),
}).refine((data) => {
  // Ensure at least one contact method is provided
  return !!(data.phone || data.whatsapp || data.wechat || data.email);
}, {
  message: "Please provide at least one contact method (Phone, WhatsApp, WeChat, or Email)",
  path: ["email"], // This will show the error under the email field
});

type FormValues = z.infer<typeof formSchema>;

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      whatsapp: "",
      wechat: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const data: StrapiForm | null = await submitFormData(values);
      if (!data) {
        setServerError("Something went wrong, please try again");
        return;
      }

      console.log("Form submitted:", values);
      setSubmitted(true);
    } catch (error) {
      setServerError("An error occurred while submitting the form");
      console.error(error);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    form.reset();
  };

  if (submitted) {
    return (
      <Card className="mt-0 pt-0 border-none shadow-none">
        <CardHeader className="px-0">
          <CardTitle>Thank you for contacting us</CardTitle>
          <CardDescription>
            We have received your information and will get back to you shortly.
          </CardDescription>
        </CardHeader>
        <CardFooter className="px-0">
          <Button onClick={resetForm}>
            Back
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mt-0 pt-0 border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Contact us</CardTitle>
        <CardDescription>
          Your case involves more complex information. Please provide your contact details and our consultants will
          offer personalized support.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {serverError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4"/>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem className="space-y-2">
                  <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({field}) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+44 1234 567890" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({field}) => (
                  <FormItem className="space-y-2">
                    <FormLabel>WhatsApp Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+44 1234 567890" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="wechat"
                render={({field}) => (
                  <FormItem className="space-y-2">
                    <FormLabel>WeChat ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Your WeChat ID" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({field}) => (
                <FormItem className="space-y-2">
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe your situation or any questions you have"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <div className="text-sm text-gray-500">
              * Required field. At least one contact method (Phone, WhatsApp, WeChat, or Email) must be provided.
            </div>

            <Button type="submit" variant="default" className="w-full">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
