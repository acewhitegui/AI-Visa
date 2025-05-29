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
import {CreditCard} from "lucide-react"; // Import payment icon

interface MessageProps {
  userId: number;
  userToken: string;
  productId: string;
  conversationId: string;
  locale: string; // Unused prop
}

export function Messages({userId, userToken, productId, conversationId}: MessageProps) {
  const [message, setMessage] = useState<Message | null>(null);
  const [htmlBuffer, setHtmlBuffer] = useState<Buffer | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const pathname = usePathname();

  const showToastError = (msg: string) => toast.error(msg);

  const handleAIOperation = useCallback(
    async (sessionId: string, operation: (token: string, prodId: string, convId: string, sessionId: string) => Promise<any>) => {
      setIsGenerating(true);
      try {
        const result = await operation(userToken, productId, conversationId, sessionId);
        if (!result) {
          showToastError("Error creating AI result, please try again later");
          return;
        }
        toast.success("Successfully created AI result");
        window.location.reload();
      } catch (error) {
        console.error("ERROR with AI operation:", error);
        showToastError("Error creating AI result, please try again later");
      } finally {
        setIsGenerating(false);
      }
    },
    [userToken, productId, conversationId]
  );

  const handlePayment = useCallback(
    async (isRegeneration: boolean) => {
      setIsProcessingPayment(true);
      try {
        const stripePublicKey = env("NEXT_PUBLIC_STRIPE_PUBLIC_KEY");
        if (!stripePublicKey) {
          console.warn("Stripe public key is missing");
          return;
        }
        const priceId = env("NEXT_PUBLIC_STRIPE_PRICE_ID") || "";
        const stripe = await loadStripe(stripePublicKey);
        const newSessionId = await createStripeSession(
          userId,
          conversationId,
          isRegeneration,
          priceId,
          pathname,
          pathname
        );
        if (newSessionId) {
          await stripe?.redirectToCheckout({sessionId: newSessionId});
        }
      } catch (error) {
        console.error("Payment error:", error);
        showToastError("Payment processing failed. Please try again.");
      } finally {
        setIsProcessingPayment(false);
      }
    },
    [conversationId, pathname, userId]
  );

  // Handle successful payment redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSessionId = urlParams.get("session_id");
    const returnedConversationId = urlParams.get("conversation_id");
    const isRegeneration = urlParams.get("is_regeneration") === "true";

    if (urlSessionId && returnedConversationId === conversationId) {
      toast.success("You have paid successfully");
      handleAIOperation(urlSessionId, isRegeneration ? updateAIResult : submitAI);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [handleAIOperation, conversationId]);

  // Fetch AI result on mount or when dependencies change
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

  const hasContent = !!(htmlBuffer && htmlBuffer.length > 0);
  const isButtonDisabled = isGenerating || isProcessingPayment;
  const getButtonText = (isRegenerate: boolean) =>
    isProcessingPayment
      ? "Processing Payment..."
      : isGenerating
        ? "Generating"
        : isRegenerate
          ? "Regenerate"
          : "Generate";

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
          <div className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
              <p className="text-amber-800 font-medium mb-2">Ready to generate your AI result</p>
              <p className="text-amber-700 text-sm">
                Clicking the button below will redirect you to our payment processor to complete your purchase.
              </p>
            </div>

            <Button
              onClick={() => handlePayment(false)}
              disabled={isButtonDisabled}
              className="w-full flex items-center justify-center gap-2"
            >
              <CreditCard className="h-4 w-4"/>
              {getButtonText(false)} (Pay to proceed)
            </Button>
          </div>
        )}
      </CardContent>
      {hasContent && (
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-gray-500 mb-1">Need a different result?</p>
          <Button
            onClick={() => handlePayment(true)}
            disabled={isButtonDisabled}
            className="flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4"/>
            {getButtonText(true)} (Additional charge)
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
