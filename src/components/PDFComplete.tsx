
import React from 'react';
import { CheckCircle, Download, FileText, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFCompleteProps {
  fileName: string;
  onDownload: () => void;
  onNewPDF: () => void;
}

export const PDFComplete: React.FC<PDFCompleteProps> = ({
  fileName,
  onDownload,
  onNewPDF
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl text-center space-y-8 animate-fade-in">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-green-500/10 p-6 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold text-foreground">
            PDF editado com sucesso!
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Suas alterações foram aplicadas e o documento está pronto para download.
          </p>
        </div>

        {/* File Info */}
        <div className="bg-card border border-border rounded-xl p-6 max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground">
                {fileName.replace('.pdf', '_editado.pdf')}
              </p>
              <p className="text-sm text-muted-foreground">
                PDF editado
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={onDownload}
            size="lg"
            className="px-8 py-3 h-auto text-base font-medium"
          >
            <Download className="w-5 h-5 mr-2" />
            Baixar PDF editado
          </Button>

          <div className="pt-4">
            <Button
              onClick={onNewPDF}
              variant="outline"
              size="lg"
              className="px-8 py-3 h-auto text-base font-medium"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Editar outro PDF
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-muted/50 rounded-xl p-6 text-left max-w-md mx-auto">
          <h3 className="font-medium text-foreground mb-3">O que foi editado:</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Textos modificados preservaram a formatação original</p>
            <p>• Layout e estrutura do documento mantidos</p>
            <p>• Qualidade visual preservada</p>
          </div>
        </div>
      </div>
    </div>
  );
};
