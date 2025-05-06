export type ImageItem = {
  id: string;
  type: 'file' | 'url';
  file?: File;
  url?: string;
  preview: string;
};

export type PDFResponse = {
  url: string;
  expires: number;
  result: string;
}