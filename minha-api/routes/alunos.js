// routes/alunos.js
const express = require("express");
const router = express.Router();
// Banco de dados em memória (substituir por banco real depois)
let alunos = [
  { id: 1, nome: "Ana Souza", matricula: "2024001", curso: "CC" },
  { id: 2, nome: "Bruno Lima", matricula: "2024002", curso: "CC" },
  { id: 3, nome: "Carla Matos", matricula: "2024003", curso: "SI" },
];
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


module.exports = router;

