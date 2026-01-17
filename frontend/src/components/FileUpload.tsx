import { useState, useRef, DragEvent } from "react";
import { Upload, X, File, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizePerFile?: number;
  maxTotalSize?: number;
}

export const FileUpload = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSizePerFile = 25 * 1024 * 1024, // 25MB
  maxTotalSize = 100 * 1024 * 1024, // 100MB
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const validateFiles = (newFiles: File[]): string | null => {
    const totalFiles = files.length + newFiles.length;
    if (totalFiles > maxFiles) {
      return `Можно загрузить максимум ${maxFiles} файлов`;
    }

    for (const file of newFiles) {
      if (file.size > maxSizePerFile) {
        return `Файл "${file.name}" превышает максимальный размер ${formatFileSize(maxSizePerFile)}`;
      }
    }

    const totalSize = [...files, ...newFiles].reduce((sum, file) => sum + file.size, 0);
    if (totalSize > maxTotalSize) {
      return `Общий размер файлов не должен превышать ${formatFileSize(maxTotalSize)}`;
    }

    return null;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return;

    const filesArray = Array.from(newFiles);
    const validationError = validateFiles(filesArray);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    onFilesChange([...files, ...filesArray]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
    setError("");
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          relative h-40 border-2 border-dashed rounded-2xl cursor-pointer
          transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center
          ${
            isDragging
              ? "border-secondary bg-secondary/5 scale-[1.02]"
              : "border-white/20 bg-surface/40 hover:border-primary hover:bg-primary/5"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png,.zip"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          aria-label="Загрузить файлы"
        />
        
        <Upload className="w-12 h-12 mb-3 text-muted-foreground" />
        <p className="text-base text-muted-foreground text-center px-4">
          Перетащите файлы сюда или нажмите для выбора
        </p>
        <p className="text-sm text-muted-foreground/70 mt-2">
          До {maxFiles} файлов, максимум {formatFileSize(maxSizePerFile)} каждый
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-error text-sm bg-error/10 px-4 py-3 rounded-lg"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 bg-surface/60 hover:bg-surface/80 px-4 py-3 rounded-xl transition-colors"
              >
                <File className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label={`Удалить файл ${file.name}`}
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
