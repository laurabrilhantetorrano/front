import { useEffect, useState } from "react";
import { listarUsuarios } from "../services/api";
import { Avatar, Aviso, Esqueleto } from "./ui";

// ═══════════════════════════════════════════════════════════════════════
//  Lista de usuários (arquivo pronto — mas LEIA o useEffect com calma)
// ═══════════════════════════════════════════════════════════════════════
//
//  Este é o componente mais importante da aula, porque ele responde à
//  pergunta: "quando é que eu busco os dados?"
//
//  ❌ NÃO pode buscar direto no corpo do componente:
//        const usuarios = await listarUsuarios(token)   // proibido!
//     O corpo de um componente precisa ser rápido e previsível. Um fetch
//     ali causaria uma busca a cada renderização → loop infinito.
//
//  ✅ O lugar certo é o useEffect: "depois que eu apareci na tela, faça isto".

export default function ListaUsuarios({ token, meuId, versao, aoRecarregar }) {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    // `cancelado` evita o "race condition": se o componente sumir da tela
    // (ou a lista recarregar de novo) antes da resposta chegar, a resposta
    // velha não pode sobrescrever a nova.
    let cancelado = false;

    async function buscar() {
      setCarregando(true);
      setErro("");
      try {
        const lista = await listarUsuarios(token);
        if (!cancelado) setUsuarios(lista);
      } catch (err) {
        if (!cancelado) setErro(err.message);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    buscar();

    // A função devolvida pelo useEffect é a "faxina": roda quando o
    // componente sai de cena ou antes de repetir o efeito.
    return () => {
      cancelado = true;
    };

    // ⚠️ ESTE ARRAY É O CÉREBRO DO useEffect.
    //    Ele diz: "repita o efeito quando um destes valores mudar".
    //    - array vazio []        → roda UMA vez só
    //    - sem array             → roda a CADA render → loop infinito 💀
    //    - [token, versao]       → roda quando trocar de usuário ou quando
    //                              alguém pedir para recarregar
  }, [token, versao]);

  const visiveis = usuarios.filter((u) =>
    `${u.nome} ${u.email}`.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="cartao">
      <div className="cartao-topo">
        <div>
          <h2>Turma na API</h2>
          <p className="sub">
            {carregando
              ? "buscando no MongoDB…"
              : `${usuarios.length} pessoa(s) cadastrada(s) agora`}
          </p>
        </div>
        <button className="botao botao-fantasma" onClick={aoRecarregar} disabled={carregando}>
          ↻ Atualizar
        </button>
      </div>

      <input
        className="campo-input busca"
        placeholder="Filtrar por nome ou e-mail…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {carregando && <Esqueleto quantidade={6} />}

      {!carregando && erro && (
        <Aviso tipo="erro">
          {erro}
          {erro.includes("404") || erro.includes("não encontrada")
            ? " — a rota GET /api/usuarios talvez ainda não exista no backend. Fale com o professor."
            : ""}
        </Aviso>
      )}

      {!carregando && !erro && visiveis.length === 0 && (
        <div className="vazio">
          <span>🫥</span>
          <p>Ninguém por aqui ainda. Chame a turma para se cadastrar!</p>
        </div>
      )}

      {!carregando && !erro && visiveis.length > 0 && (
        <div className="grade-cards">
          {/* A `key` NÃO é enfeite: é como o React sabe qual card é qual
              quando a lista muda. Use sempre o id vindo do banco, nunca
              o índice do array. */}
          {visiveis.map((u) => (
            <article key={u.id} className={u.id === meuId ? "card-usuario eu" : "card-usuario"}>
              <Avatar nome={u.nome} />
              <div className="card-texto">
                <strong>
                  {u.nome} {u.id === meuId && <span className="tag">você</span>}
                </strong>
                <span>{u.email}</span>
                {u.criadoEm && (
                  <small>entrou em {new Date(u.criadoEm).toLocaleDateString("pt-BR")}</small>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
