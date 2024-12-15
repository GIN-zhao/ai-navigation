"use client";

import { motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ThumbsUp, ThumbsDown, Globe, ArrowUpRight, Heart } from 'lucide-react';
import { themeSettingsAtom } from '@/lib/atoms';
import { cn } from '@/lib/utils';
import { cardHoverVariants } from '@/lib/animations';
import type { Website, Category } from '@/lib/types';
import { useState } from 'react';
import { WebsiteThumbnail } from './website-thumbnail';
import { toast } from '@/hooks/use-toast';

interface WebsiteCardProps {
  website: Website;
  category?: Category;
  isAdmin: boolean;
  onVisit: (website: Website) => void;
  onStatusUpdate: (id: number, status: Website['status']) => void;
}

export function WebsiteCard({ website, category, isAdmin, onVisit, onStatusUpdate }: WebsiteCardProps) {
  const themeSettings = useAtomValue(themeSettingsAtom);
  const [likes, setLikes] = useState(website.likes);

  const statusColors = {
    pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    approved: 'bg-green-500/10 text-green-600 dark:text-green-400',
    rejected: 'bg-red-500/10 text-red-600 dark:text-red-400',
    all: '',
  };

  const statusText = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
    all: '',
  };

  const handleLike = async () => {
    const key = `website-${website.id}-liked`;
    if (localStorage.getItem(key)) {
      toast({
        title: "已点赞",
        description: "你已经点赞了，请过段时间再来吧 (｡•́︿•̀｡)",
      });
      return;
    }
    const method = 'POST';
    fetch(`/api/websites/${website.id}/like`, { method });
    localStorage.setItem(key, 'true');
    setLikes(likes + 1);
  };

  return (
    <motion.div
      variants={cardHoverVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      layout
      className="h-full"
    >
      <Card className={cn(
        "group relative h-full flex flex-col overflow-hidden",
        "bg-gradient-to-br from-background to-muted/30",
        "border-black/5 dark:border-white/5",
        "hover:border-primary/20 dark:hover:border-primary/20",
        "transition-all duration-300"
      )}>
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Website Icon and Status */}
        <div className="relative p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WebsiteThumbnail url={website.url} thumbnail={website.thumbnail} title={website.title} />
            <div className="space-y-1">
              <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                {website.title}
              </h3>
              <Badge variant="secondary" className={cn("font-normal text-xs", statusColors[website.status])}>
                {statusText[website.status]}
              </Badge>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className="text-xs font-normal bg-background/50 backdrop-blur-sm"
          >
            {category?.name || '未分类'}
          </Badge>
        </div>

        {/* Description */}
        <div className="relative px-4 pb-4 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {website.description}
          </p>
        </div>

        {/* Stats */}
        <div className="relative px-4 pb-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>{website.visits} 次访问</span>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{likes}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="relative p-4 pt-2 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVisit(website)}
            className="flex-1 h-9 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary"
          >
            <span className="flex-1">访问网站</span>
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLike}
            className={cn(
              "h-9 w-9 p-0 bg-background/50 backdrop-blur-sm",
              "hover:text-red-500"
            )}
          >
            <motion.div
              whileTap={{ scale: 1.4 }}
              transition={{ duration: 0.2 }}
            >
              <Heart className="h-4 w-4" />
            </motion.div>
          </Button>
          
          {isAdmin && website.status !== 'approved' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusUpdate(website.id, 'approved')}
              className="h-9 px-3 bg-background/50 backdrop-blur-sm hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400"
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
          )}
          
          {isAdmin && website.status !== 'rejected' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onStatusUpdate(website.id, 'rejected');
              }}
              className="h-9 px-3 bg-background/50 backdrop-blur-sm hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}