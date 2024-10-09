import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShoppingListItem {
  name: string;
  quantity: string;
}

interface ShoppingListUpdateProps {
  items: ShoppingListItem[];
}

export function ShoppingListUpdate({ items }: ShoppingListUpdateProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Added to Shopping List</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center bg-secondary/50 p-2 rounded-md"
              >
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                {item.name} ({item.quantity})
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </CardContent>
    </Card>
  );
}
