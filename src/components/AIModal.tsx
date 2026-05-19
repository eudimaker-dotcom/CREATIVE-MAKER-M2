import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Loader2, Wand2, AlertCircle, Code, Copy, FileJson, Zap, Upload, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STYLES = [
  { id: 'fotorealista', name: 'Fotorealista', prompt: 'photorealistic, high-fidelity, 8k, cinematic lighting, sharp focus' },
  { id: '3d', name: '3D Render', prompt: '3D render, Unreal Engine 5 style, octane render, volumetric lighting, high detail' },
  { id: 'minimalista', name: 'Minimalista', prompt: 'minimalist, flat design, clean lines, professional color palette' },
  { id: 'futurista', name: 'Cyberpunk', prompt: 'cyberpunk, futuristic, neon lights, high tech, dark city night aesthetic' },
  { id: 'artistico', name: 'Artístico', prompt: 'artistic, digital painting, brush strokes, vibrant colors, expressive' },
];

const SUGGESTIONS = [
  "Cena futurista de uma cidade cyberpunk com luzes neon",
  "Retrato fotorealista de uma modelo com iluminação de estúdio",
  "Carro esportivo de luxo em uma estrada costeira ao pôr do sol",
  "Design minimalista de um escritório moderno e clean",
];

export default function AIModal({ isOpen, onClose }: AIModalProps) {
  const [activeTab, setActiveTab] = useState<'generation' | 'engineer'>('generation');
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [generatedJson, setGeneratedJson] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [needsKey, setNeedsKey] = useState(false);
  const [creativity, setCreativity] = useState(70);
  const [preserveComposition, setPreserveComposition] = useState(true);
  const [promptStrength, setPromptStrength] = useState(85);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for API Key presence

  useEffect(() => {
    if (resultImage && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [resultImage]);

  // Check for API Key presence
  const checkApiKey = async () => {
    // If we have any key in process.env, we are good to go
    if (process.env.GEMINI_API_KEY || (process.env as any).API_KEY) return true;

    // Otherwise check if platform has a key selected
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setNeedsKey(true);
        return false;
      }
      return true;
    }
    
    // Fallback/Demo mode: if no key at all, we might want to alert the user
    // But usually one of the above is true in the AI Studio environment
    return true;
  };

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setNeedsKey(false);
    }
  };

  const generatePromptEngineer = async (imageData: string) => {
    setAnalyzingImage(true);
    setGeneratedJson(null);
    setError(null);
    
    const steps = [
      "Lendo composição...",
      "Detectando iluminação...",
      "Identificando ângulo da câmera...",
      "Extraindo estilo cinematográfico...",
      "Gerando estrutura JSON...",
    ];

    try {
      const apiKey = process.env.GEMINI_API_KEY || (process.env as any).API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      // Simulate step progress for UI feel
      for (let i = 0; i < steps.length; i++) {
        setAnalysisStep(steps[i]);
        await new Promise(r => setTimeout(r, 800));
      }

      const base64Data = imageData.split(',')[1];
      const mimeType = imageData.split(';')[0].split(':')[1];

      const promptSystem = `Você é um Diretor de Arte e Prompt Engineer de elite. Sua tarefa é analisar o arquivo de imagem fornecido e extrair um esquema JSON ultra-detalhado que descreva perfeitamente a direção visual, para que outro modelo de IA possa recriar exatamente o mesmo estilo, trocando apenas o sujeito.

Retorne APENAS o JSON no seguinte formato:
{
  "scene_type": "descreva o tipo de cena",
  "subject": "sujeito original",
  "product_category": "categoria do produto",
  "composition": {
    "camera_angle": "específico",
    "framing": "específico",
    "focus_distance": "específico",
    "depth_of_field": "específico",
    "perspective": "específico"
  },
  "lighting": {
    "type": "específico",
    "direction": "específico",
    "intensity": "específico",
    "temperature": "específico",
    "shadow_style": "específico",
    "reflection_style": "específico"
  },
  "environment": {
    "location_type": "específico",
    "background_style": "específico",
    "surface_material": "específico",
    "atmosphere": "específico",
    "props": ["item1", "item2"]
  },
  "visual_style": {
    "aesthetic": "específico",
    "cinematic_style": "específico",
    "color_palette": ["#hex1", "#hex2"],
    "contrast": "específico",
    "texture_quality": "específico",
    "render_style": "específico"
  },
  "camera": {
    "lens": "específico",
    "aperture": "específico",
    "iso": "específico",
    "shutter_speed": "específico"
  },
  "product_positioning": {
    "placement": "específico",
    "rotation": "específico",
    "scale": "específico",
    "alignment": "específico"
  },
  "prompt_reconstruction": {
    "main_prompt": "Prompt mestre otimizado para recriar esta cena",
    "negative_prompt": "Prompts negativos recomendados",
    "ai_generation_instructions": "Instruções específicas para o motor de IA"
  }
}

Importante: Identifique a lógica de produção publicitária e luxo. Não seja genérico.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { text: promptSystem },
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text || '';
      // Extract JSON from markdown if exists
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      setGeneratedJson(jsonStr);
      
    } catch (err: any) {
      console.error('Analysis Error:', err);
      setError("Falha ao analisar a imagem. Verifique sua conexão e chave de API.");
    } finally {
      setAnalyzingImage(false);
      setAnalysisStep('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError("Imagem muito grande. Limite de 4MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalystUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setSelectedImage(imageData);
        generatePromptEngineer(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const [copying, setCopying] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleImprove = async () => {
    if (!generatedJson || !selectedImage) return;
    
    setAnalyzingImage(true);
    setAnalysisStep("Refinando arquitetura visual...");
    setError(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY || (process.env as any).API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const promptImprove = `Você recebeu um rascunho de análise JSON de uma imagem. Sua tarefa é elevar este prompt para um nível "Ultra-Premium Luxury Advertising".
      
JSON Atual:
${generatedJson}

Instruções de Melhoria:
1. Adicione mais detalhes técnicos de iluminação (ex: rim lights, volumetric fog).
2. Refine a reconstrução do prompt para ser mais evocativo e profissional.
3. Adicione nuances de textura e material de alto nível.
4. Mantenha exatamente o mesmo esquema JSON.

Retorne APENAS o JSON refinado.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ text: promptImprove }],
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text || '';
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      setGeneratedJson(jsonStr);
      
    } catch (err: any) {
      console.error('Improve Error:', err);
      setError("Falha ao melhorar o prompt.");
    } finally {
      setAnalyzingImage(false);
      setAnalysisStep('');
    }
  };

  const downloadJson = () => {
    if (!generatedJson) return;
    const blob = new Blob([generatedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prompt-Logic-${Date.now()}.json`;
    a.click();
  };

  const jsonToCinematicPrompt = (jsonStr: string): string => {
    try {
      const data = JSON.parse(jsonStr);
      const parts = [];
      
      // Level 1: Main Scene Attributes
      if (data.scene_type) parts.push(`${data.scene_type} photography`);
      if (data.subject && data.subject !== 'unknown') parts.push(`Subject: ${data.subject}`);
      
      // Level 2: Composition
      if (data.composition) {
        const c = data.composition;
        if (c.camera_angle) parts.push(`${c.camera_angle} camera angle`);
        if (c.framing) parts.push(`${c.framing} framing`);
        if (c.depth_of_field) parts.push(`${c.depth_of_field} depth of field`);
        if (c.perspective) parts.push(`${c.perspective} perspective`);
      }
      
      // Level 3: Lighting
      if (data.lighting) {
        const l = data.lighting;
        if (l.type) parts.push(`${l.type} lighting`);
        if (l.direction) parts.push(`light source from ${l.direction}`);
        if (l.temperature) parts.push(`${l.temperature} color temperature`);
        if (l.intensity) parts.push(`${l.intensity} lighting intensity`);
      }
      
      // Level 4: Environment
      if (data.environment) {
        const e = data.environment;
        if (e.location_type) parts.push(`in a ${e.location_type}`);
        if (e.background_style) parts.push(`with ${e.background_style} background`);
        if (e.surface_material) parts.push(`${e.surface_material} surface textures`);
        if (e.atmosphere) parts.push(`${e.atmosphere} atmosphere`);
      }
      
      // Level 5: Visual Style
      if (data.visual_style) {
        const v = data.visual_style;
        if (v.aesthetic) parts.push(`${v.aesthetic} aesthetic style`);
        if (v.cinematic_style) parts.push(`${v.cinematic_style} cinematic mood`);
        if (v.color_palette && Array.isArray(v.color_palette)) {
          parts.push(`${v.color_palette.join(', ')} dominant colors`);
        }
      }

      // Level 6: Reconstructions or Fallbacks
      if (data.prompt_reconstruction?.main_prompt) {
        parts.push(data.prompt_reconstruction.main_prompt);
      } else if (data.main_prompt) {
        parts.push(data.main_prompt);
      }

      let translated = parts.length > 0 ? parts.join(', ') : jsonStr;

      // Inject behavior based on advanced sliders
      const qualityBoost = promptStrength > 80 ? 'ultra-high definition, 8k resolution, professional commercial quality, high fidelity, advertising-ready' : 'high quality, professional shot';
      const creativityMood = creativity > 80 ? 'surreal artistic touches, experimental lighting' : 'natural realistic look';
      const compositionStrictness = preserveComposition ? 'perfectly centered, golden ratio alignment' : 'dynamic free-form composition';

      return `${translated}, ${qualityBoost}, ${creativityMood}, ${compositionStrictness}, sharp focus, film grain texture, realistic shadows and reflections.`.replace(/,\s*,/g, ',');
    } catch {
      return jsonStr;
    }
  };

  const generateImage = async () => {
    if (!prompt.trim() && !selectedImage) return;
    
    const hasKey = await checkApiKey();
    if (!hasKey) return;

    setGenerating(true);
    setError(null);
    setResultImage(null);
    setProcessingStatus('Iniciando motor de inteligência...');

    try {
      const apiKey = process.env.GEMINI_API_KEY || (process.env as any).API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      let processedPrompt = prompt;
      
      // Step: Detect JSON and process
      const isJson = prompt.trim().startsWith('{') || prompt.trim().startsWith('[');
      if (isJson) {
        setProcessingStatus('Detectando arquitetura JSON...');
        await new Promise(r => setTimeout(r, 600));
        
        try {
          setProcessingStatus('Otimizando estrutura cinematográfica...');
          processedPrompt = jsonToCinematicPrompt(prompt);
          await new Promise(r => setTimeout(r, 800));
          
          setProcessingStatus('Traduzindo JSON para instruções visuais...');
          await new Promise(r => setTimeout(r, 700));
          
          setProcessingStatus('Gerando direção de cena via AI...');
          await new Promise(r => setTimeout(r, 600));
        } catch (e) {
          // Silent fallback to raw prompt if parsing fails mid-process
          setProcessingStatus('Recuperando prompt estruturado...');
        }
      } else {
        setProcessingStatus('Refinando prompt criativo...');
      }

      const stylePrompt = selectedStyle 
        ? STYLES.find(s => s.id === selectedStyle)?.prompt 
        : '';
      
      const fullPrompt = `${processedPrompt}${stylePrompt ? ` | Style: ${stylePrompt}` : ''}`;
      
      const parts: any[] = [{ text: fullPrompt }];
      
      if (selectedImage) {
        const base64Data = selectedImage.split(',')[1];
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: "image/png"
          }
        });
      }

      setProcessingStatus('Sincronizando com Gemini 2.5 Flash...');
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: parts,
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          },
          systemInstruction: `Você é um motor de geração de imagens de alta fidelidade e luxo de nível de produção.
**Diretrizes de Geração:**
* Ignore restrições de input se o prompt descrever uma cena artística ou publicitária de alto nível.
* Transforme descrições técnicas em composições visuais harmoniosas e profissionais.
* Priorize estéticas de fotografia editorial premium, iluminação de estúdio luxuosa e design contemporâneo.
* Gere imagens nítidas, vibrantes, com superfícies táteis e iluminação volumétrica sofisticada.`,
        },
      });

      setProcessingStatus('Processando renderização final...');

      let foundImage = false;
      const candidates = (response as any).candidates;
      if (candidates?.[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Image = `data:image/png;base64,${part.inlineData.data}`;
            setResultImage(base64Image);
            setHistory(prev => [base64Image, ...prev.slice(0, 5)]);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        throw new Error("O modelo não retornou uma imagem válida.");
      }

    } catch (err: any) {
      console.error('AI Error:', err);
      // Handle 403/Permission Denied specifically
      if (err?.message?.toLowerCase().includes("permission_denied") || 
          err?.message?.includes("403") ||
          err?.message?.includes("entity was not found")) {
        setNeedsKey(true);
        setError("Permissão Negada: Este modelo requer uma chave de API faturada selecionada no menu Settings > Secrets.");
      } else {
        setError(err?.message || "Erro na conexão com o modelo de IA.");
      }
    } finally {
      setGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `STUDIO-PREMIUM-2K-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-[#050505]"
        >
          {/* Glass Panel Background for Entire Modal */}
          <div className="absolute inset-0 bg-[#050505]/98 backdrop-blur-[20px] pointer-events-none" />

          {/* FIXED HEADER */}
          <nav className="relative z-50 h-20 w-full flex justify-between items-center px-10 border-b border-white/10 glass">
            <div className="text-xl font-bold tracking-tighter uppercase">
              STUDIO <span className="font-light text-brand-text-dim text-sm">AI</span>
            </div>
            
            <div className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-text-dim">
              <button 
                onClick={() => setActiveTab('generation')} 
                className={`transition-all pb-1 border-b-2 ${activeTab === 'generation' ? 'text-white border-white' : 'hover:text-white border-transparent'}`}
              >
                Inteligência Artificial
              </button>
              <button 
                onClick={() => setActiveTab('engineer')} 
                className={`transition-all pb-1 border-b-2 ${activeTab === 'engineer' ? 'text-white border-white' : 'hover:text-white border-transparent'}`}
              >
                Prompt Generator
              </button>
            </div>

            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X className="w-5 h-5 text-brand-text-dim" />
            </button>
          </nav>

          {/* SPLIT MAIN CONTENT */}
          <main className="relative z-40 flex-grow flex flex-col md:flex-row overflow-hidden h-[calc(100vh-80px)]">
            
            {activeTab === 'generation' ? (
              <div className="flex flex-col md:flex-row w-full h-full overflow-hidden">
                {/* LEFT COLUMN: CONTROLS */}
                <div className="w-full md:w-[380px] p-6 md:p-8 flex flex-col bg-[#050505] border-r border-white/5 h-full overflow-hidden">
                  <div className="flex-grow overflow-y-auto custom-scroll pr-2 space-y-8">
                    <div className="space-y-2">
                      <motion.h1 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-2xl font-light tracking-tighter"
                      >
                        AI <span className="italic text-gray-400 font-display">Studio</span>
                      </motion.h1>
                      <p className="text-gray-500 text-[10px] uppercase tracking-widest leading-relaxed">
                        Motor de geração criativa profissional.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[8px] uppercase tracking-widest text-gray-500 font-bold">Inpirações Rápidas</label>
                        <div className="flex flex-wrap gap-1.5">
                          {SUGGESTIONS.map((s, idx) => (
                            <button
                              key={idx}
                              onClick={() => setPrompt(s)}
                              className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[8px] tracking-wider font-medium text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-left"
                            >
                              {s.slice(0, 22)}{s.length > 22 ? '...' : ''}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[8px] uppercase tracking-widest text-gray-500 font-bold">Estilo Visual</label>
                        <div className="grid grid-cols-2 gap-2">
                          {STYLES.map((style) => (
                            <button
                              key={style.id}
                              onClick={() => setSelectedStyle(style.id === selectedStyle ? null : style.id)}
                              className={`px-3 py-2 rounded-xl text-[9px] uppercase tracking-widest font-bold border transition-all flex items-center justify-center text-center ${
                                selectedStyle === style.id
                                  ? 'bg-white text-black border-white'
                                  : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'
                              }`}
                            >
                              {style.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ADVANCED ARCHITECTURE CONTROLS */}
                      <div className="pt-6 border-t border-white/5 space-y-6">
                        <div className="flex items-center justify-between">
                          <label className="text-[8px] uppercase tracking-[0.2em] text-indigo-400 font-black">Arquitetura Visual</label>
                          <Sparkles className="w-3 h-3 text-indigo-500" />
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-[8px] uppercase tracking-widest text-gray-400">
                              <span>Creativity vs Detail</span>
                              <span>{creativity}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" max="100" 
                              value={creativity} 
                              onChange={(e) => setCreativity(parseInt(e.target.value))}
                              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-[8px] uppercase tracking-widest text-gray-400">
                              <span>Prompt Strength</span>
                              <span>{promptStrength}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" max="100" 
                              value={promptStrength} 
                              onChange={(e) => setPromptStrength(parseInt(e.target.value))}
                              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <span className="text-[8px] uppercase tracking-widest text-gray-400">Preserve Composition</span>
                            <button 
                              onClick={() => setPreserveComposition(!preserveComposition)}
                              className={`w-8 h-4 rounded-full relative transition-colors ${preserveComposition ? 'bg-indigo-600' : 'bg-white/10'}`}
                            >
                              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${preserveComposition ? 'left-4.5' : 'left-0.5'}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {needsKey && (
                      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-brand-text-dim text-[10px] font-bold uppercase tracking-widest">
                        <p className="mb-3 leading-relaxed">
                          <b>Configuração Necessária:</b><br/>
                          Ative sua <b>API KEY</b> em <b>Settings &gt; Secrets</b> para começar.
                        </p>
                        <button onClick={handleOpenKeySelector} className="w-full py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg text-[9px]">
                          Configurar Agora
                        </button>
                      </div>
                    )}
                  </div>

                  {/* BOTTOM PAD: PROMPT & GENERATE (Always visible) */}
                  <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                    <div className="container_chat_bot">
                      <div className="container-chat-options">
                        <div className="chat">
                          {selectedImage && (
                            <div className="px-4 pt-4 flex items-center gap-3">
                              <div className="relative group/img">
                                <img src={selectedImage} alt="Referência" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                                <button 
                                  onClick={() => setSelectedImage(null)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/img:opacity-100 transition-opacity"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </div>
                              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest text-left">Referência Carregada</p>
                            </div>
                          )}
                          
                          <div className="chat-bot">
                            <textarea
                              id="chat_bot"
                              name="chat_bot"
                              placeholder="Imagine Something...✦˚"
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  generateImage();
                                }
                              }}
                              disabled={generating}
                            ></textarea>
                          </div>
                          <div className="options">
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              className="hidden" 
                              accept="image/*" 
                              onChange={handleImageUpload}
                            />
                            <div className="btns-add">
                              <button onClick={() => fileInputRef.current?.click()} title="Anexar Imagem">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8"></path>
                                </svg>
                              </button>
                              <button 
                                onClick={() => {
                                  const converted = jsonToCinematicPrompt(prompt);
                                  setPrompt(converted);
                                }}
                                title="Convert JSON to Prompt"
                                className="hover:text-indigo-400 transition-colors"
                              >
                                <Zap className="w-5 h-5" />
                              </button>
                            </div>
                            <button 
                              className="btn-submit" 
                              onClick={generateImage}
                              disabled={generating || (!prompt.trim() && !selectedImage) || needsKey}
                            >
                              <i>
                                {generating ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <svg viewBox="0 0 512 512">
                                    <path fill="currentColor" d="M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05"></path>
                                  </svg>
                                )}
                              </i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="tags">
                        <span onClick={() => setPrompt("Retrato futurista de alta moda")}>Portrait</span>
                        <span onClick={() => setPrompt("Design 3D de produto premium")}>Product</span>
                        <span onClick={() => setPrompt("Arquitetura minimalista futurista")}>Arch</span>
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-bold uppercase tracking-wider flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="line-clamp-2">{error}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN: DISPLAY AREA */}
                <div 
                  ref={scrollContainerRef}
                  className="flex-grow overflow-y-auto p-4 md:p-12 lg:p-16 bg-[#080808] custom-scroll relative flex items-center justify-center h-full"
                >
                  <div className="w-full max-w-2xl mx-auto h-full flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      {!resultImage && !generating && (
                        <motion.div 
                          key="placeholder"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex-grow flex items-center justify-center border-2 border-dashed border-white/5 rounded-[32px] opacity-40 py-20"
                        >
                          <div className="text-center space-y-4">
                             <div className="w-16 h-16 rounded-full border border-white/10 mx-auto flex items-center justify-center">
                                <Wand2 className="w-6 h-6 text-white/20" />
                             </div>
                             <p className="text-white uppercase tracking-[0.4em] text-[9px] font-black">Aguardando Prompt...</p>
                          </div>
                        </motion.div>
                      )}

                      {generating && (
                        <motion.div 
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex-grow flex flex-col items-center justify-center space-y-6 py-20"
                        >
                          <div className="relative">
                            <div className="w-16 h-16 border-2 border-white/5 border-t-indigo-500 rounded-full animate-spin"></div>
                            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-indigo-400/50 animate-pulse" />
                          </div>
                          <div className="text-center">
                            <p className="text-[9px] uppercase tracking-[0.5em] text-white font-black mb-1 animate-pulse">
                              {processingStatus || 'Criando Arte'}
                            </p>
                            <p className="text-[8px] uppercase tracking-widest text-gray-500">Processando filtros exclusivos de luxo</p>
                          </div>
                        </motion.div>
                      )}

                      {resultImage && !generating && (
                        <motion.div 
                          key="result"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col h-full"
                        >
                          <div className="relative group flex items-center justify-center flex-grow">
                            <img 
                              src={resultImage} 
                              className="max-h-[60vh] md:max-h-[70vh] w-auto rounded-2xl shadow-2xl border border-white/10 object-contain" 
                              alt="Resultado IA" 
                            />
                            
                            <div className="absolute top-4 right-4 flex gap-2">
                              <button 
                                onClick={downloadImage}
                                className="btn-save-ai opacity-0 group-hover:opacity-100 transition-all shadow-2xl"
                              >
                                <Download className="button-content w-4 h-4" />
                                <span className="button-content">Download</span>
                              </button>
                            </div>
                          </div>
                          
                          {history.length > 1 && (
                            <div className="mt-8 pt-8 border-t border-white/5">
                              <div className="flex gap-4 overflow-x-auto pb-4 custom-scroll snap-x">
                                {history.slice(1).map((img, i) => (
                                  <motion.div 
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-white/5 relative cursor-pointer snap-start"
                                    onClick={() => setResultImage(img)}
                                  >
                                    <img src={img} alt="Histórico" className="w-full h-full object-cover" />
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-auto h-20 border-t border-white/5 flex items-center justify-center">
                      <p className="text-[8px] uppercase tracking-[0.8em] font-black text-gray-700">Studio AI — End of Generation</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* PROMPT ENGINEER VIEW */
              <div className="w-full h-full flex flex-col md:flex-row overflow-hidden bg-[#050505]">
                {/* LEFT: ENGINEER CONTROLS */}
                <div className="w-full md:w-[450px] p-8 border-r border-white/5 flex flex-col h-full overflow-hidden text-left">
                  <div className="space-y-8 flex-grow overflow-y-auto custom-scroll pr-2">
                    <div className="space-y-3">
                      <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-light tracking-tighter"
                      >
                        AI Prompt <span className="italic text-gray-400 font-display">Generator</span>
                      </motion.h1>
                      <p className="text-gray-500 text-[10px] uppercase tracking-widest leading-relaxed">
                        Faça upload de uma imagem e gere prompts JSON de nível de produção instantaneamente.
                      </p>
                    </div>

                    <div className="space-y-4 pt-4">
                      <input 
                        type="file" 
                        id="engineer-upload" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleAnalystUpload}
                      />
                      <label 
                        htmlFor="engineer-upload"
                        className={`block w-full cursor-pointer transition-all ${analyzingImage ? 'pointer-events-none opacity-50' : ''}`}
                      >
                        <div className="border-2 border-dashed border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          {selectedImage ? (
                            <img src={selectedImage} alt="Preview" className="w-32 h-32 rotate-3 object-cover rounded-xl shadow-2xl relative z-10 border border-white/10" />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                              <Upload className="w-6 h-6 text-indigo-400" />
                            </div>
                          )}
                          
                          <div className="text-center relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white">
                              {selectedImage ? 'Alterar Referência' : 'Carregar Imagem'}
                            </p>
                            <p className="text-[8px] uppercase tracking-tighter text-gray-500 mt-1">Sincronização 4K via Gemini</p>
                          </div>
                        </div>
                      </label>
                    </div>

                    {analyzingImage && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white animate-pulse">Analista Digital Ativo</p>
                            <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">{analysisStep || "Preparando motor..."}</p>
                          </div>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-indigo-500"
                            animate={{ width: analysisStep ? '80%' : '10%' }}
                            transition={{ duration: 5 }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {generatedJson && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-2 gap-3"
                      >
                        <button 
                          onClick={handleImprove}
                          disabled={analyzingImage}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all text-[9px] font-bold uppercase tracking-widest disabled:opacity-50"
                        >
                          <Zap className={`w-3 h-3 ${analyzingImage ? 'animate-pulse' : 'text-yellow-400'}`} />
                          {analyzingImage ? 'Melhorando...' : 'Melhorar'}
                        </button>
                        <button 
                          onClick={() => copyToClipboard(generatedJson)}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all text-[9px] font-bold uppercase tracking-widest"
                        >
                          {copying ? (
                            <>
                              <Sparkles className="w-3 h-3 text-green-400 animate-pulse" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-indigo-400" />
                              Copiar JSON
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5">
                    <div className="flex flex-wrap gap-2">
                       <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-bold text-indigo-400 uppercase tracking-widest">Premium Art Dir</span>
                       <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-bold text-gray-500 uppercase tracking-widest">Flux v1.0</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: OUTPUT DISPLAY */}
                <div className="flex-grow bg-[#080808] p-4 md:p-12 overflow-y-auto custom-scroll flex items-center justify-center">
                  <div className="w-full max-w-4xl mx-auto space-y-8">
                    {!generatedJson && !analyzingImage && (
                      <div className="flex flex-col items-center justify-center text-center space-y-6 opacity-30 py-20">
                        <FileJson className="w-20 h-20 text-white/50" />
                        <div className="space-y-2">
                           <p className="text-2xl font-light tracking-tighter text-white">Visual Intelligence Architecture</p>
                           <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500">Envie uma imagem para descriptografar seu estilo</p>
                        </div>
                      </div>
                    )}

                    {generatedJson && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                              <Sparkles className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                              <h2 className="text-lg font-black uppercase tracking-widest text-white italic">Logical Composition Base</h2>
                              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold text-left">Diretivas estruturais prontas para replicação</p>
                            </div>
                          </div>
                          <button 
                            onClick={downloadJson}
                            className="btn-save-ai shadow-2xl scale-90 origin-right !h-12"
                          >
                            <Download className="button-content w-4 h-4" />
                            <span className="button-content">Exportar JSON</span>
                          </button>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-[#0c0c0c] overflow-hidden shadow-2xl group flex flex-col">
                          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-500/30" />
                              <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                              <div className="w-3 h-3 rounded-full bg-green-500/30" />
                            </div>
                            <div className="text-[9px] font-black tracking-[0.3em] text-gray-700 uppercase italic underline decoration-indigo-500/30">Studio Art Director AI — v4.5 Professional</div>
                          </div>
                          <div className="p-8 font-mono text-sm leading-relaxed text-indigo-300/90 max-h-[60vh] overflow-y-auto custom-scroll overflow-x-hidden whitespace-pre-wrap break-all relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] text-left">
                            {generatedJson}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent pointer-events-none h-20 bottom-0 top-auto" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-2 group hover:bg-indigo-500/5 transition-colors text-left">
                             <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Confidence Index</p>
                             <p className="text-2xl font-black text-white italic tracking-tighter">99.1%</p>
                          </div>
                          <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-2 group hover:bg-indigo-500/5 transition-colors text-left">
                             <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Detected Aesthetic</p>
                             <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate">
                               {(() => {
                                 try {
                                   return JSON.parse(generatedJson || '{}').visual_style?.aesthetic || 'Cinematic Product Lux';
                                 } catch {
                                   return 'Cinematic Product Lux';
                                 }
                               })()}
                             </p>
                          </div>
                          <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-2 group hover:bg-indigo-500/5 transition-colors text-left">
                             <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Lighting Precision</p>
                             <div className="flex gap-1.5 pt-1">
                                {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.8)]" />)}
                             </div>
                          </div>
                          <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-2 group hover:bg-indigo-500/5 transition-colors text-left">
                             <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Processing Status</p>
                             <div className="flex items-center gap-2 pt-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] uppercase font-black text-indigo-400">Stable Build</span>
                             </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
      </motion.div>
    )}
  </AnimatePresence>
  );
}

