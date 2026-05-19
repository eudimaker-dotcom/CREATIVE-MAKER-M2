export interface PSDTemplate {
  id: string;
  title: string;
  category: string;
  image: string;
  gallery: string[];
  description: string;
  fileSize: string;
  resolution: string;
  colors: string[];
  format?: string;
  editable?: boolean;
  isPremium?: boolean;
}

export interface CartItem extends PSDTemplate {
  addedAt: number;
}
