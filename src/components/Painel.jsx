import { useState } from "react";
import ListaUsuarios from "./ListaUsuarios";
import FormEdicao from "./FormEdicao";
import ZonaPerigo from "./ZonaPerigo";
import { Avatar } from "./ui";

// ═══════════════════════════════════════════════════════════════════════
//  Painel — a tela de quem já está logado (arquivo pronto)
// ═══════════════════════════════════════════════════════════════════════
//
//  🔑 CONCEITO IMPORTANTE AQUI: "estado que sobe".
//
//  Quem edita o perfil é o <FormEdicao>. Quem mostra o mural é a
//  <ListaUsuarios>. São irmãos — um NÃO enxerga o outro.
//
//  Então como o mural se atualiza quando você salva o nome?
//  O pai (este componente) guarda um contador `versaoDaLista`.
//  Quando o filho avisa "salvei!", o pai soma +1 nesse número.
//  A lista recebe esse número por prop e recarrega quando ele muda.
//
//  Esse padrão tem nome: *lifting state up*. É a resposta para
//  "como faço um componente falar com outro?" — resposta: pelo pai.

export default function Painel({ sessao, aoAtualizarUsuario, aoSair }) {
  const [versaoDaLista, setVersaoDaLista] = useState(0);

  const recarregarLista = () => setVersaoDaLista((v) => v + 1);

  return (
    <div className="painel">
      <header className="cabecalho">
        <div className="marca">
          <span className="marca-ponto" />
          <div>
            <h1>Mural da Turma</h1>
            <p>conectado em backend-3c.vercel.app</p>
          </div>
        </div>

        <div className="cabecalho-usuario">
          <Avatar nome={sessao.usuario?.nome} />
          <div>
            <strong>{sessao.usuario?.nome}</strong>
            <span>{sessao.usuario?.email}</span>
          </div>
          <button className="botao botao-fantasma" onClick={aoSair}>
            Sair
          </button>
        </div>
      </header>

      <main className="conteudo">
        <section className="coluna-principal">
          <ListaUsuarios
            token={sessao.token}
            meuId={sessao.usuario?.id}
            versao={versaoDaLista}
            aoRecarregar={recarregarLista}
          />
        </section>

        <aside className="coluna-lateral">
          <FormEdicao
            sessao={sessao}
            aoSalvar={(usuario) => {
              aoAtualizarUsuario(usuario); // atualiza o cabeçalho
              recarregarLista(); // e manda o mural buscar de novo
            }}
          />
          <ZonaPerigo token={sessao.token} aoDesativar={aoSair} />
        </aside>
      </main>
    </div>
  );
}
