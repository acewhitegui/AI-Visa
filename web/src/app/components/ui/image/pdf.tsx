'use client';

import React, {useCallback, useRef, useState} from 'react';
import {imagesToPDF} from "@/app/library/services/images_service";
import {ImageItem, PDFResponse} from "@/app/library/objects/image";
import Link from "next/link";
import {Input} from "@/app/components/ui/input";
import {Textarea} from "@/app/components/ui/textarea";
import {Button} from "@/app/components/ui/shadcn/button";
import {Card, CardFooter} from "@/app/components/ui/shadcn/card";
import {Tooltip, TooltipProvider, TooltipTrigger} from "@/app/components/ui/tooltip";
import {TooltipContent} from "@radix-ui/react-tooltip";
import {useTranslations} from "next-intl";
import {clsx} from "clsx";


export default function ImageToPdfConverter() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [urls, setUrls] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = useTranslations("image");

  // File upload handler
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const fileReaders = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .map(file => new Promise<ImageItem>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(createImageItemFromFile(file, event.target?.result as string));
        };
        reader.readAsDataURL(file);
      }));

    Promise.all(fileReaders).then(newImages => {
      setImages(prev => [...prev, ...newImages]);
    });
  }, []);

  // URL submit handler
  const handleUrlSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!urls.trim()) return;

      const urlList = urls.split('\n').map(url => url.trim()).filter(Boolean);
      const validImages: ImageItem[] = [];
      let hasInvalid = false;

      urlList.forEach(url => {
        try {
          new URL(url);
          validImages.push(createImageItemFromUrl(url));
        } catch {
          setError(`Invalid URL: ${url}`);
          hasInvalid = true;
        }
      });

      if (validImages.length) setImages(prev => [...prev, ...validImages]);
      setUrls('');
      if (hasInvalid) setTimeout(() => setError(null), 3000);
    },
    [urls]
  );

  // Remove image handler
  const handleRemoveImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, []);

  // Reorder images handler
  const handleReorderImages = useCallback((startIndex: number, endIndex: number) => {
    setImages(prev => {
      const newImages = [...prev];
      const [movedItem] = newImages.splice(startIndex, 1);
      newImages.splice(endIndex, 0, movedItem);
      return newImages;
    });
  }, []);

  // Generate PDF handler
  const handleGeneratePdf = useCallback(async () => {
    setError(null);
    setDownloadUrl(null);
    if (images.length === 0) {
      setError('Please add at least one image');
      setTimeout(() => setError(null), 3000);
      return;
    }
    setIsGenerating(true);
    try {
      const data: PDFResponse = await imagesToPDF(images);
      setDownloadUrl(data.url);
    } catch {
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [images]);

  return (
    <Card className="container mx-auto rounded-lg shadow-md p-6 mb-12">
      {error && <ErrorMessage message={error}/>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Upload Section */}
        <div>
          <h3 className="text-lg font-medium mb-3">{t("upload-images")}</h3>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
            onClick={() => fileInputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const fileInput = fileInputRef.current;
                if (fileInput) {
                  // Create a new event and manually set the files
                  const event = {
                    target: fileInput,
                    currentTarget: fileInput
                  } as React.ChangeEvent<HTMLInputElement>;
                  // Set the files on the input element
                  Object.defineProperty(fileInput, 'files', {
                    value: e.dataTransfer.files,
                    writable: false
                  });
                  handleFileUpload(event);
                }
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*"
              className="hidden"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <p className="mt-2 text-sm text-gray-600">{t("upload-image-tips")}</p>
            <p className="text-xs text-gray-500">{t("upload-allow-types")}</p>
          </div>
        </div>

        {/* URL Input Section */}
        <div>
          <h3 className="text-lg font-medium mb-3">{t("add-image-urls")}</h3>
          <form onSubmit={handleUrlSubmit}>
            <Textarea
              className="w-full border p-3 h-36"
              placeholder={t("input-urls-tips")}
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
            />
            <Button
              type="submit"
              className="mt-2 py-2 px-4 transition"
            >
              {t("add-urls")}
            </Button>
          </form>
        </div>
      </div>

      {images.length > 0 && (
        <ImagePreviewGrid images={images} onRemove={handleRemoveImage} onReorder={handleReorderImages}/>
      )}

      <CardFooter className="flex flex-col items-center justify-center">
        {downloadUrl && (
          <DownloadButton url={downloadUrl} label={t("download")}/>
        )}
        <div className="my-4 flex items-center justify-center">
          <Button
            onClick={handleGeneratePdf}
            disabled={images.length === 0 || isGenerating}
            className={clsx(
              "py-3 px-6 rounded-lg font-medium transition",
              downloadUrl && "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
              (images.length === 0 || isGenerating) && "bg-gray-400 cursor-not-allowed"
            )}
          >
            {isGenerating ? t("generating") : t("generate-pdf")}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// Helper to create ImageItem from file
const createImageItemFromFile = (file: File, preview: string): ImageItem => ({
  id: Math.random().toString(36).substring(2, 9),
  type: 'file',
  file,
  preview,
});

// Helper to create ImageItem from url
const createImageItemFromUrl = (url: string): ImageItem => ({
  id: Math.random().toString(36).substring(2, 9),
  type: 'url',
  url,
  preview: url,
});

// Error message component
const ErrorMessage = ({message}: { message: string }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {message}
  </div>
);

// Image preview grid
const ImagePreviewGrid = ({
                            images,
                            onRemove,
                            onReorder,
                          }: {
  images: ImageItem[];
  onRemove: (id: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedIndex(index);
    // Set a custom drag image if needed
    if (e.target instanceof HTMLElement) {
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      onReorder(dragIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-3">Selected Images</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img, index) => (
          <div
            key={img.id}
            className={`relative group cursor-move border-2 ${
              draggedIndex === index
                ? 'border-blue-500 opacity-50'
                : draggedIndex !== null
                  ? 'border-dashed border-gray-300 hover:border-blue-300'
                  : 'border-transparent'
            } rounded-lg transition-all duration-200`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onDragEnter={handleDragEnter}
          >
            <img
              src={img.preview}
              alt="Preview"
              className="h-full w-full object-cover rounded-lg"
            />
            <Button
              onClick={() => onRemove(img.id)}
              className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </Button>
            {draggedIndex !== null && draggedIndex !== index && (
              <div className="absolute inset-0 bg-blue-100 bg-opacity-20 flex items-center justify-center rounded-lg">
                <div className="text-blue-500 text-xs font-medium">Drop here</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Download button with tooltip
const DownloadButton = ({url, label}: { url: string; label: string }) => {
  const t = useTranslations("image");
  return (
    <div className="flex items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center justify-center">
            <Button variant="link" className="text-white text-center flex flex-col justify-center">
              <Link
                href={url}
                download="images.pdf"
                className="py-3 px-6 rounded-lg transition"
              >
                {label}
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" align="center" className="ml-2">
            {t("tool-tips")}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};