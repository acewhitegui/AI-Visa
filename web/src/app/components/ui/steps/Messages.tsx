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
  locale: string;
}

export function Messages({
                           userToken,
                           productId,
                           conversationId,
                         }: MessageProps) {
  const [message, setMessage] = useState<Message>();
  const [htmlBuffer, setHtmlBuffer] = useState<Buffer | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const router = useRouter();

  const generateAIResult = useCallback(async () => {
    setIsGenerating(true);
    try {
      const result = await submitAI(userToken, productId, conversationId)
      if (!result) {
        toast.error("Error creating AI result, please try again later");
        return
      }
      router.refresh()
    } catch (e) {
      console.error("ERROR to generate AI result: ", e);
      toast.error("Error creating AI result, please try again later");
    } finally {
      setIsGenerating(false);
    }
  }, [])

  const regenerateAIResult = useCallback(async () => {
    setIsGenerating(true);
    try {
      const result = await updateAIResult(userToken, productId, conversationId)
      if (!result) {
        toast.error("Error creating AI result, please try again later");
        return
      }
      router.refresh()
    } catch (e) {
      console.error("ERROR to generate AI result: ", e);
      toast.error("Error creating AI result, please try again later");
    } finally {
      setIsGenerating(false);
    }
  }, [])

  useEffect(() => {
    const fetchAIResult = async () => {
      const messageObj = await getAIResult(userToken, productId, conversationId);
      if (messageObj) {
        setMessage(messageObj)
        setHtmlBuffer(Buffer.from(messageObj.answer));
      }

    };
    fetchAIResult()
  }, [conversationId, productId, userToken]);

  const getHtmlString = () => {
    return htmlBuffer ? htmlBuffer.toString() : '';
  };

  return (
    <Card className="mb-4">
      {
        message && <CardHeader>
              <CardTitle>AI Result</CardTitle>
              <CardDescription>Generated at: {formatDate(message.created_at)}</CardDescription>
          </CardHeader>
      }
      <CardContent>
        {htmlBuffer && htmlBuffer?.length > 0 ? (
          <div dangerouslySetInnerHTML={{__html: getHtmlString()}}/>
        ) : (
          <Button
            onClick={generateAIResult}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating' : 'Generate'}
          </Button>
        )}
      </CardContent>
      {
        htmlBuffer && htmlBuffer?.length > 0 ? (
          <CardFooter>
            <Button
              onClick={regenerateAIResult} disabled={isGenerating}>
              {isGenerating ? 'Generating' : 'Regenerate'}
            </Button>
          </CardFooter>
        ) : ("")
      }
    </Card>
  )
}