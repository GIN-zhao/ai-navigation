"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SearchEngine {
  id: string;
  name: string;
  icon: JSX.Element;
  searchUrl: string;
}

const searchEngines: SearchEngine[] = [
  {
    id: 'local',
    name: '站内',
    icon: <Search className="h-4 w-4 text-primary" />,
    searchUrl: '',
  },
  {
    id: 'baidu',
    name: '百度',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.71 3.37c1.54-.8 3.31.2 3.31 1.56 0 1.96-2.37 5.25-2.37 5.25s2.8-1.17 2.8-4.11c0-2.37-2.14-3.49-3.74-2.7zm-1.42 0c-1.6-.79-3.74.33-3.74 2.7 0 2.94 2.8 4.11 2.8 4.11S8 6.89 8 4.93c0-1.36 1.77-2.36 3.31-1.56zm7.09 5.56c-.85-1.6-3.44-2.71-3.44-2.71s2.21 2.1 2.21 4.21c0 1.88-1.7 3.46-3.82 3.46-2.12 0-3.82-1.58-3.82-3.46h-1c0 1.88-1.7 3.46-3.82 3.46-2.12 0-3.82-1.58-3.82-3.46 0-2.11 2.21-4.21 2.21-4.21S.84 7.33 0 8.93c-1.06 2.01-.79 4.52.77 6.09 2.65 2.65 6.14 1.8 7.73.31 1.59 1.49 5.08 2.34 7.73-.31 1.56-1.57 1.83-4.08.77-6.09zM8.62 15.5c-.51 1.63-2.55 2.38-4.11 1.72-1.39-.59-1.91-2.38-1.91-2.38s.67 3.88 3.27 3.88c2.6 0 3.26-2.39 2.75-3.22zm10.78-.66s-.52 1.79-1.91 2.38c-1.56.66-3.6-.09-4.11-1.72-.51.83.15 3.22 2.75 3.22 2.6 0 3.27-3.88 3.27-3.88z"/>
      </svg>
    ),
    searchUrl: 'https://www.baidu.com/s?wd=',
  },
  {
    id: 'google',
    name: 'Google',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    searchUrl: 'https://www.google.com/search?q=',
  },
];

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchBox({ value, onChange, className }: SearchBoxProps) {
  const [selectedEngine, setSelectedEngine] = useState<SearchEngine>(searchEngines[0]);

  const handleSearch = () => {
    if (!value.trim()) return;
    
    if (selectedEngine.id === 'local') {
      // 站内搜索逻辑由父组件处理
      return;
    }

    // 外部搜索引擎
    window.open(selectedEngine.searchUrl + encodeURIComponent(value), '_blank');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <motion.div 
      className={`relative group ${className}`}
      layout
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition-all duration-500" />
      <div className="relative flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 gap-2 px-3 hover:bg-transparent data-[state=open]:bg-muted/50"
            >
              {selectedEngine.icon}
              <span className="hidden sm:inline font-medium">{selectedEngine.name}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[150px]">
            {searchEngines.map((engine) => (
              <DropdownMenuItem
                key={engine.id}
                onClick={() => setSelectedEngine(engine)}
                className="gap-2"
              >
                {engine.icon}
                <span className="font-medium">{engine.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 group-hover:text-primary/60 transition-colors duration-300" />
          <Input
            type="search"
            placeholder="搜索AI工具、教程、资源..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full h-10 pl-10 pr-4 bg-background/60 backdrop-blur-xl border-primary/20 hover:border-primary/40 focus:border-primary transition-all duration-300"
          />
        </div>

        <Button
          variant="default"
          size="sm"
          className="h-10 px-4"
          onClick={handleSearch}
        >
          搜索
        </Button>
      </div>
    </motion.div>
  );
}