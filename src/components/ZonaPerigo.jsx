import { useState } from "react";
import { desativarConta } from "../services/api";
import { Botao, Aviso } from "./ui";

// ═══════════════════════════════════════════════════════════════════════
//  Zona de perigo — DELETE (arquivo pronto)
// ═══════════════════════════════════════════════════════════════════════
//
//  Boa prática de interface: ação destrutiva SEMPRE pede confirmação.
//  Aqui usamos duas etapas — clicar uma vez arma, clicar de novo executa.
//  Nunca deixe um clique só apagar dados de alguém.

export default function ZonaPerigo({ token, aoDesativar }) {
  const [armado, setArmado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function confirmar() {
    setErro("");
    setCarregando(true);
    try {
      await desativarConta(token);
      aoDesativar(); // limpa a sessão → volta para a tela de login
    } catch (err) {
      setErro(err.message);
      setCarregando(false);
    }
  }

  return (
    <div className="cartao cartao-perigo">
      <div className="cartao-topo">
        <div>
          <h2>Zona de perigo</h2>
          <p className="sub">desativar minha conta</p>
        </div>
        <span className="selo selo-delete">DELETE</span>
      </div>

      <p className="texto-perigo">
        Você sai do mural e é deslogado. No banco, o registro <b>não é apagado</b> — só recebe{" "}
        <code>ativo: false</code>. Isso se chama <b>soft delete</b>.
      </p>

      <Aviso tipo="erro">{erro}</Aviso>

      {!armado ? (
        <Botao variante="perigo" onClick={() => setArmado(true)}>
          Desativar minha conta
        </Botao>
      ) : (
        <div className="linha-botoes">
          <Botao variante="perigo" carregando={carregando} onClick={confirmar}>
            Tenho certeza
          </Botao>
          <Botao variante="fantasma" onClick={() => setArmado(false)}>
            Cancelar
          </Botao>
        </div>
      )}
    </div>
  );
}
