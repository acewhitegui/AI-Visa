"use client"
import {Stepper} from "@/app/components/ui/shadcn/stepper";
import React, {useState} from "react";

export function Steps({locale, productId, conversationId}: {
  locale: string;
  productId: string;
  conversationId: string
}) {

  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {title: "Step 1", description: "Create your account"},
    {title: "Step 2", description: "Verify your email"},
    {title: "Step 3", description: "Confirm and finish"},
  ]

  return (
    <Stepper steps={steps} currentStep={currentStep} onStepChange={setCurrentStep}>
      <div className="my-8 p-4 border rounded-md">
        <h2 className="text-lg font-semibold mb-2 text-center">Current Step Content</h2>
        <p>{locale}-{productId}-{conversationId}</p>
        <p className="text-center">{steps[currentStep].description}</p>
      </div>
    </Stepper>
  )
}