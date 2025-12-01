import { OrderSummary, DiscountDetails } from "@/models/order";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/discounts";
import { Gift, Sparkles, Cake } from "lucide-react";

interface CartSummaryProps {
  summary: OrderSummary & { discountDetails: DiscountDetails };
  onCheckout: () => void;
  isLoading?: boolean;
}

export function CartSummary({ summary, onCheckout, isLoading }: CartSummaryProps) {
  const hasDiscounts =
    summary.discountByAge > 0 ||
    summary.discountByCode > 0 ||
    summary.birthdayBenefit > 0;

  return (
    <Card className="p-6 space-y-4 shadow-card">
      <h2 className="text-2xl font-bold">Resumen del Pedido</h2>

      <div className="space-y-3">
        <div className="flex justify-between text-lg">
          <span>Subtotal</span>
          <span className="font-semibold">{formatCurrency(summary.subtotal)}</span>
        </div>

        {hasDiscounts && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-primary flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Tus Beneficios:
              </p>

              {summary.discountDetails.age50Plus && (
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      50+
                    </Badge>
                    <span className="text-muted-foreground">Descuento 50%</span>
                  </div>
                  <span className="text-primary font-medium">
                    -{formatCurrency(summary.discountByAge)}
                  </span>
                </div>
              )}

              {summary.discountDetails.felices50 && (
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      FELICES50
                    </Badge>
                    <span className="text-muted-foreground">Descuento 10%</span>
                  </div>
                  <span className="text-primary font-medium">
                    -{formatCurrency(summary.discountByCode)}
                  </span>
                </div>
              )}

              {summary.discountDetails.birthday && (
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <Cake className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">¡Cumpleaños Duoc!</span>
                  </div>
                  <span className="text-primary font-medium">
                    -{formatCurrency(summary.birthdayBenefit)}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        <Separator />

        <div className="flex justify-between text-2xl font-bold text-primary">
          <span>Total</span>
          <span>{formatCurrency(summary.total)}</span>
        </div>
      </div>

      <Button
        size="lg"
        variant="hero"
        className="w-full text-lg"
        onClick={onCheckout}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Gift className="h-5 w-5 animate-pulse" />
            Procesando...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Confirmar Pedido
          </span>
        )}
      </Button>

      {hasDiscounts && (
        <p className="text-xs text-center text-muted-foreground">
          ¡Has ahorrado {formatCurrency(summary.discountByAge + summary.discountByCode + summary.birthdayBenefit)}!
        </p>
      )}
    </Card>
  );
}
