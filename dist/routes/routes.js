var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import { createTransaction, getTransactionById, getTransactions, updateTransaction } from "../models/transactionModel.js";
const router = Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("API Funcionando com rotas separadas!");
}));
// ROTAS
router.get("/transactions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield getTransactions();
        res.json(transactions);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar transações" });
    }
}));
router.get("/transactions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const numId = Number(id);
    if (isNaN(numId)) {
        res.status(400).json({ message: "ID inválido" });
    }
    try {
        const transaction = yield getTransactionById(numId);
        if (!transaction) {
            res.status(404).json({ message: "Transação não encontrada" });
        }
        res.json(transaction);
    }
    catch (error) {
        console.error("Erro ao buscar transação: ", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
}));
router.post("/transactions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, amount, type, date } = req.body;
    const postTransaction = yield createTransaction(title, amount, type, date);
    res.status(201).json({ message: "Transação salva corretamente no banco: ", transaction: postTransaction });
}));
router.put("/transactions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, title, amount, type, date } = req.body;
    const updatedTransaction = updateTransaction(id, title, amount, type, date);
}));
export default router;
