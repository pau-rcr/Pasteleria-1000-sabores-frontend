import { CartItem, OrderSummary, DiscountDetails } from "@/models/order";
import { User } from "@/models/user";
import { DISCOUNT_PERCENTAGES } from "@/config/constants";

function getAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

function isBirthdayToday(dateOfBirth: string): boolean {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  return (
    birthDate.getMonth() === today.getMonth() &&
    birthDate.getDate() === today.getDate()
  );
}

export function calculateOrderTotals(
  items: CartItem[],
  user: User | null,
  today: Date = new Date()
): OrderSummary & { discountDetails: DiscountDetails } {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  let discountByAge = 0;
  let discountByCode = 0;
  let birthdayBenefit = 0;
  
  const details: DiscountDetails = {
    age50Plus: false,
    felices50: false,
    birthday: false,
    amountByAge: 0,
    amountByCode: 0,
    amountBirthday: 0,
  };
  
  if (user) {
    const age = getAge(user.dateOfBirth);
    
    // 50% discount for users 50+
    if (age >= 50) {
      discountByAge = subtotal * DISCOUNT_PERCENTAGES.AGE_50_PLUS;
      details.age50Plus = true;
      details.amountByAge = discountByAge;
    }
    
    // 10% lifetime discount for FELICES50 promo code
    if (user.hasFelices50) {
      discountByCode = subtotal * DISCOUNT_PERCENTAGES.FELICES50;
      details.felices50 = true;
      details.amountByCode = discountByCode;
    }
    
    // Free cake for Duoc students on their birthday
    if (user.isDuocStudent && isBirthdayToday(user.dateOfBirth)) {
      // Find cheapest product or use a fixed benefit
      const cheapestPrice = items.length > 0
        ? Math.min(...items.map(item => item.product.price))
        : 0;
      birthdayBenefit = cheapestPrice;
      details.birthday = true;
      details.amountBirthday = birthdayBenefit;
    }
  }
  
  const totalDiscounts = discountByAge + discountByCode + birthdayBenefit;
  const total = Math.max(0, subtotal - totalDiscounts);
  
  return {
    subtotal,
    discountByAge,
    discountByCode,
    birthdayBenefit,
    total,
    discountDetails: details,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(amount);
}
