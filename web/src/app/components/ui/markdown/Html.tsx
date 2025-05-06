"use client"
import {FaCheck, FaCopy, FaHtml5, FaMarkdown, FaSync, FaTrash} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import DOMPurify from "dompurify";
import {useTranslations} from "next-intl";
import {DEFAULT_MARKDOWN} from "@/app/library/common/constants";
import Markdown from 'react-markdown'
import {renderToString} from "react-dom/server";
import remarkGfm from "remark-gfm";

const COPY_TIMEOUT = 2000;

export function ToHtml() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [htmlBuffer, setHtmlBuffer] = useState<Buffer | null>(null);
  const [copied, setCopied] = useState(false);
  const [textCopied, setTextCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const t = useTranslations("markdown");

  useEffect(() => {
    const processMarkdown = async () => {
      setIsProcessing(true);
      try {
        const rawHtml = renderToString(<Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>);
        const sanitizedHtml = DOMPurify.sanitize(rawHtml);
        setHtmlBuffer(Buffer.from(sanitizedHtml));
      } catch (error) {
        console.error('Error processing markdown:', error);
        setHtmlBuffer(Buffer.from('<p>Error converting markdown</p>'));
      } finally {
        setIsProcessing(false);
      }
    };

    processMarkdown();
  }, [markdown]);

  const getHtmlString = () => {
    return htmlBuffer ? htmlBuffer.toString() : '';
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getHtmlString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_TIMEOUT);
    });
  };

  const copyTextToClipboard = async () => {
    const text = document.createElement("div");
    text.innerHTML = getHtmlString();
    await navigator.clipboard.writeText(text.textContent || "");
    setTextCopied(true);
    setTimeout(() => setTextCopied(false), COPY_TIMEOUT);
  };

  const resetMarkdown = () => {
    setMarkdown(DEFAULT_MARKDOWN || "");
  };

  const clearMarkdown = () => {
    setMarkdown("");
  };

  return (
    <div className="container mx-auto">
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Markdown Input */}
          <EditorPanel
            icon={<FaMarkdown className="text-2xl text-blue-400 mr-2"/>}
            value={markdown}
            onChange={setMarkdown}
            placeholder="Type your markdown here..."
            onReset={resetMarkdown}
            onClear={clearMarkdown}
            isProcessing={isProcessing}
          />
          {/* HTML Output */}
          <OutputPanel
            html={getHtmlString()}
            copied={copied}
            onCopy={copyToClipboard}
            isProcessing={isProcessing}
          />
        </div>
      </section>
      <section>
        {/* Preview Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">{t("html-preview")}</h2>
            <button
              onClick={copyTextToClipboard}
              className="flex items-center bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105 active:scale-95"
              disabled={isProcessing}
            >
              {textCopied ? (
                <FaCheck className="mr-2 animate-pulse"/>
              ) : (
                <FaCopy className="mr-2"/>
              )}
              {textCopied ? t("copied") : t("copy-text")}
            </button>
          </div>
          <div
            className={`markdown w-full p-6 bg-gray-100 text-gray-900 rounded-lg overflow-auto prose prose-indigo ${
              isProcessing ? 'opacity-50' : 'opacity-100'
            } transition-opacity duration-300`}
            dangerouslySetInnerHTML={{__html: getHtmlString()}}
          />
        </div>
      </section>
    </div>
  )
}

type EditorPanelProps = {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onReset: () => void;
  onClear: () => void;
  isProcessing: boolean;
};

function EditorPanel({icon, value, onChange, placeholder, onReset, onClear, isProcessing}: EditorPanelProps) {
  const t = useTranslations("markdown")
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-2xl font-semibold">{t("markdown-input")}</h2>
      </div>
      <div className="relative">
        <textarea
          className={`w-full h-96 p-4 bg-gray-700 text-white rounded-md font-mono transition-all duration-300 ${
            isProcessing ? 'opacity-50' : 'opacity-100'
          } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={isProcessing}
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-all duration-300 transform hover:scale-110 active:scale-95"
            onClick={onReset}
            disabled={isProcessing}
          >
            <FaSync className={isProcessing ? 'animate-spin' : ''}/>
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-all duration-300 transform hover:scale-110 active:scale-95"
            onClick={onClear}
            disabled={isProcessing}
          >
            <FaTrash/>
          </button>
        </div>
      </div>
    </div>
  );
}

type OutputPanelProps = {
  html: string;
  copied: boolean;
  onCopy: () => void;
  isProcessing: boolean;
};

function OutputPanel({html, copied, onCopy}: OutputPanelProps) {
  const t = useTranslations("markdown")
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaHtml5 className="text-2xl text-orange-500 mr-2"/>
          <h2 className="text-2xl font-semibold">{t("html-output")}</h2>
        </div>
        <button
          onClick={onCopy}
          className="flex items-center bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-md transition duration-300"
        >
          {copied ? <FaCheck className="mr-2"/> : <FaCopy className="mr-2"/>}
          {copied ? t("copied") : t("copy-html")}
        </button>
      </div>
      <div className="w-full h-96 p-4 bg-gray-700 text-white rounded-md overflow-auto font-mono">
        <pre className="whitespace-pre-wrap">{html}</pre>
      </div>
    </div>
  );
}