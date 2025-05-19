"use client"
import {Stepper} from "@/app/components/ui/shadcn/stepper";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import {getConversation} from "@/app/library/services/conversation_service";
import {Questions} from "@/app/components/ui/steps/Questions";
import {Attachments} from "@/app/components/ui/steps/Attachments";
import {Messages} from "@/app/components/ui/steps/Messages";
import {toast} from "sonner";
import {Conversation} from "@/app/library/objects/types";

export function Steps({locale, productId, conversationId}: {
  locale: string;
  productId: string;
  conversationId: string
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [conversation, setConversation] = useState<Conversation>();
  // session
  const {data: session} = useSession();
  const userToken = session?.user?.access_token
  const userId = session?.user?.id || 0
  if (!userToken) {
    redirect("/auth/login")
  }

  const stepList = [
    {
      title: "Step 1",
      description: "Answer some questions",
      component: <Questions userToken={userToken} productId={productId} conversationId={conversationId}
                            conversation={conversation}
                            locale={locale} onStepChange={setCurrentStep}/>
    },
    {
      title: "Step 2",
      description: "Upload documents",
      component: <Attachments userToken={userToken} productId={productId} conversationId={conversationId}
                              locale={locale} onStepChange={setCurrentStep}/>
    },
    {
      title: "Step 3",
      description: "Pay and generate AI report",
      component: <Messages userId={userId} userToken={userToken} productId={productId} conversationId={conversationId}
                           locale={locale}/>
    },
  ]
  // 获取当前会话的详情
  useEffect(() => {
    const fetchConversation = async () => {
      const conversationObj = await getConversation(userToken, conversationId);
      if (!conversationObj) {
        toast.error("No conversation found, please try again")
        return
      }

      const step = conversationObj.step
      setCurrentStep(step)
      setConversation(conversationObj)
    };

    fetchConversation();
  }, [conversationId, userToken]);

  return (
    <Stepper steps={stepList} currentStep={currentStep} onStepChange={setCurrentStep}>
      {/* 这部分是实际要展示的内容，根据step需要修改逻辑 */}
      {
        stepList[currentStep].component
      }
    </Stepper>
  )
}