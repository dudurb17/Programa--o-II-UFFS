const AlunoModel = require("../models/alunoModel");
const MatriculaModel = require("../models/matriculaModel");

function listar(req, res) {
  const { curso } = req.query;
  const alunos = AlunoModel.listarTodos({ curso });
  res.status(200).json({ total: alunos.length, alunos });
}

function buscar(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });
  const aluno = AlunoModel.buscarPorId(id);
  if (!aluno) return res.status(404).json({ erro: "Aluno não encontrado" });
  res.status(200).json(aluno);
}
function criar(req, res) {
  try {
    const novoAluno = AlunoModel.criar(req.body);
    res
      .status(201)
      .set("Location", "/api/alunos/" + novoAluno.id)
      .json(novoAluno);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}
function atualizar(req, res) {
  const id = parseInt(req.params.id);
  const aluno = AlunoModel.atualizar(id, req.body);
  if (!aluno) return res.status(404).json({ erro: "Aluno não encontrado" });
  res.status(200).json(aluno);
}

function remover(req, res) {
  const id = parseInt(req.params.id);
  const ok = AlunoModel.remover(id);
  if (!ok) return res.status(404).json({ erro: "Aluno não encontrado" });
  res.status(204).send();
}

function matricular(req, res) {
  const alunoId = parseInt(req.params.id);
  if (isNaN(alunoId)) return res.status(400).json({ erro: "ID inválido" });
  try {
    const novaMatricula = MatriculaModel.matricular(
      alunoId,
      req.body.disciplinaId,
    );
    res.status(201).json(novaMatricula);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

function listarMatriculas(req, res) {
  const alunoId = parseInt(req.params.id);
  if (isNaN(alunoId)) return res.status(400).json({ erro: "ID inválido" });
  const resultado = MatriculaModel.listarDisciplinasPorAluno(alunoId);
  if (!resultado) {
    return res.status(404).json({ erro: "Aluno não encontrado" });
  }
  const { aluno, disciplinas: disciplinasDoAluno } = resultado;
  res.status(200).json({
    mensagem: "Disciplinas do aluno " + aluno.nome + " listadas com sucesso",
    total: disciplinasDoAluno.length,
    disciplinas: disciplinasDoAluno,
  });
}

module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  remover,
  matricular,
  listarMatriculas,
};
