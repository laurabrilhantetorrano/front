import { useEffect, useState } from "react";
import { assinar, limparRegistros } from "../espiao";

// ═══════════════════════════════════════════════════════════════════════
//  Console de rede (arquivo pronto — sua melhor ferramenta de depuração)
// ═══════════════════════════════════════════════════════════════════════
//
//  Cada linha aqui é um pedido HTTP de verdade que saiu do seu navegador.
//  Clique numa linha para abrir os detalhes.
//
//  Use este painel para responder sozinho as três perguntas de sempre:
//     1. O pedido saiu?            → a linha apareceu?
//     2. Saiu do jeito certo?      → confira método, headers e body
//     3. O que o servidor achou?   → confira o status e a resposta

const CORES_STATUS = (status) => {
  if (status === null) return "aguardando";
  if (status >= 500) return "erro";
  if (status >= 400) return "atencao";
  return "ok";
};

export default function RedeLog() {
  const [registros, setRegistros] = useState([]);
  const [aberto, setAberto] = useState(true);
  const [expandido, setExpandido] = useState(null);

  useEffect(() => assinar(setRegistros), []);

  return (
    <div className={aberto ? "rede aberta" : "rede"}>
      <button className="rede-barra" onClick={() => setAberto(!aberto)}>
        <span className="rede-titulo">
          🛰️ Console de rede
          <em>{registros.length} pedido(s)</em>
        </span>
        <span className="rede-acoes">
          <span
            className="rede-limpar"
            onClick={(e) => {
              e.stopPropagation();
              limparRegistros();
              setExpandido(null);
            }}
          >
            limpar
          </span>
          {aberto ? "▾" : "▴"}
        </span>
      </button>

      {aberto && (
        <div className="rede-corpo">
          {registros.length === 0 && (
            <p className="rede-vazio">
              Nenhum pedido ainda. Faça login ou clique em "Atualizar" e observe aqui.
            </p>
          )}

          {registros.map((r) => (
            <div key={r.id} className="rede-item">
              <button
                className="rede-linha"
                onClick={() => setExpandido(expandido === r.id ? null : r.id)}
              >
                <span className={`rede-metodo m-${r.metodo}`}>{r.metodo}</span>
                <span className="rede-url">{r.url.replace(/^https?:\/\/[^/]+/, "")}</span>
                <span className={`rede-status s-${CORES_STATUS(r.status)}`}>
                  {r.erroDeRede ? "falhou" : r.status ?? "…"}
                </span>
                <span className="rede-tempo">{r.duracao != null ? `${r.duracao}ms` : ""}</span>
              </button>

              {expandido === r.id && (
                <div className="rede-detalhe">
                  <div>
                    <b>URL completa</b>
                    <pre>{r.url}</pre>
                  </div>
                  <div>
                    <b>Headers enviados</b>
                    <pre>{JSON.stringify(r.headers, null, 2) || "{}"}</pre>
                  </div>
                  {r.corpoEnviado && (
                    <div>
                      <b>Body enviado</b>
                      <pre>{r.corpoEnviado}</pre>
                    </div>
                  )}
                  {r.erroDeRede ? (
                    <div>
                      <b>Erro de rede</b>
                      <pre className="s-erro">
                        {r.erroDeRede}
                        {"\n\n"}A resposta nem chegou. Costuma ser: URL errada, internet fora,
                        servidor no ar mas sem CORS liberado, ou backend local desligado.
                      </pre>
                    </div>
                  ) : (
                    <div>
                      <b>Resposta ({r.status})</b>
                      <pre>{r.corpoRecebido}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
