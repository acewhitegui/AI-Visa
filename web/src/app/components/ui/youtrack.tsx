"use client";
import React, {useEffect, useRef, useState} from "react";
import "@/app/assets/css/youtrack.css";

declare global {
  interface Window {
    YTFeedbackForm?: any;
  }
}

export function YoutrackForm({lang}: { lang: string }) {
  const formId = "9496ce92-9604-484c-b25a-ba8b01d20a04";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const container = document.getElementById("yt-form-container");
    if (!container) {
      setError("Form container not found in DOM");
      return;
    }

    // Remove any existing script
    const existingScript = document.getElementById(formId);
    if (existingScript) {
      existingScript.remove();
    }

    // Create the script element
    const script = document.createElement("script");
    script.id = formId;
    script.src = "https://whitedit.youtrack.cloud/static/simplified/form/form-entry.js";
    script.async = true;
    script.setAttribute("data-yt-url", "https://whitedit.youtrack.cloud");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", lang);
    scriptRef.current = script;

    setLoading(true);

    // Handle script load error
    script.onerror = () => {
      setError("Failed to load YouTrack form script");
      setLoading(false);
    };

    script.onload = () => {
      setLoading(false);
    };

    // Append script to the container (not body)
    container.appendChild(script);

    // Cleanup on unmount
    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
    };
  }, [lang]);

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="text-red-500 p-4 bg-opacity-20 rounded mb-4">
          Error: {error}
        </div>
      )}
      <div
        id="yt-form-container"
        data-yt-form-id={formId}
        className="flex justify-center p-6 rounded-lg shadow-lg"
      >
        {loading && (
          <div className="text-white p-4 rounded mb-4">
            Loading form...
          </div>
        )}
      </div>
    </div>
  );
}
