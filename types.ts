
export interface Product {
  id: string;
  shopifyVariantId?: string;
  name: string;
  price: string;
  description: string;
  image: string;
  category: 'Theme' | 'Template' | 'Asset';
  checkoutUrl?: string;
}

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  zIndex: number;
  positionIndex: number; 
  type: 'shop' | 'about' | 'item' | 'ai' | 'archive' | 'games' | 'tetris' | 'pacman' | 'minesweeper' | 'chess' | 'durak' | 'player' | 'snake' | 'pong' | 'breakout' | 'flappy' | '2048' | 'dream' | 'system';
  data?: Product;
}
