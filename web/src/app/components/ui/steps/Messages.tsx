"use client";
import React, {useCallback, useEffect, useState} from "react";
import {getAIResult, submitAI, updateAIResult} from "@/app/library/services/ai_service";
import {Button} from "@/app/components/ui/shadcn/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/app/components/ui/shadcn/card";
import {toast} from "sonner";
import {Message} from "@/app/library/objects/types";
import {formatDate} from "@/app/library/common/utils";
import "@/app/assets/css/article.css";
import {createStripeSession} from "@/app/library/services/billing_service";
import {env} from "next-runtime-env";
import {loadStripe} from "@stripe/stripe-js";
import {usePathname} from "next/navigation";

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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const pathname = usePathname()

  const handleAIOperation = useCallback(async (operation: (token: string, prodId: string, convId: string) => Promise<any>) => {
    setIsGenerating(true);
    try {
      const result = await operation(userToken, productId, conversationId);
      if (!result) {
        toast.error("Error creating AI result, please try again later");
        return;
      }
      toast.success("Successfully created AI result");
      window.location.reload()
    } catch (error) {
      console.error("ERROR with AI operation:", error);
      toast.error("Error creating AI result, please try again later");
    } finally {
      setIsGenerating(false);
    }
  }, [userToken, productId, conversationId]);

  const handlePayment = useCallback(async () => {
    setIsProcessingPayment(true);
    try {
      const stripePublicKey = env("NEXT_PUBLIC_STRIPE_PUBLIC_KEY")
      if (!stripePublicKey) {
        console.warn("Stripe public key is missing");
        return;
      }
      const priceId = env("NEXT_PUBLIC_STRIPE_PRICE_ID") || ""
      const stripe = await loadStripe(stripePublicKey);
      const session = await createStripeSession(priceId, pathname, pathname)
      await stripe?.redirectToCheckout(session);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  }, []);

  // Check URL parameters on component mount to see if we're returning from a successful payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const returnedProductId = urlParams.get('product_id');
    const returnedConversationId = urlParams.get('conversation_id');
    const isRegeneration = urlParams.get('is_regeneration') === 'true';

    if (sessionId && returnedProductId === productId && returnedConversationId === conversationId) {
      // Payment was successful, proceed with AI generation
      if (isRegeneration) {
        handleAIOperation(updateAIResult);
      } else {
        handleAIOperation(submitAI);
      }

      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [handleAIOperation, productId, conversationId]);

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
  const isButtonDisabled = isGenerating || isProcessingPayment;
  const buttonText = isProcessingPayment ? 'Processing Payment...' : (isGenerating ? 'Generating' : 'Generate');
  const regenerateButtonText = isProcessingPayment ? 'Processing Payment...' : (isGenerating ? 'Generating' : 'Regenerate');

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
          <div className="markdown" dangerouslySetInnerHTML={{__html: htmlBuffer.toString()}}/>
        ) : (
          <Button onClick={() => handlePayment()} disabled={isButtonDisabled}>
            {buttonText}
          </Button>
        )}
      </CardContent>
      {hasContent && (
        <CardFooter>
          <Button onClick={() => handlePayment()} disabled={isButtonDisabled}>
            {regenerateButtonText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
