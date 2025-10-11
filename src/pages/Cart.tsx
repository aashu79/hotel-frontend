import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

export const Cart: React.FC = () => {
  const { state, dispatch } = useCart();
  const { toast } = useToast();
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  useEffect(() => {
    try {
      const rows = state.items.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        total: Number((it.price * it.quantity).toFixed(2)),
      }));
      
      // Calculate final total with tax and delivery fee
      const subtotal = state.total;
      const tax = subtotal * 0.085;
      const deliveryFee = 3.99;
      const finalTotal = subtotal + tax + deliveryFee;
      
      // Log individual items
      console.table(rows);
      
      // Log final totals
      console.log('=== CART TOTALS ===');
      console.log('Subtotal:', `$${subtotal.toFixed(2)}`);
      console.log('Tax (8.5%):', `$${tax.toFixed(2)}`);
      console.log('Delivery Fee:', `$${deliveryFee.toFixed(2)}`);
      console.log('FINAL TOTAL:', `$${finalTotal.toFixed(2)}`);
      console.log('==================');
      
      // Store final total for backend
      const cartData = {
        items: rows,
        subtotal: subtotal,
        tax: tax,
        deliveryFee: deliveryFee,
        finalTotal: finalTotal
      };
      
      // Store in localStorage for backend access
      localStorage.setItem('cartData', JSON.stringify(cartData));
      
    } catch (error) {
      console.error('Error calculating cart totals:', error);
    }
  }, [state.items, state.total]);

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: string, name: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    toast({
      title: 'Item Removed',
      description: `${name} removed from cart`,
      className: 'glass-medium border-red-500/50',
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: 'Cart Cleared',
      description: 'All items removed from cart',
      className: 'glass-medium border-yellow-500/50',
    });
  };

  const handleCheckout = async () => {
    // Debug: Check authentication status
    console.log('Authentication status:', isAuthenticated);
    console.log('Token from AuthContext:', token);
    console.log('All cookies:', document.cookie);
    
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to proceed with checkout',
        className: 'glass-medium border-red-500/50',
      });
      return;
    }

    if (state.items.length === 0) {
      toast({
        title: 'Cart Empty',
        description: 'Please add items to your cart before checkout',
        className: 'glass-medium border-yellow-500/50',
      });
      return;
    }

    setIsCheckoutLoading(true);

    try {
      // Prepare order data
      const orderArray = state.items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      }));

      // Calculate final total (subtotal + tax + delivery fee)
      const subtotal = state.total;
      const tax = subtotal * 0.085;
      const deliveryFee = 3.99;
      const totalAmount = subtotal + tax + deliveryFee;

      // Make API request to backend
      const response = await axios.post('http://localhost:3000/order/createOrder', {
        orderArray,
        totalAmount
      }, {
        withCredentials: true // Include cookies for authentication
      });

      if (response.status === 201) {
        // Clear cart on successful order
        dispatch({ type: 'CLEAR_CART' });
        
        toast({
          title: 'Order Placed Successfully!',
          description: `Order #${response.data.order.orderId} has been created`,
          className: 'glass-medium border-green-500/50',
        });

        // Log the successful order
        console.log('Order created:', response.data.order);
        
        navigate('/');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      
      let errorMessage = 'Failed to place order. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Please login to place an order';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid order data. Please check your cart.';
      }

      toast({
        title: 'Checkout Failed',
        description: errorMessage,
        className: 'glass-medium border-red-500/50',
      });
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center pt-24">
        <div className="max-w-md mx-auto px-6">
          <GlassCard className="p-8 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-elegant font-bold text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-300 mb-6">
              Looks like you haven't added any delicious dishes to your cart yet.
            </p>
            <Link to="/menu">
              <Button className="btn-premium">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Explore Menu
              </Button>
            </Link>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-bg pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-elegant font-bold text-premium mb-2">
              Your Cart
            </h1>
            <p className="text-gray-300">
              {state.items.length} {state.items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          
          <div className="hidden md:block">
            <Link to="/menu">
              <Button variant="outline" className="glass-medium border-white/30 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item, index) => (
              <GlassCard 
                key={`${item.id}-${index}`} 
                className="p-6 animate-fadeInUp group hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Item Image */}
                  <div className="w-full sm:w-24 h-24 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🍽️</span>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                    <p className="text-orange-400 font-semibold">${item.price} each</p>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex flex-col items-end gap-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full glass-light border-white/30 hover:border-orange-400 hover:scale-110 active:scale-95 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      
                      <span className="text-white font-semibold min-w-[2rem] text-center bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent transition-all duration-300 hover:scale-110">
                        {item.quantity}
                      </span>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full glass-light border-white/30 hover:border-orange-400 hover:scale-110 active:scale-95 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Item Total */}
                    <p className="text-amber-400 font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    {/* Remove Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.id, item.name)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}

            {/* Clear Cart Button */}
            <div className="pt-4">
              <Button
                variant="outline"
                onClick={clearCart}
                className="glass-medium border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6 sticky top-28">
              <h3 className="text-2xl font-elegant font-bold text-premium mb-6">
                Order Summary
              </h3>

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-300">
                  <span>Tax (8.5%)</span>
                  <span>${(state.total * 0.085).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-300">
                  <span>Delivery Fee</span>
                  <span>$3.99</span>
                </div>
                
                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span className="text-orange-400">
                      ${(state.total + (state.total * 0.085) + 3.99).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button 
                className="w-full btn-premium mb-4"
                onClick={handleCheckout}
                disabled={isCheckoutLoading || !isAuthenticated}
              >
                {isCheckoutLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </Button>

              <Link to="/menu" className="block md:hidden">
                <Button variant="outline" className="w-full glass-medium border-white/30 text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};