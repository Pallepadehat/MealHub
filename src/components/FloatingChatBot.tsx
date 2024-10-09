'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from 'lucide-react';
import { AIChatInterface } from '@/components/AIChatInterface';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 rounded-full size-12 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 w-96 bg-background rounded-lg shadow-xl overflow-hidden"
          >
            <AIChatInterface />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
