import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface SuggestedItem {
  name: string;
  quantity: string;
}

interface SuggestedItemsListProps {
  items: SuggestedItem[];
  onAddItem: (item: SuggestedItem) => void;
  isLoading: boolean;
}

export function SuggestedItemsList({ items, onAddItem, isLoading }: SuggestedItemsListProps) {
  return (
    <div className="mt-4 bg-secondary/20 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Suggested Items:</h3>
      {isLoading ? (
        <div className="flex items-center justify-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <AnimatePresence>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between bg-background p-3 rounded-md shadow-sm"
              >
                <span className="font-medium">{item.name} <span className="text-sm text-muted-foreground">({item.quantity})</span></span>
                <Button size="sm" onClick={() => onAddItem(item)} variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>
      )}
    </div>
  );
}
