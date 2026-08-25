"use client";

import { useState, useEffect, useCallback } from "react";
import { Bot, Wifi, WifiOff, MessageCircle, RefreshCw, QrCode, Trash2, Phone } from "lucide-react";

interface Conversa {
  phone: string;
  empresa: string;
  totalMensagens: number;
  ultimaMensagem: string;
}

interface BotStatus {
  status: string;
  whatsapp: string;
  conversasAtivas: number;
  conversas: Conversa[];
}

interface QRData {
  connected: boolean;
  base64?: string;
  code?: string;
  message?: string;
}

export default function BotPage() {
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null);
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingQR, setLoadingQR] = useState(false);
  const [selectedConversa, setSelectedConversa] = useState<string | null>(null);
  const [conversa, setConversa] = useState<any[]>([]);
  const [enviarPhone, setEnviarPhone] = useState("");
  const [enviarTexto, setEnviarTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/bot/status");
      const data = await res.json();
      setBotStatus(data);
    } catch {
      setBotStatus({ status: "offline", whatsapp: "disconnected", conversasAtivas: 0, conversas: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQR = async () => {
    setLoadingQR(true);
    try {
      const res = await fetch("/api/bot/qrcode");
      const data = await res.json();
      setQrData(data);
    } catch {
      setQrData({ connected: false, message: "Erro ao buscar QR Code" });
    } finally {
      setLoadingQR(false);
    }
  };

  const fetchConversa = async (phone: string) => {
    try {
      const res = await fetch(`/api/bot/conversa/${phone}`);
      const data = await res.json();
      setConversa(data.historico || []);
      setSelectedConversa(phone);
    } catch {
      setConversa([]);
    }
  };

  const limparConversa = async (phone: string) => {
    if (!confirm(`Resetar conversa com ${phone}?`)) return;
    try {
      await fetch(`/api/bot/conversa/${phone}`, { method: "DELETE" });
      fetchStatus();
      if (selectedConversa === phone) {
        setSelectedConversa(null);
        setConversa([]);
      }
    } catch {}
  };

  const enviarMensagem = async () => {
    if (!enviarPhone || !enviarTexto) return;
    setEnviando(true);
    try {
      await fetch("/api/bot/mensagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: enviarPhone, texto: enviarTexto }),
      });
      setEnviarTexto("");
      alert("Mensagem enviada!");
    } catch {
      alert("Erro ao enviar mensagem");
    } finally {
      setEnviando(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const whatsappConectado = botStatus?.whatsapp === "open";
  const botOnline = botStatus?.status === "online";

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Bot className="w-7 h-7 text-violet-400" />
              Lucas — Vendedor IA
            </h1>
            <p className="text-slate-400 text-sm mt-1">Painel de monitoramento do bot WhatsApp</p>
          </div>
          <button
            onClick={fetchStatus}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm text-slate-300 transition-all border border-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-5 rounded-2xl border ${botOnline ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"}`}>
            <div className="flex items-center gap-3">
              {botOnline ? <Wifi className="w-5 h-5 text-emerald-400" /> : <WifiOff className="w-5 h-5 text-red-400" />}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Serviço Bot</p>
                <p className={`font-bold text-lg ${botOnline ? "text-emerald-400" : "text-red-400"}`}>
                  {loading ? "..." : botOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border ${whatsappConectado ? "bg-green-500/10 border-green-500/30" : "bg-yellow-500/10 border-yellow-500/30"}`}>
            <div className="flex items-center gap-3">
              <Phone className={`w-5 h-5 ${whatsappConectado ? "text-green-400" : "text-yellow-400"}`} />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">WhatsApp</p>
                <p className={`font-bold text-lg ${whatsappConectado ? "text-green-400" : "text-yellow-400"}`}>
                  {loading ? "..." : whatsappConectado ? "Conectado" : "Desconectado"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border bg-violet-500/10 border-violet-500/30">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-violet-400" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Conversas Ativas</p>
                <p className="font-bold text-lg text-violet-400">
                  {loading ? "..." : botStatus?.conversasAtivas ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        {!whatsappConectado && (
          <div className="p-6 bg-slate-900 border border-slate-700 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-yellow-400" />
              Conectar WhatsApp
            </h2>
            
            {!qrData ? (
              <div className="text-center">
                <p className="text-slate-400 mb-4 text-sm">
                  Escaneie o QR Code com seu WhatsApp para ativar o bot vendedor
                </p>
                <button
                  onClick={fetchQR}
                  disabled={loadingQR}
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-sm transition-all"
                >
                  {loadingQR ? "Gerando QR Code..." : "Gerar QR Code"}
                </button>
              </div>
            ) : qrData.connected ? (
              <p className="text-emerald-400 font-semibold">✅ WhatsApp conectado com sucesso!</p>
            ) : qrData.base64 ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-slate-400 text-sm text-center">
                  Abra o WhatsApp no celular → Aparelhos conectados → Conectar aparelho → Escaneie o QR abaixo:
                </p>
                <div className="bg-white p-4 rounded-2xl">
                  <img src={qrData.base64} alt="QR Code WhatsApp" className="w-64 h-64" />
                </div>
                <button
                  onClick={fetchQR}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm text-slate-300"
                >
                  <RefreshCw className="w-4 h-4" />
                  Atualizar QR Code
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-red-400 text-sm mb-3">{qrData.message || "Erro ao gerar QR Code"}</p>
                <p className="text-slate-500 text-xs">Verifique se o serviço do bot está rodando (porta 3010)</p>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Conversas */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <h2 className="font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-violet-400" />
                Conversas Ativas
              </h2>
            </div>
            <div className="divide-y divide-slate-800 max-h-80 overflow-y-auto">
              {!botStatus?.conversas?.length ? (
                <div className="p-6 text-center">
                  <p className="text-slate-500 text-sm">Nenhuma conversa ativa</p>
                  <p className="text-slate-600 text-xs mt-1">Use o Lead Hunter para disparar o bot em um lead</p>
                </div>
              ) : (
                botStatus.conversas.map((c) => (
                  <div
                    key={c.phone}
                    className={`p-4 flex items-start gap-3 cursor-pointer hover:bg-slate-800/50 transition-all ${selectedConversa === c.phone ? "bg-violet-500/10" : ""}`}
                    onClick={() => fetchConversa(c.phone)}
                  >
                    <div className="w-9 h-9 rounded-full bg-violet-600/30 flex items-center justify-center flex-shrink-0 text-violet-300 font-bold text-sm">
                      {c.empresa.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{c.empresa}</p>
                      <p className="text-slate-400 text-xs">{c.phone}</p>
                      <p className="text-slate-500 text-xs truncate mt-0.5">{c.ultimaMensagem}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-violet-400 bg-violet-500/20 px-2 py-0.5 rounded-full">
                        {c.totalMensagens} msgs
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); limparConversa(c.phone); }}
                        className="p-1 text-slate-600 hover:text-red-400 transition-colors"
                        title="Resetar conversa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Histórico / Enviar */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
            {selectedConversa ? (
              <>
                <div className="px-5 py-4 border-b border-slate-800">
                  <h2 className="font-bold text-white text-sm">Conversa: {selectedConversa}</h2>
                </div>
                <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
                  {conversa.filter(m => !m.parts[0]?.text?.includes("[CONTEXTO INTERNO")).map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "model" ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                        msg.role === "model"
                          ? "bg-slate-700 text-slate-200"
                          : "bg-violet-600 text-white"
                      }`}>
                        <span className="font-semibold text-[10px] opacity-70 block mb-1">
                          {msg.role === "model" ? "🤖 Lucas" : "👤 Cliente"}
                        </span>
                        {msg.parts[0]?.text}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="px-5 py-4 border-b border-slate-800">
                  <h2 className="font-bold text-white flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-400" />
                    Enviar Mensagem Manual
                  </h2>
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1.5">Número (com código do país)</label>
                    <input
                      type="text"
                      placeholder="5511999998888"
                      value={enviarPhone}
                      onChange={(e) => setEnviarPhone(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1.5">Mensagem</label>
                    <textarea
                      placeholder="Digite a mensagem..."
                      value={enviarTexto}
                      onChange={(e) => setEnviarTexto(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
                    />
                  </div>
                  <button
                    onClick={enviarMensagem}
                    disabled={enviando || !enviarPhone || !enviarTexto}
                    className="w-full py-2.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-all"
                  >
                    {enviando ? "Enviando..." : "📤 Enviar Mensagem"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
          <p className="text-xs text-slate-500">
            💡 <strong className="text-slate-400">Como usar:</strong> No dashboard de prospecção, clique em "Abordagem Comercial" em qualquer lead e use o botão 
            <span className="text-violet-400 font-medium"> 🤖 Ativar Lucas (Vendedor IA)</span> para iniciar atendimento automático.
            O Lucas irá responder as mensagens dos clientes automaticamente usando Gemini AI.
          </p>
        </div>
      </div>
    </div>
  );
}
