import { useEffect, useState } from "react";
import { CHAVE_SESSAO } from "./config";
import TelaAcesso from "./components/TelaAcesso";
import Painel from "./components/Painel";
import RedeLog from "./components/RedeLog";

// ═══════════════════════════════════════════════════════════════════════
//  App — o "porteiro" da aplicação (arquivo pronto)
// ═══════════════════════════════════════════════════════════════════════
//
//  Regra: sem sessão → tela de acesso. Com sessão → painel.
//
//  A sessão é { token, usuario }. Ela fica no localStorage para você não
//  precisar logar de novo a cada F5.
//
//  ⚠️ Curiosidade honesta: guardar token no localStorage é o jeito mais
//  simples, mas NÃO é o mais seguro (qualquer script da página consegue
//  ler). Em produção o padrão é cookie httpOnly. Fica registrado aqui
//  porque programar é também saber o que você está trocando por
//  simplicidade.

function carregarSessao() {
  try {
    const bruto = localStorage.getItem(CHAVE_SESSAO);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [sessao, setSessao] = useState(carregarSessao);

  useEffect(() => {
    if (sessao) localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
    else localStorage.removeItem(CHAVE_SESSAO);
  }, [sessao]);

  return (
    <>
      {sessao ? (
        <Painel
          sessao={sessao}
          aoAtualizarUsuario={(usuario) => setSessao((s) => ({ ...s, usuario }))}
          aoSair={() => setSessao(null)}
        />
      ) : (
        <TelaAcesso aoEntrar={setSessao} />
      )}

      {/* Painel preto do rodapé: mostra o HTTP acontecendo ao vivo. */}
      <RedeLog />
    </>
  );
}
