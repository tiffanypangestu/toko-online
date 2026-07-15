import { useCartContext } from '@/context/CartContext';

export function useCart() {
  const context = useCartContext();

  return {
    cartItems: context.cartItems,
    isInitialized: context.isInitialized,
    appliedVoucher: context.appliedVoucher,
    discountPercentage: context.discountPercentage,
    addItem: context.addItem,
    removeItem: context.removeItem,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
    applyVoucher: context.applyVoucher,
    removeVoucher: context.removeVoucher,
    getSubtotal: context.getSubtotal,
    getDiscountAmount: context.getDiscountAmount,
    getShippingFee: context.getShippingFee,
    getGrandTotal: context.getGrandTotal,
    getTotalItems: context.getTotalItems,
    getCart: () => context.cartItems, // Returns the current cart items
  };
}
export default useCart;
