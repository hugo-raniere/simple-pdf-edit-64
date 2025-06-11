
import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PDFUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export const PDFUpload: React.FC<PDFUploadProps> = ({ onUpload, isLoading }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Por favor, selecione apenas arquivos PDF');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast.error('O arquivo deve ter no máximo 10MB');
      return;
    }

    onUpload(file);
    toast.success('PDF carregado com sucesso!');
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <FileText className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-semibold text-foreground">
            Editor de PDF
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Edite textos em seus documentos PDF de forma simples e rápida
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200
            ${isDragOver 
              ? 'border-primary bg-primary/5 scale-105' 
              : 'border-border hover:border-primary/50 hover:bg-accent/50'
            }
            ${isLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          `}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileInput}
            className="hidden"
            disabled={isLoading}
          />
          
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className={`p-4 rounded-full transition-colors ${
                isDragOver ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <Upload className="w-8 h-8" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-foreground">
                {isLoading ? 'Processando PDF...' : 'Envie seu PDF'}
              </h3>
              <p className="text-muted-foreground">
                Arraste e solte ou clique para selecionar
              </p>
            </div>

            {!isLoading && (
              <Button 
                variant="outline" 
                className="mt-4 px-8 py-2 h-auto text-base font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById('file-input')?.click();
                }}
              >
                Escolher arquivo
              </Button>
            )}

            {isLoading && (
              <div className="flex items-center justify-center space-x-2 text-primary">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm font-medium">Carregando...</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="bg-muted/50 rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Informações importantes</span>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Apenas arquivos PDF são suportados</p>
            <p>• Tamanho máximo: 10MB</p>
            <p>• Seus arquivos são processados com segurança</p>
          </div>
        </div>
      </div>
    </div>
  );
};
