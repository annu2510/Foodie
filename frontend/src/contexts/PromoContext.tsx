import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

interface PromoCode {
  _id: string;
  code: string;
  description: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
}

interface PromoContextType {
  promoCodes: PromoCode[];
  isLoading: boolean;
  error: string | null;
  getPromoCodes: () => Promise<void>;
  validatePromoCode: (code: string, orderAmount: number) => Promise<{
    promoCode: PromoCode;
    discount: number;
  }>;
  addPromoCode: (promoData: Partial<PromoCode>) => Promise<PromoCode>;
  updatePromoCode: (id: string, promoData: Partial<PromoCode>) => Promise<PromoCode>;
  deletePromoCode: (id: string) => Promise<void>;
}

const PromoContext = createContext<PromoContextType | undefined>(undefined);

export const PromoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Load promo codes on mount
  useEffect(() => {
    getPromoCodes();
  }, []);

  const getPromoCodes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/promo`);
      setPromoCodes(response.data);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      setError('Failed to load promo codes');
    } finally {
      setIsLoading(false);
    }
  };

  const validatePromoCode = async (code: string, orderAmount: number) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/promo/validate`, {
        code,
        orderAmount
      });
      return response.data;
    } catch (error) {
      console.error('Error validating promo code:', error);
      throw error;
    }
  };

  const addPromoCode = async (promoData: Partial<PromoCode>) => {
    try {
      if (user?.role !== 'admin') {
        throw new Error('Not authorized');
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/promo`, promoData);
      setPromoCodes(prevCodes => [...prevCodes, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding promo code:', error);
      throw error;
    }
  };

  const updatePromoCode = async (id: string, promoData: Partial<PromoCode>) => {
    try {
      if (user?.role !== 'admin') {
        throw new Error('Not authorized');
      }

      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/promo/${id}`, promoData);
      setPromoCodes(prevCodes =>
        prevCodes.map(code =>
          code._id === id ? response.data : code
        )
      );
      return response.data;
    } catch (error) {
      console.error('Error updating promo code:', error);
      throw error;
    }
  };

  const deletePromoCode = async (id: string) => {
    try {
      if (user?.role !== 'admin') {
        throw new Error('Not authorized');
      }

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/promo/${id}`);
      setPromoCodes(prevCodes => prevCodes.filter(code => code._id !== id));
    } catch (error) {
      console.error('Error deleting promo code:', error);
      throw error;
    }
  };

  return (
    <PromoContext.Provider
      value={{
        promoCodes,
        isLoading,
        error,
        getPromoCodes,
        validatePromoCode,
        addPromoCode,
        updatePromoCode,
        deletePromoCode
      }}
    >
      {children}
    </PromoContext.Provider>
  );
};

export const usePromo = () => {
  const context = useContext(PromoContext);
  if (context === undefined) {
    throw new Error('usePromo must be used within a PromoProvider');
  }
  return context;
}; 