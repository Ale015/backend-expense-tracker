import { Router } from "express";

const router = Router();


router.get("/", async (req, res) => {
    res.send("API Funcionando com rotas separadas!");
});

// ROTAS
// router.get("/transactions", async (req, res)=>{

// })


export default router;