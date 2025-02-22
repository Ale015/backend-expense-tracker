import { Router } from "express";
import { AppDataSource } from "../Config/data-source";
import { Transaction } from "../Models/Transaction";

const router = Router();

router.post('/transaction', async (req, res)=> {
    try {
        const {type, amount, description } = req.body;

        console.log("Dados recebidos:", req.body);

        const transaction = new Transaction();
        transaction.type = type;
        transaction.amount = parseFloat(amount);
        transaction.description = description;

        const transactionRepository = AppDataSource.getRepository(Transaction);
        await transactionRepository.save(transaction);

        res.status(201).send(transaction);
    } catch (error) {
        
        console.error("Error creating transaction:", error);
        res.status(500).send("Internal Server Error");
    }
})

export default router;