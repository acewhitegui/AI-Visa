"use client";
import React, {useCallback, useEffect, useState} from "react";
import {getAIResult, submitAI, updateAIResult} from "@/app/library/services/ai_service";
import {Button} from "@/app/components/ui/shadcn/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/app/components/ui/shadcn/card";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {Message} from "@/app/library/objects/types";
import {formatDate} from "@/app/library/common/utils";

interface MessageProps {
  userToken: string;
  productId: string;
  conversationId: string;
  locale: string; // Unused prop
}

export function Messages({userToken, productId, conversationId}: MessageProps) {
  const [message, setMessage] = useState<Message | null>(null);
  const [htmlBuffer, setHtmlBuffer] = useState<Buffer | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleAIOperation = useCallback(async (operation: (token: string, prodId: string, convId: string) => Promise<any>) => {
    setIsGenerating(true);
    try {
      const result = await operation(userToken, productId, conversationId);
      if (!result) {
        toast.error("Error creating AI result, please try again later");
        return;
      }
      router.refresh();
    } catch (error) {
      console.error("ERROR with AI operation:", error);
      toast.error("Error creating AI result, please try again later");
    } finally {
      setIsGenerating(false);
    }
  }, [userToken, productId, conversationId, router]);

  const generateAIResult = useCallback(() =>
    handleAIOperation(submitAI), [handleAIOperation]);

  const regenerateAIResult = useCallback(() =>
    handleAIOperation(updateAIResult), [handleAIOperation]);

  useEffect(() => {
    const fetchAIResult = async () => {
      const messageObj = await getAIResult(userToken, productId, conversationId);
      if (messageObj) {
        setMessage(messageObj);
        setHtmlBuffer(Buffer.from(messageObj.answer));
      }
    };
    fetchAIResult();
  }, [conversationId, productId, userToken]);

  const hasContent = htmlBuffer && htmlBuffer.length > 0;

  return (
    <Card className="mb-4">
      {message && (
        <CardHeader>
          <CardTitle>AI Result</CardTitle>
          <CardDescription>Generated at: {formatDate(message.created_at)}</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        {hasContent ? (
          <div dangerouslySetInnerHTML={{__html: htmlBuffer.toString()}}/>
        ) : (
          <Button onClick={generateAIResult} disabled={isGenerating}>
            {isGenerating ? 'Generating' : 'Generate'}
          </Button>
        )}
      </CardContent>
      {hasContent && (
        <CardFooter>
          <Button onClick={regenerateAIResult} disabled={isGenerating}>
            {isGenerating ? 'Generating' : 'Regenerate'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
