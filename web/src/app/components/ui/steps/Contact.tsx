"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/app/components/ui/shadcn/card";
import Image from "next/image";

export function Contact() {
  return (
    <Card className="mt-0 pt-0 border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Contact us</CardTitle>
        <CardDescription>
          Your case involves more complex information. We recommend contacting our consultants for personalised support
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">info@ihatevisa.co.uk</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>WeChat</CardTitle>
              <CardDescription>Scan the QR code below to add our consultant</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              {/* Replace with actual QR code image */}
              <div className="relative h-48 w-48 border border-gray-200 flex items-center justify-center">
                <Image
                  src="/img/wechat-qr.jpg"
                  alt="WeChat QR Code"
                  fill
                  className="object-contain"
                />
                <p className="text-sm text-gray-500">WeChat QR Code</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}