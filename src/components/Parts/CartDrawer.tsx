import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  ShieldCheck, 
  Store,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    isCartDrawerOpen, 
    setIsCartDrawerOpen,
    promoCode,
    discountRate,
    applyPromoCode,
    setCurrentPage 
  } = useApp();

  const [inputCoupon, setInputCoupon] = useState('');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  if (!isCartDrawerOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.part.price * item.quantity, 0);
  const discount = subtotal * discountRate;
  const tax = (subtotal - discount) * 0.0825;
  const total = subtotal - discount + tax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyPromoCode(inputCoupon);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartDrawerOpen(false)}
      >
        <div 
          className="absolute inset-y-0 right-0 max-w-full flex pl-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
            {/* Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-base">
                  Parts & Accessories Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
                </h3>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">Your cart is empty</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto mb-6">
                    Explore our genuine OEM parts and performance accessories catalog.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      setCurrentPage('parts');
                    }}
                    className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                  >
                    Browse Parts Catalog
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Selected Items
                    </span>
                    <button
                      onClick={clearCart}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Clear All
                    </button>
                  </div>

                  {cart.map((item) => (
                    <div
                      key={item.part.id}
                      className="flex gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50"
                    >
                      <img
                        src={item.part.image}
                        alt={item.part.name}
                        className="w-16 h-16 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                            {item.part.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.part.id)}
                            className="text-gray-400 hover:text-rose-600 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[10px] font-mono text-gray-400 mb-2">
                          {item.part.partNumber}
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Stepper */}
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white text-xs">
                            <button
                              onClick={() => updateCartQuantity(item.part.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 font-bold text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.part.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 font-bold"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-bold text-sm text-gray-900">
                            ${(item.part.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Promo code input */}
                  <form onSubmit={handleApplyCoupon} className="pt-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={inputCoupon}
                          onChange={(e) => setInputCoupon(e.target.value)}
                          placeholder="e.g. CARCRAFT10"
                          className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-300 text-xs uppercase font-mono focus:ring-1 focus:ring-blue-600"
                        />
                        <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                      </div>
                      <button
                        type="submit"
                        className="py-2 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold"
                      >
                        Apply
                      </button>
                    </div>
                    {promoCode && (
                      <div className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Code "{promoCode}" applied ({discountRate * 100}% off)
                      </div>
                    )}
                  </form>
                </>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-gray-200 bg-gray-50 space-y-3">
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">${subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated Sales Tax (8.25%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total Estimated</span>
                    <span className="text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          onSuccess={() => {
            setIsCheckoutModalOpen(false);
            setIsCartDrawerOpen(false);
            setCurrentPage('account');
          }}
        />
      )}
    </>
  );
};

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { cart, currentUser, placeOrder, discountRate } = useApp();

  const [deliveryMethod, setDeliveryMethod] = useState<'Express Delivery' | 'Dealership Pickup'>('Express Delivery');
  const [shippingAddress, setShippingAddress] = useState(currentUser.address || '742 Evergreen Terrace, San Francisco, CA 94107');
  const [paymentMethod, setPaymentMethod] = useState('Visa ending in 4242');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.part.price * item.quantity, 0);
  const discount = subtotal * discountRate;
  const shipping = deliveryMethod === 'Dealership Pickup' ? 0 : 25;
  const tax = (subtotal - discount) * 0.0825;
  const total = subtotal - discount + shipping + tax;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder({
        shippingAddress: deliveryMethod === 'Dealership Pickup' ? 'CarCraft Metro Flagship - Pickup Bay 2' : shippingAddress,
        deliveryMethod,
        paymentMethod
      });
      setIsSubmitting(false);
      onSuccess();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#111827] text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Checkout & Payment Simulation
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">CarCraft Dealership E-Commerce Portal</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-6 space-y-5">
          {/* Fulfillment options */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Delivery or Showroom Pickup
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setDeliveryMethod('Express Delivery')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  deliveryMethod === 'Express Delivery'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-gray-900">
                  <Truck className="w-4 h-4 text-blue-600" /> Express Delivery ($25)
                </div>
                <div className="text-[11px] text-gray-500 mt-1">1-2 Business Days via Courier</div>
              </label>

              <label
                onClick={() => setDeliveryMethod('Dealership Pickup')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  deliveryMethod === 'Dealership Pickup'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-gray-900">
                  <Store className="w-4 h-4 text-emerald-600" /> Showroom Pickup (Free)
                </div>
                <div className="text-[11px] text-gray-500 mt-1">Ready at Parts Counter today</div>
              </label>
            </div>
          </div>

          {/* Address */}
          {deliveryMethod === 'Express Delivery' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Shipping Address
              </label>
              <input
                type="text"
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-1 focus:ring-blue-600"
              />
            </div>
          )}

          {/* Payment method selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Payment Method
            </label>
            <div className="space-y-2">
              {[
                'Visa ending in 4242 (Express Card)',
                'Mastercard Platinum ending in 8891',
                'CarCraft Dealership Line of Credit (0% APR for 12 mos)',
                'Cash / Card on Showroom Pickup'
              ].map((method) => (
                <label
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                    paymentMethod === method
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="text-blue-600"
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Breakdown review */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1.5">
            <div className="flex justify-between text-gray-500">
              <span>Items Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>Fulfillment & Handling</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping}.00`}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Sales Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
              <span>Total Charged</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Processing Order...' : `Authorize & Place Order ($${total.toFixed(2)})`}
          </button>
        </form>
      </div>
    </div>
  );
};
