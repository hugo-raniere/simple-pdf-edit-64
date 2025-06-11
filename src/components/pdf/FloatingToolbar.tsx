
import React from 'react';
import { Type, MousePointer, Hand } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingToolbarProps {
  activeTool: 'select' | 'text' | 'pan';
  onToolChange: (tool: 'select' | 'text' | 'pan') => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  activeTool,
  onToolChange
}) => {
  return (
    <div className="fixed left-6 top-1/2 transform -translate-y-1/2 bg-white shadow-lg border border-gray-200 rounded-lg p-2 space-y-2 z-40">
      <Button
        variant={activeTool === 'select' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onToolChange('select')}
        title="Selecionar (V)"
        className="w-10 h-10 p-0"
      >
        <MousePointer className="w-4 h-4" />
      </Button>
      
      <Button
        variant={activeTool === 'text' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onToolChange('text')}
        title="Adicionar texto (T)"
        className="w-10 h-10 p-0"
      >
        <Type className="w-4 h-4" />
      </Button>
      
      <Button
        variant={activeTool === 'pan' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onToolChange('pan')}
        title="Mover (H)"
        className="w-10 h-10 p-0"
      >
        <Hand className="w-4 h-4" />
      </Button>
    </div>
  );
};
