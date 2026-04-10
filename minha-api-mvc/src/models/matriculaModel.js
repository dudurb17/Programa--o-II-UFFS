const { matriculas, disciplinas } = require("../db/data");
const AlunoModel = require("./alunoModel");
const DisciplinaModel = require("./disciplinaModel");

function matricular(alunoId, disciplinaId) {
  const aluno = AlunoModel.buscarPorId(alunoId);
  if (!aluno) {
    const e = new Error("Aluno não encontrado");
    e.status = 404;
    throw e;
  }
  const disciplina = DisciplinaModel.buscarPorId(disciplinaId);
  if (!disciplina) {
    const e = new Error("Disciplina não encontrada");
    e.status = 404;
    throw e;
  }
  const jaMatriculado = matriculas.find(
    (m) => m.alunoId === alunoId && m.disciplinaId === disciplinaId,
  );
  if (jaMatriculado) {
    const e = new Error("Aluno já matriculado nesta disciplina");
    e.status = 409;
    throw e;
  }
  if (disciplina.vagas <= 0) {
    const e = new Error("Vagas esgotadas para esta disciplina");
    e.status = 409;
    throw e;
  }
  disciplina.vagas -= 1;
  const novaMatricula = { alunoId, disciplinaId };
  matriculas.push(novaMatricula);
  return novaMatricula;
}

function listarDisciplinasPorAluno(alunoId) {
  const aluno = AlunoModel.buscarPorId(alunoId);
  if (!aluno) return null;
  const disciplinasDoAluno = matriculas
    .filter((m) => m.alunoId === alunoId)
    .map((m) => disciplinas.find((d) => d.id === m.disciplinaId));
  return { aluno, disciplinas: disciplinasDoAluno };
}

module.exports = { matricular, listarDisciplinasPorAluno };
