import { useState } from "react";
import { editarPerfil } from "../services/api";
import { Campo, Botao, Aviso } from "./ui";

// ═══════════════════════════════════════════════════════════════════════
//  Formulário de edição (arquivo pronto)
// ═══════════════════════════════════════════════════════════════════════
//
//  Repare que o formulário JÁ NASCE PREENCHIDO com os dados atuais:
//     useState(sessao.usuario?.nome ?? "")
//
//  Isso é o que diferencia um formulário de CRIAR de um de EDITAR.
//  Em CRIAR o campo começa vazio; em EDITAR ele começa com o que já
//  existe no banco, senão o usuário teria que redigitar tudo.

export default function FormEdicao({ sessao, aoSalvar }) {
  const [nome, setNome] = useState(sessao.usuario?.nome ?? "");
  const [email, setEmail] = useState(sessao.usuario?.email ?? "");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState("");

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    setOk("");
    setCarregando(true);

    try {
      const dados = await editarPerfil(sessao.token, nome, email);
      setOk(dados.mensagem || "Salvo!");
      aoSalvar(dados.usuario); // avisa o pai → cabeçalho e mural se atualizam
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cartao">
      <div className="cartao-topo">
        <div>
          <h2>Meus dados</h2>
          <p className="sub">edite e veja o mural mudar</p>
        </div>
        <span className="selo selo-put">PUT</span>
      </div>

      <form onSubmit={enviar}>
        <Campo rotulo="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <Campo
          rotulo="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Aviso tipo="erro">{erro}</Aviso>
        <Aviso tipo="ok">{ok}</Aviso>

        <Botao type="submit" carregando={carregando}>
          Salvar alterações
        </Botao>
      </form>
    </div>
  );
}
