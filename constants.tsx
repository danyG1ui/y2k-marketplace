
import { Product } from './types';

declare global {
  interface Window {
    Y2K_CONFIG?: {
      shopName: string;
      currency: string;
      products: Product[];
    };
  }
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cyber_Chrome_Theme',
    price: '29,99€',
    description: 'Ultra-reflective metallic theme for React apps. Built with pure Y2K energy.',
    image: 'https://picsum.photos/seed/chrome1/800/800',
    category: 'Theme',
    checkoutUrl: '#'
  },
  {
    id: '2',
    name: 'Liquid_Blue_Vibe',
    price: '45,00€',
    description: 'Fluid animations and baby-blue aesthetic. Perfect for digital artists.',
    image: 'https://picsum.photos/seed/blue1/800/800',
    category: 'Template',
    checkoutUrl: '#'
  }
];

export const PRODUCTS: Product[] = window.Y2K_CONFIG?.products || FALLBACK_PRODUCTS;
export const SHOP_NAME: string = window.Y2K_CONFIG?.shopName || "LOCAL_HOST_OS";

export const CAMPAIGN_IMAGES = [
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1529133039926-08542214b72b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80'
];
