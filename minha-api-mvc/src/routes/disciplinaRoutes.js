const { Router } = require("express");
const DisciplinaController = require("../controllers/disciplinaController");

const router = Router();

router.get("/", DisciplinaController.listar);
router.get("/:id", DisciplinaController.buscar);
router.post("/", DisciplinaController.criar);
router.put("/:id", DisciplinaController.atualizar);
router.delete("/:id", DisciplinaController.remover);

module.exports = router;
