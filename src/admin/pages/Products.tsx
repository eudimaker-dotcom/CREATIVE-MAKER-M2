import React, { useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, X, Upload, ImagePlus, Layout, Monitor, Save, Send } from 'lucide-react';
import { AdminProduct } from '../types';
import { getProducts, saveProduct, deleteProduct, syncProductsToSite } from '../dataService';

const CATEGORIES = ['Branding', 'Digital', 'Fashion', 'Medical', 'Packaging', 'Print', 'Stationery', 'Abstract', 'Social Media', 'Outro'];
const FORMATS = ['PSD', 'ZIP', 'PNG', 'Figma', 'Sketch', 'AI', 'XD'];

function EmptyForm(): AdminProduct {
  return {
    id: '', title: '', category: 'Digital', image: '', gallery: [], description: '',
    fileSize: '', resolution: '300 DPI', colors: ['#6366F1', '#A855F7', '#1E1B4B'],
    format: 'PSD', editable: true, price: 0, tags: [], downloads_count: 0, likes_count: 0,
    published: true, psd_url: ''
  };
}

function ProductForm({ product, onSave, onCancel }: { product: AdminProduct; onSave: (p: AdminProduct) => void; onCancel: () => void; }) {
  const [form, setForm] = useState<AdminProduct>({ ...product });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewCover, setPreviewCover] = useState(form.image || '');
  const [previewGallery, setPreviewGallery] = useState<string[]>(form.gallery || []);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof AdminProduct, val: any) => setForm(f => ({ ...f, [key]: val }));

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const max_size = 800; // Resize to max 800px

          if (width > height && width > max_size) {
            height *= max_size / width;
            width = max_size;
          } else if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7)); // Convert to Base64 JPEG 70% quality
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File, isCover: boolean) => {
    const url = await compressImage(file);
    if (isCover) {
      setPreviewCover(url);
      set('image', url);
      if (!form.gallery.length) setPreviewGallery([url]);
    } else {
      setPreviewGallery(prev => {
        const combined = [...prev, url].slice(0, 6);
        set('gallery', combined);
        return combined;
      });
    }
  };

  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file, true);
  };

  const handleGalleryFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => processFile(file, false));
  };

  const handleDrop = (e: React.DragEvent, isCover: boolean) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (isCover && files[0]) processFile(files[0], true);
    else files.forEach(file => processFile(file, false));
  };

  const removeGalleryImg = (idx: number) => {
    const updated = previewGallery.filter((_, i) => i !== idx);
    setPreviewGallery(updated);
    set('gallery', updated);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags?.includes(t)) set('tags', [...(form.tags || []), t]);
    setTagInput('');
  };

  const removeTag = (t: string) => set('tags', (form.tags || []).filter(x => x !== t));

  const handlePublish = async (isPublished: boolean) => {
    // Basic validation
    if (!form.title) {
      alert('O título é obrigatório.');
      return;
    }
    
    setSaving(true);
    const updatedForm = { ...form, published: isPublished };
    const saved = await saveProduct(updatedForm);
    await syncProductsToSite();
    setSaving(false);
    onSave(saved);
  };

  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div className="admin-modal large" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header split">
          <div className="admin-modal-tabs">
            <button type="button" className={`admin-tab-btn ${activeTab === 'editor' ? 'active' : ''}`} onClick={() => setActiveTab('editor')}>
              <Layout size={16} /> Editor
            </button>
            <button type="button" className={`admin-tab-btn ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>
              <Monitor size={16} /> Preview
            </button>
          </div>
          <button type="button" onClick={onCancel} className="admin-icon-btn"><X size={18} /></button>
        </div>

        <div className="admin-modal-body">
          {activeTab === 'editor' ? (
            <div className="admin-editor-grid">
              {/* LEFT COLUMN */}
              <div className="admin-editor-col">
                <div className="admin-card">
                  <h3>Informações Básicas</h3>
                  <div className="admin-form-group">
                    <label>Nome do Produto *</label>
                    <input value={form.title} onChange={e => set('title', e.target.value)} required placeholder="Ex: Midnight Lounge Flyer" />
                  </div>
                  
                  <div className="admin-form-group">
                    <label>Breve Descrição</label>
                    <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Descreva os detalhes..." />
                  </div>

                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Categoria *</label>
                      <select value={form.category} onChange={e => set('category', e.target.value)}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Preço (AOA)</label>
                      <input type="number" value={form.price} onChange={e => set('price', Number(e.target.value))} min={0} />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Tags / Palavras-chave</label>
                    <div className="admin-tag-input-row">
                      <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Escreva e prima Enter..." />
                      <button type="button" onClick={addTag} className="admin-add-tag-btn">+</button>
                    </div>
                    <div className="admin-tags">
                      {(form.tags || []).map(t => (
                        <span key={t} className="admin-tag">{t} <button type="button" onClick={() => removeTag(t)}>×</button></span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="admin-card">
                  <h3>Detalhes do Arquivo</h3>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Formato *</label>
                      <select value={form.format || 'PSD'} onChange={e => set('format', e.target.value)}>
                        {FORMATS.map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Tamanho</label>
                      <input value={form.fileSize} onChange={e => set('fileSize', e.target.value)} placeholder="Ex: 128 MB" />
                    </div>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Resolução</label>
                      <input value={form.resolution} onChange={e => set('resolution', e.target.value)} placeholder="Ex: 300 DPI" />
                    </div>
                    <div className="admin-form-group">
                      <label>Produto Editável?</label>
                      <div className="admin-toggle-wrap">
                        <button type="button" className={`admin-pill-toggle ${form.editable ? 'active' : ''}`} onClick={() => set('editable', true)}>Sim</button>
                        <button type="button" className={`admin-pill-toggle ${!form.editable ? 'active' : ''}`} onClick={() => set('editable', false)}>Não</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="admin-form-group">
                    <label>Link de Download (URL do arquivo)</label>
                    <input value={form.psd_url || ''} onChange={e => set('psd_url', e.target.value)} placeholder="https://drive.google.com/..." />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="admin-editor-col">
                <div className="admin-card media-card">
                  <h3>Media <span className="admin-hint">(Arraste as imagens)</span></h3>
                  
                  <div className="admin-form-group">
                    <label>Imagem de Capa *</label>
                    <div 
                      className="admin-drop-zone" 
                      onClick={() => coverRef.current?.click()}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => handleDrop(e, true)}
                    >
                      {previewCover ? (
                        <div className="admin-drop-preview">
                          <img src={previewCover} alt="cover" />
                          <div className="admin-drop-overlay"><Upload size={20} /> Alterar Capa</div>
                        </div>
                      ) : (
                        <div className="admin-drop-placeholder">
                          <Upload size={28} />
                          <span>Clique ou arraste a capa principal</span>
                        </div>
                      )}
                      <input ref={coverRef} type="file" accept="image/*" onChange={handleCoverFile} hidden />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Galeria (até 6 imagens)</label>
                    <div className="admin-gallery-grid advanced">
                      {previewGallery.map((img, i) => (
                        <div key={i} className="admin-gallery-thumb">
                          <img src={img} alt="" />
                          <button type="button" onClick={() => removeGalleryImg(i)}><X size={12} /></button>
                        </div>
                      ))}
                      {previewGallery.length < 6 && (
                        <div 
                          className="admin-gallery-add" 
                          onClick={() => galleryRef.current?.click()}
                          onDragOver={e => e.preventDefault()}
                          onDrop={e => handleDrop(e, false)}
                        >
                          <ImagePlus size={24} />
                        </div>
                      )}
                      <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleGalleryFiles} hidden />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* PREVIEW TAB */
            <div className="admin-preview-pane">
              <div className="admin-preview-content">
                <div className="preview-image-section">
                  {previewCover ? <img src={previewCover} className="preview-main-img" alt="Cover" /> : <div className="preview-no-img">Sem Capa</div>}
                  {previewGallery.length > 0 && (
                    <div className="preview-gallery-strip">
                      {previewGallery.map((img, i) => <img key={i} src={img} alt="" />)}
                    </div>
                  )}
                </div>
                <div className="preview-info-section">
                  <div className="preview-badge">{form.category || 'Categoria'}</div>
                  <h1 className="preview-title">{form.title || 'Título do Produto'}</h1>
                  <p className="preview-price">{form.price ? `${form.price} AOA` : 'Grátis'}</p>
                  
                  <div className="preview-desc">{form.description || 'Nenhuma descrição fornecida.'}</div>
                  
                  <div className="preview-specs-grid">
                    <div className="preview-spec-card">
                      <span className="spec-label">Formato</span>
                      <span className="spec-value">{form.format || 'PSD'}</span>
                    </div>
                    <div className="preview-spec-card">
                      <span className="spec-label">Tamanho</span>
                      <span className="spec-value">{form.fileSize || '---'}</span>
                    </div>
                    <div className="preview-spec-card">
                      <span className="spec-label">Resolução</span>
                      <span className="spec-value">{form.resolution || '---'}</span>
                    </div>
                    <div className="preview-spec-card">
                      <span className="spec-label">Editável</span>
                      <span className="spec-value">{form.editable !== false ? 'Sim' : 'Não'}</span>
                    </div>
                  </div>
                  
                  <div className="preview-mock-btn">Simular Download</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="admin-modal-footer space-between">
          <div className="admin-status-area">
            <span className={`admin-status-indicator ${form.published ? 'published' : 'draft'}`}>
              <span className="pulse-dot"></span>
              Status: {form.published ? 'Publicado' : 'Rascunho'}
            </span>
          </div>
          <div className="admin-modal-actions">
            <button type="button" onClick={() => handlePublish(false)} className="admin-btn-secondary" disabled={saving}>
              <Save size={16} /> {saving && !form.published ? 'Salvando...' : 'Salvar Rascunho'}
            </button>
            <button type="button" onClick={() => handlePublish(true)} className="admin-btn-primary" disabled={saving}>
              <Send size={16} /> {saving && form.published ? 'Publicando...' : 'Publicar Produto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const load = () => getProducts().then(p => { setProducts(p); setLoading(false); });

  useEffect(() => { load(); }, []);

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (saved: AdminProduct) => {
    load();
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    await syncProductsToSite();
    setDeleteTarget(null);
    load();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Produtos</h1>
          <p>{products.length} produtos no catálogo</p>
        </div>
        <button className="admin-btn-primary" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
          <Plus size={16} /> Novo Produto
        </button>
      </div>

      <div className="admin-search-bar">
        <Search size={16} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Pesquisar por nome ou categoria..."
        />
      </div>

      {loading ? <div className="admin-loading">A carregar...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Downloads</th>
                <th>Estado</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="admin-product-cell">
                      <img src={p.image || ''} alt={p.title} className="admin-product-thumb" />
                      <span>{p.title}</span>
                    </div>
                  </td>
                  <td><span className="admin-badge">{p.category}</span></td>
                  <td>{p.price ? `${p.price} AOA` : 'Grátis'}</td>
                  <td>{p.downloads_count || 0}</td>
                  <td>
                    <span className={`admin-status ${p.published ? 'published' : 'draft'}`}>
                      {p.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="admin-date">{new Date(p.created_at!).toLocaleDateString('pt-PT')}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-icon-btn" onClick={() => { setEditingProduct(p); setShowForm(true); }}><Pencil size={14} /></button>
                      <button className="admin-icon-btn danger" onClick={() => setDeleteTarget(p.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="admin-empty">Nenhum produto encontrado.</div>
          )}
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct || EmptyForm()}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingProduct(null); }}
        />
      )}

      {deleteTarget && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="admin-confirm-dialog" onClick={e => e.stopPropagation()}>
            <h3>Eliminar Produto</h3>
            <p>Tem a certeza? Esta acção não pode ser desfeita.</p>
            <div className="admin-confirm-actions">
              <button className="admin-btn-secondary" onClick={() => setDeleteTarget(null)}>Cancelar</button>
              <button className="admin-btn-danger" onClick={() => handleDelete(deleteTarget)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
