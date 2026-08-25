// Pecinhas visuais reaproveitadas em várias telas.
// (Arquivo pronto — nada de fetch aqui.)

export function Campo({ rotulo, dica, ...props }) {
  return (
    <label className="campo">
      <span className="campo-rotulo">{rotulo}</span>
      <input className="campo-input" {...props} />
      {dica && <span className="campo-dica">{dica}</span>}
    </label>
  );
}

export function Botao({ carregando, children, variante = "primario", ...props }) {
  return (
    <button className={`botao botao-${variante}`} disabled={carregando || props.disabled} {...props}>
      {carregando ? <span className="girando" /> : null}
      {carregando ? "Enviando…" : children}
    </button>
  );
}

export function Aviso({ tipo = "erro", children }) {
  if (!children) return null;
  const icone = { erro: "⛔", ok: "✅", info: "💡" }[tipo];
  return (
    <div className={`aviso aviso-${tipo}`}>
      <span>{icone}</span>
      <p>{children}</p>
    </div>
  );
}

export function Esqueleto({ quantidade = 3 }) {
  return (
    <div className="grade-cards">
      {Array.from({ length: quantidade }).map((_, i) => (
        <div key={i} className="card-usuario esqueleto" />
      ))}
    </div>
  );
}

// Gera uma cor estável a partir do nome — assim cada pessoa tem sempre
// o mesmo avatar colorido, sem precisar guardar nada no banco.
export function Avatar({ nome }) {
  const texto = (nome || "?").trim();
  const iniciais = texto
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  let soma = 0;
  for (const c of texto) soma += c.charCodeAt(0);
  const matiz = soma % 360;
  return (
    <div
      className="avatar"
      style={{
        background: `linear-gradient(135deg, hsl(${matiz} 70% 45%), hsl(${(matiz + 45) % 360} 70% 35%))`,
      }}
    >
      {iniciais || "?"}
    </div>
  );
}
