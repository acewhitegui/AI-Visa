"use client"
import {Stepper} from "@/app/components/ui/shadcn/stepper";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import {Conversation} from "@/app/library/objects/types";
import {getConversation} from "@/app/library/services/conversation_service";
import {Questions} from "@/app/components/ui/steps/Questions";
import {Attachments} from "@/app/components/ui/steps/Attachments";
import {Messages} from "@/app/components/ui/steps/Messages";

export function Steps({locale, productId, conversationId}: {
  locale: string;
  productId: string;
  conversationId: string
}) {
  const [currentStep, setCurrentStep] = useState(0)

  const stepList = [
    {title: "Step 1", description: "Answer some questions", component: <Questions/>},
    {title: "Step 2", description: "Upload documents", component: <Attachments/>},
    {title: "Step 3", description: "Confirm check results with AI", component: <Messages/>},
  ]
  // session
  const {data: session} = useSession();
  const userToken = session?.user?.access_token
  if (!userToken) {
    redirect("/auth/login")
  }
  // 获取当前会话的详情
  useEffect(() => {
    const fetchConversation = async () => {
      const conversation: Conversation = await getConversation(userToken, conversationId);
      const step = conversation.step
      setCurrentStep(step)
    };

    fetchConversation();
  }, [conversationId, userToken]);

  return (
    <Stepper steps={stepList} currentStep={currentStep} onStepChange={setCurrentStep}>
      {/* 这部分是实际要展示的内容，根据step需要修改逻辑 */}
      {stepList[currentStep].component}
    </Stepper>
  )
}