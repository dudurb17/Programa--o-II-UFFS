// data/db.js
let alunos = [
  { id: 1, nome: "Eduardo Bedin", matricula: "2024001", curso: "CC" },
  { id: 2, nome: "Bruno Lima", matricula: "2024002", curso: "CC" },
  { id: 3, nome: "Carla Matos", matricula: "2024003", curso: "SI" },
];

let disciplinas = [
  { id: 1, nome: "PROG II", codigo: "01", curso: "CC", vagas: 3 },
  { id: 2, nome: "PROG I", codigo: "02", curso: "CC", vagas: 3 },
  { id: 3, nome: "ALGORITMOS", codigo: "03", curso: "CC", vagas: 3 },
];

let matriculas = [];

module.exports = { alunos, disciplinas, matriculas };
