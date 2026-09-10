'use client';

import { useRef, useState } from 'react';

interface FileUploadProps {
  id: string;
  name: string;
  label: string;
  accept?: string;
  required?: boolean;
  onFileSelect?: (file: File | null) => void;
}

export default function FileUpload({ id, name, accept = 'image/*', required = false, onFileSelect }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file?.name || null);
    onFileSelect?.(file);
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = ev => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <label
      htmlFor={id}
      className={`flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed cursor-pointer transition ${
        fileName
          ? 'border-teal-500/40 bg-teal-500/5'
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
      }`}
    >
      {preview ? (
        <img src={preview} alt="preview" className="h-full w-full object-cover rounded-xl" />
      ) : (
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          {fileName ? (
            <p className="text-teal-400 text-xs font-medium truncate max-w-full">{fileName}</p>
          ) : (
            <>
              <p className="text-slate-400 text-xs"><span className="text-teal-400 font-semibold">Click to upload</span> or drag & drop</p>
              <p className="text-slate-600 text-[10px]">PNG, JPG, PDF up to 10MB</p>
            </>
          )}
        </div>
      )}
      <input ref={inputRef} id={id} name={name} type="file" accept={accept} required={required} onChange={handleChange} className="hidden" />
    </label>
  );
}
