import { AdminProduct, AdminClient, DashboardStats } from './types';
import { TEMPLATES } from '../constants';
import { supabase } from '../lib/supabase';

// Helper to check if Supabase is properly configured
const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- LOCAL STORAGE DB ---
const getLocalProducts = (): AdminProduct[] => {
  const saved = localStorage.getItem('admin_products');
  if (saved) return JSON.parse(saved);
  // Default to TEMPLATES
  const defaultProducts = TEMPLATES.map(t => ({
    ...t,
    price: 15,
    tags: [t.category.toLowerCase()],
    downloads_count: Math.floor(Math.random() * 200) + 10,
    likes_count: Math.floor(Math.random() * 50) + 5,
    created_at: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    published: true,
  }));
  localStorage.setItem('admin_products', JSON.stringify(defaultProducts));
  return defaultProducts;
};

const saveLocalProducts = (products: AdminProduct[]) => {
  localStorage.setItem('admin_products', JSON.stringify(products));
};

const getLocalClients = (): AdminClient[] => {
  const saved = localStorage.getItem('admin_clients');
  if (saved) return JSON.parse(saved);
  const defaultClients: AdminClient[] = [
    { id: '1', name: 'João Silva', email: 'joao@email.com', downloads_count: 5, products_downloaded: ['1', '3'], created_at: '2026-05-01T10:00:00Z' },
    { id: '2', name: 'Ana Costa', email: 'ana@email.com', downloads_count: 3, products_downloaded: ['2'], created_at: '2026-05-05T14:30:00Z' },
    { id: '3', name: 'Carlos Mendes', email: 'carlos@email.com', downloads_count: 8, products_downloaded: ['1', '2', '5', '6'], created_at: '2026-04-20T09:00:00Z' },
    { id: '4', name: 'Maria Santos', email: 'maria@email.com', downloads_count: 2, products_downloaded: ['4'], created_at: '2026-05-10T16:00:00Z' },
    { id: '5', name: 'Pedro Lopes', email: 'pedro@email.com', downloads_count: 12, products_downloaded: ['1', '2', '3', '7', '8'], created_at: '2026-04-15T11:00:00Z' },
  ];
  localStorage.setItem('admin_clients', JSON.stringify(defaultClients));
  return defaultClients;
};

let visitCount = parseInt(localStorage.getItem('admin_visits') || '0', 10);
if (visitCount === 0) {
  visitCount = Math.floor(Math.random() * 5000) + 1000;
  localStorage.setItem('admin_visits', String(visitCount));
}
// --------------------------

export async function getProducts(): Promise<AdminProduct[]> {
  if (hasSupabase) {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return data as AdminProduct[];
  }
  
  return [...getLocalProducts()].sort((a, b) =>
    new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
  );
}

export async function getProduct(id: string): Promise<AdminProduct | null> {
  if (hasSupabase) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) return null;
    return data as AdminProduct;
  }
  return getLocalProducts().find(p => p.id === id) || null;
}

export async function saveProduct(product: Partial<AdminProduct> & { id?: string }): Promise<AdminProduct> {
  if (hasSupabase) {
    const { id, ...rest } = product;
    // Update if id exists and isn't empty string
    if (id && id.trim() !== '') {
      const { data, error } = await supabase.from('products').update(rest).eq('id', id).select().single();
      if (error) throw error;
      return data as AdminProduct;
    } else {
      // Insert
      const { data, error } = await supabase.from('products').insert([rest]).select().single();
      if (error) throw error;
      return data as AdminProduct;
    }
  }

  // Fallback logic (LocalStorage)
  let localProducts = getLocalProducts();
  if (product.id && product.id.trim() !== '' && localProducts.find(p => p.id === product.id)) {
    localProducts = localProducts.map(p =>
      p.id === product.id ? { ...p, ...product } as AdminProduct : p
    );
    saveLocalProducts(localProducts);
    return localProducts.find(p => p.id === product.id)!;
  } else {
    const newProduct: AdminProduct = {
      id: Date.now().toString(),
      title: '', category: '', image: '', gallery: [], description: '',
      fileSize: '', resolution: '300 DPI', colors: ['#6366F1', '#A855F7', '#1E1B4B'],
      price: 15, tags: [], downloads_count: 0, likes_count: 0,
      created_at: new Date().toISOString(), published: true,
      ...product,
    };
    localProducts.unshift(newProduct);
    saveLocalProducts(localProducts);
    return newProduct;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  if (hasSupabase) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  let localProducts = getLocalProducts();
  localProducts = localProducts.filter(p => p.id !== id);
  saveLocalProducts(localProducts);
}

export async function getClients(): Promise<AdminClient[]> {
  if (hasSupabase) {
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data as AdminClient[];
  }
  return [...getLocalClients()].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const products = await getProducts();
  const clients = await getClients();
  
  const totalDownloads = products.reduce((sum, p) => sum + (p.downloads_count || 0), 0);
  const totalLikes = products.reduce((sum, p) => sum + (p.likes_count || 0), 0);

  const topProducts = [...products]
    .sort((a, b) => (b.downloads_count || 0) - (a.downloads_count || 0))
    .slice(0, 5)
    .map(p => ({ title: p.title, downloads: p.downloads_count || 0 }));

  return {
    total_products: products.length,
    total_downloads: totalDownloads,
    total_visits: visitCount,
    total_clients: clients.length,
    total_likes: totalLikes,
    top_products: topProducts,
    recent_products: products.slice(0, 5),
  };
}

export async function syncProductsToSite(): Promise<void> {
  const products = await getProducts();
  const published = products.filter(p => p.published);
  window.dispatchEvent(new CustomEvent('products-updated', { detail: published }));
}

// Added this function which might be used by App.tsx synchronously
export function getPublishedProducts(): AdminProduct[] {
  // Try to use window state or local fallback initially, async events update it later.
  return getLocalProducts()
    .filter(p => p.published)
    .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());
}
