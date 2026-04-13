const { matriculas, disciplinas } = require("../db/data");
const AlunoModel = require("./alunoModel");
const DisciplinaModel = require("./disciplinaModel");

function matricular(alunoId, disciplinaId) {
  if (disciplinaId == null || disciplinaId === "") {
    throw new Error("Campos obrigatórios ausentes");
  }
  const aluno = AlunoModel.buscarPorId(alunoId);
  if (!aluno) throw new Error("Aluno não encontrado");
  const disciplina = DisciplinaModel.buscarPorId(disciplinaId);
  if (!disciplina) throw new Error("Disciplina não encontrada");
  const jaMatriculado = matriculas.find(
    (m) => m.alunoId === alunoId && m.disciplinaId === disciplinaId,
  );
  if (jaMatriculado) {
    throw new Error("Aluno já matriculado nesta disciplina");
  }
  if (disciplina.vagas <= 0) {
    throw new Error("Vagas esgotadas para esta disciplina");
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
