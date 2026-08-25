// ═══════════════════════════════════════════════════════════════════════
//  ENDEREÇO DA API
// ═══════════════════════════════════════════════════════════════════════
//
//  Esta é a "casa" do backend. Todo pedido que o React fizer vai começar
//  por este endereço.
//
//  Repare que o front (localhost:5173) e o back (backend-3c.vercel.app)
//  são DOIS servidores diferentes, em domínios diferentes.
//  É exatamente por isso que o CORS existe — e por isso o backend precisou
//  escrever `app.use(cors())` lá no `app.js` dele.
//
//  Se o backend NÃO tivesse CORS liberado, o navegador bloquearia todas as
//  respostas e você veria aquele erro vermelho famoso:
//
//    Access to fetch at 'https://...' from origin 'http://localhost:5173'
//    has been blocked by CORS policy
//
export const API_URL =
  import.meta.env.VITE_API_URL || "https://env-silk.vercel.app";

// Chave usada para guardar o token no localStorage do navegador.
export const CHAVE_SESSAO = "sessao-3c";
