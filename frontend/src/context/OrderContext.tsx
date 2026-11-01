// src/context/OrderContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
  phone: string;
  note?: string;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (items: OrderItem[], shippingAddress: string, phone: string, note?: string) => void;
  getOrderById: (id: string) => Order | undefined;
  cancelOrder: (id: string) => void;
  getOrdersByStatus: (status: Order['status']) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from localStorage khi mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    }
  }, []);

  // Save orders to localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = (items: OrderItem[], shippingAddress: string, phone: string, note?: string) => {
    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      items,
      totalPrice: items.reduce((total, item) => total + item.price * item.quantity, 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
      shippingAddress,
      phone,
      note,
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  const cancelOrder = (id: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id ? { ...order, status: 'cancelled' as const } : order
      )
    );
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      getOrderById,
      cancelOrder,
      getOrdersByStatus,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};