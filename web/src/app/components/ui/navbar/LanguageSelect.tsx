"use client"
import React, {useState} from "react";
import {Language} from "@/app/library/objects/types";
import {LOCALE_DISPLAY_MAP} from "@/app/library/common/constants";
import {Button} from "@/app/components/ui/shadcn/button";


export function LanguageSelect({
                                 locale,
                                 languages,
                                 onChange,
                               }: {
  locale: string;
  languages: Language[];
  onChange: (code: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative min-w-20">
      <Button
        className="flex items-center rounded px-2 py-1"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{LOCALE_DISPLAY_MAP.get(locale)}</span>
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-1 bg-gray-700 rounded shadow-lg z-10">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`w-full text-left px-2 py-1 flex items-center hover:bg-gray-600 ${
                locale === lang.code ? "bg-gray-600" : ""
              }`}
              onClick={() => {
                onChange(lang.code);
                setIsOpen(false);
              }}
              type="button"
            >
              <span className="text-white">{lang.displayName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}