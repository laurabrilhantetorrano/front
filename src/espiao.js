// ═══════════════════════════════════════════════════════════════════════
//  ESPIÃO DE REDE  (arquivo pronto — você não precisa mexer aqui)
// ═══════════════════════════════════════════════════════════════════════
//
//  Este arquivo "envelopa" a função `fetch` do navegador para conseguir
//  gravar TUDO que sai e TUDO que volta. O painel preto no rodapé da tela
//  lê esses registros.
//
//  Serve para você ENXERGAR o HTTP acontecendo: o método, a URL, os headers,
//  o corpo enviado, o status que voltou e quantos milissegundos demorou.
//
//  (É uma versão simplificada da aba "Network" do DevTools. A diferença é
//   que aqui está na tela, do lado do seu código, sem precisar abrir o F12.)

let registros = [];
const ouvintes = new Set();
let proximoId = 1;

function avisarTodos() {
  // Passamos uma cópia nova do array para o React perceber que mudou.
  const copia = [...registros];
  ouvintes.forEach((fn) => fn(copia));
}

export function assinar(fn) {
  ouvintes.add(fn);
  fn([...registros]);
  return () => ouvintes.delete(fn);
}

export function limparRegistros() {
  registros = [];
  avisarTodos();
}

function encurtar(texto, limite = 600) {
  if (typeof texto !== "string") return "";
  return texto.length > limite ? texto.slice(0, limite) + "… (cortado)" : texto;
}

function lerHeaders(init) {
  const h = init?.headers;
  if (!h) return {};
  if (h instanceof Headers) return Object.fromEntries(h.entries());
  return { ...h };
}

export function instalarEspiao() {
  if (window.__espiaoInstalado) return;
  window.__espiaoInstalado = true;

  const fetchOriginal = window.fetch.bind(window);

  window.fetch = async (entrada, init = {}) => {
    const url = typeof entrada === "string" ? entrada : entrada.url;
    const metodo = (init.method || "GET").toUpperCase();
    const headers = lerHeaders(init);
    const inicio = performance.now();

    const registro = {
      id: proximoId++,
      metodo,
      url,
      headers,
      corpoEnviado: encurtar(typeof init.body === "string" ? init.body : ""),
      hora: new Date().toLocaleTimeString("pt-BR"),
      status: null,
      ok: null,
      duracao: null,
      corpoRecebido: "",
      erroDeRede: null,
    };

    registros = [registro, ...registros].slice(0, 40);
    avisarTodos();

    try {
      const resposta = await fetchOriginal(entrada, init);

      // .clone() é obrigatório: um corpo de resposta só pode ser lido UMA vez.
      // Se lêssemos aqui sem clonar, o seu código receberia a resposta vazia.
      const texto = await resposta.clone().text();

      registro.status = resposta.status;
      registro.ok = resposta.ok;
      registro.duracao = Math.round(performance.now() - inicio);
      registro.corpoRecebido = encurtar(texto);
      avisarTodos();

      return resposta;
    } catch (erro) {
      // Cai aqui quando a resposta nem chegou: internet fora, URL errada,
      // servidor dormindo ou... CORS bloqueado pelo navegador.
      registro.erroDeRede = erro.message;
      registro.duracao = Math.round(performance.now() - inicio);
      avisarTodos();
      throw erro;
    }
  };
}
