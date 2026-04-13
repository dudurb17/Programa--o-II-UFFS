const DisciplinaModel = require("../models/disciplinaModel");

function listar(req, res) {
  const { curso } = req.query;
  const lista = DisciplinaModel.listarTodos({ curso });
  res.status(200).json({ total: lista.length, disciplinas: lista });
}

function buscar(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });
  const disciplina = DisciplinaModel.buscarPorId(id);
  if (!disciplina) {
    return res.status(404).json({ erro: "Disciplina não encontrada" });
  }
  res.status(200).json(disciplina);
}

function criar(req, res) {
  try {
    const novo = DisciplinaModel.criar(req.body);
    res
      .status(201)
      .set("Location", "/api/disciplinas/" + novo.id)
      .json(novo);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

function atualizar(req, res) {
  const id = parseInt(req.params.id);
  try {
    const atualizada = DisciplinaModel.atualizar(id, req.body);
    if (!atualizada) {
      return res.status(404).json({ erro: "Disciplina não encontrada" });
    }
    res.status(200).json(atualizada);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

function remover(req, res) {
  const id = parseInt(req.params.id);
  const ok = DisciplinaModel.remover(id);
  if (!ok) return res.status(404).json({ erro: "Disciplina não encontrada" });
  res.status(204).send();
}

module.exports = { listar, buscar, criar, atualizar, remover };
