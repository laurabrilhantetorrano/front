// ═══════════════════════════════════════════════════════════════════════
//
//   🎯  ESTE É O ARQUIVO DA AULA. É AQUI QUE VOCÊ VAI TRABALHAR.
//
//   Todo o resto do projeto (telas, botões, cores) já está pronto.
//   Falta só uma coisa: FAZER O REACT CONVERSAR COM A API.
//
//   Regra de ouro deste arquivo:
//   ─────────────────────────────
//   Este é o ÚNICO lugar do projeto que sabe o endereço da API e sabe
//   escrever `fetch`. Os componentes só chamam funções daqui.
//   Isso se chama "camada de serviço" e é o padrão usado no mercado —
//   se amanhã a API mudar de endereço, você mexe em 1 arquivo, não em 12.
//
// ═══════════════════════════════════════════════════════════════════════

import { API_URL } from "../config";

// ═══════════════════════════════════════════════════════════════════════
//  ROTAS DISPONÍVEIS NO BACKEND  (sua "cola" — consulte o tempo todo)
// ═══════════════════════════════════════════════════════════════════════
//
//  PÚBLICAS (não precisam de token)
//  ┌────────┬──────────────────────────────┬────────────────────────────┐
//  │ POST   │ /api/usuarios/cadastrar      │ body: { nome, email, senha}│
//  │ POST   │ /api/usuarios/login          │ body: { email, senha }     │
//  └────────┴──────────────────────────────┴────────────────────────────┘
//
//  PRIVADAS (exigem o header  Authorization: Bearer <token>)
//  ┌────────┬──────────────────────────────┬────────────────────────────┐
//  │ GET    │ /api/usuarios                │ lista todo mundo           │
//  │ GET    │ /api/usuarios/perfil         │ meus próprios dados        │
//  │ PUT    │ /api/usuarios/editar         │ body: { nome, email }      │
//  │ DELETE │ /api/usuarios/desativar      │ sem body                   │
//  └────────┴──────────────────────────────┴────────────────────────────┘
//
//  Formato das respostas — SEMPRE um JSON com a chave "sucesso":
//    { "sucesso": true,  "mensagem": "...", "token": "...", "usuario": {...} }
//    { "sucesso": false, "mensagem": "Este e-mail já está cadastrado." }
//
// ═══════════════════════════════════════════════════════════════════════

// ╔═════════════════════════════════════════════════════════════════════╗
// ║  EXEMPLO RESOLVIDO — feito junto com o professor                    ║
// ║  Leia estas 20 linhas com MUITA atenção: as 4 tarefas abaixo são    ║
// ║  variações desta mesma receita.                                     ║
// ╚═════════════════════════════════════════════════════════════════════╝
export async function login(email, senha) {
  // 1) DISPARA o pedido e ESPERA a resposta chegar.
  //    `await` = "segura aqui até voltar". Sem ele você recebe uma
  //    Promise (uma promessa), não os dados.
  const resposta = await fetch(`${API_URL}/api/usuarios/login`, {
    // 2) O MÉTODO diz a INTENÇÃO do pedido:
    //    GET = ler | POST = criar | PUT = atualizar | DELETE = apagar
    method: "POST",

    // 3) O HEADER é o "envelope" do pedido. Esta linha avisa ao servidor:
    //    "o conteúdo que estou te mandando é JSON".
    //    Sem ela o Express não consegue ler o req.body e você recebe 400.
    headers: { "Content-Type": "application/json" },

    // 4) O BODY é a carga. Só existe em POST/PUT/PATCH.
    //    JSON.stringify transforma o objeto JS em TEXTO, porque pela
    //    internet só trafega texto.
    body: JSON.stringify({ email, senha }),
  });

  // 5) A resposta chegou como texto. Traduzimos de volta para objeto JS.
  //    Repare no segundo `await`: ler o corpo também é assíncrono.
  const dados = await resposta.json();

  // 6) ⚠️ ARMADILHA CLÁSSICA: o fetch NÃO dá erro quando o status é 401 ou
  //    404. Para o fetch, "recebi uma resposta" já é sucesso.
  //    Quem avisa se deu certo é `resposta.ok` (true de 200 a 299).
  //    Se você esquecer este if, um login errado passa como se tivesse dado
  //    certo — e o app quebra 3 telas depois, sem você entender por quê.
  if (!resposta.ok) {
    throw new Error(dados.mensagem || "Não foi possível entrar.");
  }

  // 7) Devolve os dados prontos para o componente usar.
  return dados; // → { sucesso, mensagem, token, usuario: { id, nome, email } }
}

// ╔═════════════════════════════════════════════════════════════════════╗
// ║                                                                     ║
// ║   🚧  TAREFA 1 — ENVIO  (POST)                                      ║
// ║                                                                     ║
// ║   Cadastrar um usuário novo no banco de dados.                      ║
// ║   Onde isso aparece na tela: aba "Criar conta".                     ║
// ║                                                                     ║
// ╚═════════════════════════════════════════════════════════════════════╝
//
//  RECEITA:
//    1. fetch para `${API_URL}/api/usuarios/cadastrar`
//    2. method: "POST"
//    3. headers com "Content-Type": "application/json"
//    4. body: JSON.stringify({ nome, email, senha })
//    5. converta a resposta com .json()
//    6. se !resposta.ok → throw new Error(dados.mensagem)
//    7. return dados
//
//  💡 É quase idêntico ao `login` acima. A diferença: a URL e três campos
//     no body em vez de dois.
//
//  ✅ Deu certo quando: você cria uma conta e cai direto no painel logado.
//  🧪 Teste o erro também: tente cadastrar o MESMO e-mail duas vezes.
//     O backend responde 400 com "Este e-mail já está cadastrado."
//     Sua mensagem tem que aparecer em vermelho na tela.
//
export async function cadastrar(nome, email, senha) {
  const resposta = await fetch(`${API_URL}/api/usuarios/cadastrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.mensagem || "Não foi possível criar a conta.");
  }

  return dados; // { sucesso, mensagem, token, usuario }
}


// ╔═════════════════════════════════════════════════════════════════════╗
// ║                                                                     ║
// ║   🚧  TAREFA 2 — LISTAGEM  (GET + token)                            ║
// ║                                                                     ║
// ║   Trazer todo mundo que já se cadastrou.                            ║
// ║   Onde isso aparece na tela: o mural do meio, "Turma na API".       ║
// ║                                                                     ║
// ╚═════════════════════════════════════════════════════════════════════╝
//
//  ⚠️ ESTA É A PRIMEIRA ROTA PRIVADA. Aqui entra o CRACHÁ.
//
//  Toda vez que você faz login, o backend te devolve um `token` — uma
//  string gigante que prova quem você é. Rota privada sem token = 401.
//  O token vai num header chamado `Authorization`, e o valor precisa
//  começar com a palavra "Bearer" + um espaço:
//
//      headers: { Authorization: `Bearer ${token}` }
//
//  (Se esquecer o "Bearer " o backend também devolve 401. É o erro nº 1
//   da turma. Olhe o painel preto embaixo: ele mostra o header que saiu.)
//
//  RECEITA:
//    1. fetch para `${API_URL}/api/usuarios`
//    2. NÃO precisa de method (GET é o padrão do fetch)
//    3. NÃO precisa de body — GET não carrega body, nunca
//    4. headers: { Authorization: `Bearer ${token}` }
//    5. .json(), checar resposta.ok, throw se der ruim
//    6. return dados.usuarios   ← devolva SÓ O ARRAY, não o objeto inteiro
//
//  ✅ Deu certo quando: os cards da turma aparecem no mural.
//  🧪 Teste o erro: apague uma letra do token antes de mandar e veja o 401.
//
export async function listarUsuarios(token) {
  const resposta = await fetch(`${API_URL}/api/usuarios`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.mensagem || "Não foi possível carregar a lista.");
  }

  return dados.usuarios;
}

// ╔═════════════════════════════════════════════════════════════════════╗
// ║                                                                     ║
// ║   🚧  TAREFA 3 — EDIÇÃO  (PUT)                                      ║
// ║                                                                     ║
// ║   Atualizar o seu nome e/ou e-mail.                                 ║
// ║   Onde isso aparece na tela: card "Meus dados".                     ║
// ║                                                                     ║
// ╚═════════════════════════════════════════════════════════════════════╝
//
//  Esta é a tarefa que JUNTA as duas anteriores:
//  tem body (como a Tarefa 1) E tem token (como a Tarefa 2).
//  Ou seja: DOIS headers dentro do mesmo objeto.
//
//        headers: {
//          "Content-Type": "application/json",
//          Authorization: `Bearer ${token}`,
//        }
//
//  RECEITA:
//    1. fetch para `${API_URL}/api/usuarios/editar`
//    2. method: "PUT"
//    3. os dois headers acima
//    4. body: JSON.stringify({ nome, email })
//    5. .json(), checar resposta.ok, throw se der ruim
//    6. return dados
//
//  ✅ Deu certo quando: você troca seu nome, clica em salvar, e o seu card
//     no mural muda sozinho.
//  🤔 Pergunta pra pensar: por que o card do mural mudou, se você só mexeu
//     no formulário? (Resposta: o componente pai recarregou a lista.)
//
export async function editarPerfil(token, nome, email) {
  const resposta = await fetch(`${API_URL}/api/usuarios/editar`, {
  method: "PUT",
  headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({ nome, email }),
});
const dados = await resposta.json();
if (!resposta.ok) {
throw new Error(dados.mensagem || "Não foi possível salvar.");
}
 return dados;
}

// ╔═════════════════════════════════════════════════════════════════════╗
// ║                                                                     ║
// ║   🚧  TAREFA 4 — EXCLUSÃO  (DELETE)                                 ║
// ║                                                                     ║
// ║   Desativar a sua conta.                                            ║
// ║   Onde isso aparece na tela: card vermelho "Zona de perigo".        ║
// ║                                                                     ║
// ╚═════════════════════════════════════════════════════════════════════╝
//
//  É a mais curta das quatro: sem body, só o crachá.
//
//  RECEITA:
//    1. fetch para `${API_URL}/api/usuarios/desativar`
//    2. method: "DELETE"
//    3. headers: { Authorization: `Bearer ${token}` }
//    4. .json(), checar resposta.ok, throw se der ruim
//    5. return dados
//
//  ✅ Deu certo quando: você some do mural da turma e é deslogado.
//
//  🧠 CURIOSIDADE IMPORTANTE — "soft delete":
//     Olhe o backend: o DELETE não apaga nada de verdade! Ele só marca
//     `ativo: false` no banco. O registro continua lá.
//     Empresas fazem isso o tempo todo: dá pra recuperar conta, manter
//     histórico e obedecer a lei. Quando você "exclui" sua conta numa rede
//     social, quase sempre é isso que acontece.
//
  export async function desativarConta(token) {
  const resposta = await fetch(`${API_URL}/api/usuarios/desativar`, {
  method: "DELETE",
headers: { Authorization: `Bearer ${token}` },
});
const dados = await resposta.json();
if (!resposta.ok) {
throw new Error(dados.mensagem || "Não foi possível desativar a conta.");
}
return dados;
}