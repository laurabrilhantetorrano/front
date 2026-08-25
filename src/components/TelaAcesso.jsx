import { useState } from "react";
import { login, cadastrar } from "../services/api";
import { Campo, Botao, Aviso } from "./ui";

// ═══════════════════════════════════════════════════════════════════════
//  Tela de acesso (arquivo pronto)
// ═══════════════════════════════════════════════════════════════════════
//
//  Repare no PADRÃO que se repete em todo componente que fala com API.
//  São sempre TRÊS estados andando juntos:
//
//      dados      → o que veio (ou o que vai)
//      carregando → true enquanto espera  → trava o botão, mostra spinner
//      erro       → mensagem para o humano ler
//
//  Decore este trio. Ele vale para qualquer app, em qualquer framework.

export default function TelaAcesso({ aoEntrar }) {
  const [aba, setAba] = useState("entrar");
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function enviar(e) {
    // Sem isto o navegador recarrega a página inteira e você perde tudo.
    e.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const dados =
        aba === "entrar"
          ? await login(form.email, form.senha)
          : await cadastrar(form.nome, form.email, form.senha);

      // As duas rotas devolvem { token, usuario } — então o tratamento
      // do sucesso é o mesmo para as duas.
      aoEntrar({ token: dados.token, usuario: dados.usuario });
    } catch (err) {
      setErro(err.message);
    } finally {
      // `finally` roda dando certo OU dando errado.
      // Se você desligar o "carregando" só no try, o botão fica travado
      // para sempre quando dá erro. Erro clássico.
      setCarregando(false);
    }
  }

  return (
    <div className="tela-acesso">
      <div className="cartao-acesso">
        <div className="marca">
          <span className="marca-ponto" />
          <div>
            <h1>Mural da Turma</h1>
            <p>React + API + MongoDB · 3º ano</p>
          </div>
        </div>

        <div className="abas">
          <button
            className={aba === "entrar" ? "aba ativa" : "aba"}
            onClick={() => {
              setAba("entrar");
              setErro("");
            }}
          >
            Entrar
          </button>
          <button
            className={aba === "criar" ? "aba ativa" : "aba"}
            onClick={() => {
              setAba("criar");
              setErro("");
            }}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={enviar}>
          {aba === "criar" && (
            <Campo
              rotulo="Nome"
              value={form.nome}
              onChange={mudar("nome")}
              placeholder="Como a turma vai te ver no mural"
              required
            />
          )}

          <Campo
            rotulo="E-mail"
            type="email"
            value={form.email}
            onChange={mudar("email")}
            placeholder="voce@escola.com"
            required
          />

          <Campo
            rotulo="Senha"
            type="password"
            value={form.senha}
            onChange={mudar("senha")}
            placeholder="mínimo 6 caracteres"
            minLength={6}
            required
            dica={aba === "criar" ? "A senha é criptografada no backend com bcrypt — nem o professor consegue ler." : null}
          />

          <Aviso tipo="erro">{erro}</Aviso>

          <Botao type="submit" carregando={carregando}>
            {aba === "entrar" ? "Entrar" : "Criar minha conta"}
          </Botao>
        </form>

        {aba === "criar" && (
          <p className="rodape-cartao">
            🚧 A aba "Criar conta" só funciona depois da <b>Tarefa 1</b>.
            <br />
            Abra <code>src/services/api.js</code>.
          </p>
        )}
      </div>
    </div>
  );
}
