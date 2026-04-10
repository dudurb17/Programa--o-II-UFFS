const { disciplinas } = require("../db/data");

let proximoId = 4;

function listarTodos(filtros = {}) {
  let resultado = [...disciplinas];
  if (filtros.curso) {
    resultado = resultado.filter(
      (d) => d.curso === filtros.curso.toUpperCase(),
    );
  }
  return resultado;
}

function buscarPorId(id) {
  return disciplinas.find((d) => d.id === id) || null;
}

function criar(dados) {
  if (!dados.nome || !dados.codigo || !dados.curso || dados.vagas == null) {
    throw new Error("Campos obrigatórios ausentes");
  }
  const existe = disciplinas.find((d) => d.codigo === dados.codigo);
  if (existe) {
    const e = new Error("Código " + dados.codigo + " já cadastrado");
    e.status = 409;
    throw e;
  }
  const novo = {
    id: proximoId++,
    nome: dados.nome,
    codigo: dados.codigo,
    curso: dados.curso,
    vagas: dados.vagas,
  };
  disciplinas.push(novo);
  return novo;
}

function atualizar(id, dados) {
  if (!dados.nome || !dados.codigo || !dados.curso || dados.vagas == null) {
    throw new Error("Campos obrigatórios ausentes");
  }
  const idx = disciplinas.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  disciplinas[idx] = {
    id,
    nome: dados.nome,
    codigo: dados.codigo,
    curso: dados.curso,
    vagas: dados.vagas,
  };
  return disciplinas[idx];
}

function remover(id) {
  const idx = disciplinas.findIndex((d) => d.id === id);
  if (idx === -1) return false;
  disciplinas.splice(idx, 1);
  return true;
}

module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  remover,
};
