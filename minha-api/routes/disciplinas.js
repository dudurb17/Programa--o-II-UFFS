const express = require("express");
const router = express.Router();

let disciplinas = [
  { id: 1, nome: "Matemática", codigo: "101", curso: "CC" },
  { id: 2, nome: "Física", codigo: "102", curso: "CC" },
  { id: 3, nome: "Química", codigo: "103", curso: "CC" },
];
let ultimoId = 4;

router.get("/", (req, res) => {
  const { curso } = req.query;
  const resultado = curso
    ? disciplinas.filter((a) => a.curso === curso.toUpperCase())
    : disciplinas;
  res.status(200).json({ total: resultado.length, disciplinas: resultado });
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ erro: "ID deve ser um número inteiro" });
  }
  const disciplina = disciplinas.find((a) => a.id === id);
  if (!disciplina) {
    return res.status(404).json({ erro: "Disciplina com id " + id + " não encontrada" });
  }
  res.status(200).json(disciplina);
});

router.post("/", (req, res) => {
  const { nome, codigo, curso } = req.body;
  if (!nome || !codigo || !curso) {
    return res.status(400).json({
      erro: "Dados inválidos",
      detalhes: [
        !nome && { campo: "nome", mensagem: "Obrigatório" },
        !codigo && { campo: "codigo", mensagem: "Obrigatória" },
        !curso && { campo: "curso", mensagem: "Obrigatório" },
      ].filter(Boolean),
    });
  }
  const existe = disciplinas.find((a) => a.codigo === codigo);
  if (existe) {
    return res
      .status(409)
      .json({ erro: "Código " + codigo + " já cadastrado" });
  }
  const novoDisciplina = { id: ultimoId++, nome, codigo, curso };
  disciplinas.push(novoDisciplina);
  res
    .status(201)
    .set("Location", "/api/disciplinas/" + novoDisciplina.id)
    .json(novoDisciplina);
});

router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
    const { nome, codigo, curso } = req.body;
  if (!nome || !codigo || !curso) {
    return res.status(400).json({
      erro: "PUT requer todos os campos: nome, codigo, curso",
    });
  }
  const indice = disciplinas.findIndex((a) => a.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: "Disciplina não encontrada" });
  }
  disciplinas[indice] = { id, nome, codigo, curso };
  res.status(200).json(disciplinas[indice]);
});

router.patch("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const indice = disciplinas.findIndex((a) => a.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: "Disciplina não encontrada" });
  }
  disciplinas[indice] = { ...disciplinas[indice], ...req.body, id };
  res.status(200).json(disciplinas[indice]);
});
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const indice = disciplinas.findIndex((a) => a.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: "Disciplina não encontrada" });
  }
  
  disciplinas.splice(indice, 1);
  res.status(204).send(); 
});

module.exports = router;