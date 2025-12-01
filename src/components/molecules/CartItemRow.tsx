import { CartItem } from "@/models/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { useState } from "react";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onUpdateMessage: (productId: number, message: string) => void;
  onRemove: (productId: number) => void;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onUpdateMessage,
  onRemove,
}: CartItemRowProps) {
  const [message, setMessage] = useState(item.messageForCake || "");

  const handleMessageBlur = () => {
    if (message !== item.messageForCake) {
      onUpdateMessage(item.product.id, message);
    }
  };

  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      <div className="w-24 h-24 rounded-md overflow-hidden bg-gradient-subtle flex-shrink-0 flex items-center justify-center">
        <Package className="w-12 h-12 text-muted-foreground/30" />
      </div>
      
      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg">{item.product.name}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.product.id)}
            className="text-destructive hover:text-destructive/90 flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.product.description || "Producto de pastelería"}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-12 text-center font-medium">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <span className="ml-auto text-lg font-bold text-primary">
            {formatCurrency(item.product.price * item.quantity)}
          </span>
        </div>

        <Input
          placeholder="Mensaje para la torta (opcional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={handleMessageBlur}
          className="text-sm"
        />
      </div>
    </div>
  );
}
