"use client"
import React, {useState} from "react";
import {Stepper} from "@/app/components/ui/shadcn/stepper";

export default function StepsPage({params}: {
  params: {
    locale: string;
    id: string;
  }
}) {
  const {locale, id} = params;

  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {title: "Step 1", description: "Create your account"},
    {title: "Step 2", description: "Verify your email"},
    {title: "Step 3", description: "Confirm and finish"},
  ]

  return (
    <div className="container mx-auto">
      <Stepper steps={steps} currentStep={currentStep} onStepChange={setCurrentStep}>
        <div className="my-8 p-4 border rounded-md">
          <h2 className="text-lg font-semibold mb-2 text-center">Current Step Content</h2>
          <p className="text-center">{steps[currentStep].description}</p>
        </div>
      </Stepper>
    </div>
  )
}