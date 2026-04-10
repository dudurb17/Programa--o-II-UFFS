const { alunos } = require("../db/data");

let proximoId = 4;

function validarMatricula(matricula) {
  return /^\d{7}$/.test(matricula);
}

function listarTodos(filtros = {}) {
  let resultado = [...alunos];
  if (filtros.curso) {
    resultado = resultado.filter(
      (a) => a.curso === filtros.curso.toUpperCase(),
    );
  }
  return resultado;
}

function buscarPorId(id) {
  return alunos.find((a) => a.id === id) || null;
}

function criar(dados) {
  if (!dados.nome || !dados.matricula || !dados.curso) {
    throw new Error("Campos obrigatórios ausentes");
  }
  if (!validarMatricula(dados.matricula)) {
    throw new Error("Formato de matrícula inválido");
  }
  const existe = alunos.find((a) => a.matricula === dados.matricula);
  if (existe) throw new Error("Matrícula já cadastrada");
  const novoAluno = { id: proximoId++, ...dados };
  alunos.push(novoAluno);
  return novoAluno;
}

function atualizar(id, dados) {
  const idx = alunos.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  alunos[idx] = { ...alunos[idx], ...dados, id };
  return alunos[idx];
}

function remover(id) {
  const idx = alunos.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  alunos.splice(idx, 1);
  return true;
}

module.exports = { listarTodos, buscarPorId, criar, atualizar, remover };
