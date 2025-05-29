"use client";

import {useState} from "react";
import {Input} from "@/app/components/ui/shadcn/input";
import {Label} from "@/app/components/ui/shadcn/label";
import {Textarea} from "@/app/components/ui/shadcn/textarea";
import {Button} from "@/app/components/ui/shadcn/button";
import {AlertCircle} from "lucide-react";
import {Alert, AlertDescription} from "@/app/components/ui/shadcn/alert";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/app/components/ui/shadcn/card";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    wechat: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: any) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Validate that at least one contact method is provided
    if (!formData.phone && !formData.whatsapp && !formData.wechat && !formData.email) {
      setError("Please provide at least one contact method (Phone, WhatsApp, WeChat, or Email)");
      return;
    }

    if (!formData.name) {
      setError("Please provide your name");
      return;
    }

    // Clear any previous errors
    setError("");

    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);

    // Show success message
    setSubmitted(true);
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4"/>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+44 1234 567890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+44 1234 567890"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wechat">WeChat ID</Label>
              <Input
                id="wechat"
                name="wechat"
                value={formData.wechat}
                onChange={handleChange}
                placeholder="Your WeChat ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Please describe your situation or any questions you have"
              rows={4}
            />
          </div>

          <div className="text-sm text-gray-500">
            * Required field. At least one contact method (Phone, WhatsApp, WeChat, or Email) must be provided.
          </div>

          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
}