// routes/alunos.js
const express = require("express");
const router = express.Router();
// Banco de dados em memória (substituir por banco real depois)
const { alunos, disciplinas, matriculas } = require("../db/data");
let proximoId = 4;

// -- GET /alunos lista todos (com filtro opcional) -----------------------
router.get("/", (req, res) => {
  const { curso } = req.query;
  const resultado = curso
    ? alunos.filter((a) => a.curso === curso.toUpperCase())
    : alunos;
  res.status(200).json({ total: resultado.length, alunos: resultado });
});
// -- GET /alunos/:id busca um aluno específico ---------------------------
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ erro: "ID deve ser um número inteiro" });
  }
  const aluno = alunos.find((a) => a.id === id);
  if (!aluno) {
    return res
      .status(404)
      .json({ erro: "Aluno com id " + id + " não encontrado" });
  }
  res.status(200).json(aluno);
});
// -- POST /alunos cria novo aluno ----------------------------------------
router.post("/", (req, res) => {
  const { nome, matricula, curso } = req.body;
  if (!nome || !matricula || !curso) {
    return res.status(400).json({
      erro: "Dados inválidos",
      detalhes: [
        !nome && { campo: "nome", mensagem: "Obrigatório" },
        !matricula && { campo: "matricula", mensagem: "Obrigatória" },
        !curso && { campo: "curso", mensagem: "Obrigatório" },
      ].filter(Boolean),
    });
  }
  const existe = alunos.find((a) => a.matricula === matricula);
  if (existe) {
    return res
      .status(409)
      .json({ erro: "Matrícula " + matricula + " já cadastrada" });
  }
  const novoAluno = { id: proximoId++, nome, matricula, curso };
  alunos.push(novoAluno);
  res
    .status(201)
    .set("Location", "/api/alunos/" + novoAluno.id)
    .json(novoAluno);
});
// -- PUT /alunos/:id substituição completa --------------------------------
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, matricula, curso } = req.body;
  if (!nome || !matricula || !curso) {
    return res.status(400).json({
      erro: "PUT requer todos os campos: nome, matricula, curso",
    });
  }
  const indice = alunos.findIndex((a) => a.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: "Aluno não encontrado" });
  }
  alunos[indice] = { id, nome, matricula, curso };
  res.status(200).json(alunos[indice]);
});
// -- PATCH /alunos/:id atualização parcial --------------------------------
router.patch("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const indice = alunos.findIndex((a) => a.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: "Aluno não encontrado" });
  }
  // Spread: mescla dados existentes com os novos (só campos enviados mudam)
  alunos[indice] = { ...alunos[indice], ...req.body, id };
  res.status(200).json(alunos[indice]);
});
// -- DELETE /alunos/:id remoção ------------------------------------------
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const indice = alunos.findIndex((a) => a.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: "Aluno não encontrado" });
  }
  alunos.splice(indice, 1);
  res.status(204).send(); // 204 No Content sem corpo na resposta
});

router.post("/:id/matriculas", (req, res) => {
  const alunoId = parseInt(req.params.id);
  const { disciplinaId } = req.body;
  if (!disciplinaId) {
    return res.status(400).json({
      erro: "Dados inválidos",
      detalhes: [
        { campo: "disciplinaId", mensagem: "Obrigatório" },
      ],
    });
  }
  const aluno = alunos.find((a) => a.id === alunoId);
  if (!aluno) {
    return res.status(404).json({ erro: "Aluno não encontrado" });
  }
  const disciplina = disciplinas.find((d) => d.id === disciplinaId);
  if (!disciplina) {
    return res.status(404).json({ erro: "Disciplina não encontrada" });
  }
  const jaMatriculado = matriculas.find(
    (m) => m.alunoId === alunoId && m.disciplinaId === disciplinaId,
  );
  if (jaMatriculado) {
    return res
      .status(409)
      .json({ erro: "Aluno já matriculado nesta disciplina" });
  }
  if (disciplina.vagas <= 0) {
    return res
      .status(409)
      .json({ erro: "Vagas esgotadas para esta disciplina" });
  }
  disciplina.vagas -= 1;
  const novaMatricula = { alunoId, disciplinaId };
  matriculas.push(novaMatricula);
  res.status(201).json(novaMatricula);
});

router.get("/:id/matriculas", (req, res) => {
  const alunoId = parseInt(req.params.id);
  const aluno = alunos.find((a) => a.id === alunoId);
  if (!aluno) {
    return res.status(404).json({ erro: "Aluno não encontrado" });
  }
  const disciplinasDoAluno = matriculas
    .filter((m) => m.alunoId === alunoId)
    .map((m) => disciplinas.find((d) => d.id === m.disciplinaId));
  res
    .status(200)
    .json({
      mensagem: "Disciplinas do aluno " + aluno.nome + " listadas com sucesso",
      total: disciplinasDoAluno.length,
      disciplinas: disciplinasDoAluno,
    });
});

module.exports = router;
