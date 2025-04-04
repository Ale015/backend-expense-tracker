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
import { calculateTotal, calculateTotalExpenses, calculateTotalIncomes, createTransaction, deleteTransaction, getTransactionById, getTransactions, updateTransaction } from "../models/transactionModel.js";
const router = Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("API Funcionando com rotas separadas!");
}));
// ROTAS
router.get("/transactions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        let { orderBy } = req.query;
        const urlDateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        if ((startDate && !urlDateRegex.test(startDate)) || (endDate && !urlDateRegex.test(endDate))) {
            res.status(400).json({ message: "Formato de data inválido. Use YYYY-MM-DD." });
            return;
        }
        let validOrderBy = 'ASC';
        orderBy = String(orderBy);
        if (orderBy.trim().toUpperCase() === 'ASC' || orderBy.trim().toUpperCase() === 'DESC') {
            validOrderBy = orderBy.trim().toUpperCase();
        }
        else {
            validOrderBy = 'ASC';
        }
        const transactions = yield getTransactions(startDate, endDate, validOrderBy);
        if (transactions.length === 0) {
            res.json([]);
        }
        res.json(transactions);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar transações" });
        return;
    }
}));
router.get("/transactions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const numId = Number(id);
    if (isNaN(numId)) {
        res.status(400).json({ message: "ID inválido" });
        return;
    }
    try {
        const transaction = yield getTransactionById(numId);
        if (!transaction) {
            res.status(404).json({ message: "Transação não encontrada" });
            return;
        }
        res.json(transaction);
    }
    catch (error) {
        console.error("Erro ao buscar transação: ", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
}));
router.post("/transactions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, amount, type, date } = req.body;
        if (!title || !amount || !type || !date) {
            res.status(400).json({ message: "Todos os campos são obrigatórios" });
            return;
        }
        const formattedType = type.trim().toLowerCase();
        if (formattedType !== "income" && formattedType !== "expense") {
            res.status(400).json({ message: "Informe o tipo corretamente: 'income' ou 'expense'" });
            return;
        }
        const dateRegex = /^\d{4}[-.\/|\\](0[1-9]|1[0-2])[-.\/|\\](0[1-9]|[12]\d|3[01])$/;
        if (!dateRegex.test(date)) {
            res.status(400).json({ message: "Formato de data inválido. Use YYYY-MM-DD." });
            return;
        }
        const normalizedDate = date.replace(/[-.\/|\\]/g, "-");
        const postTransaction = yield createTransaction(title, amount, formattedType, normalizedDate);
        res.status(201).json({
            message: "Transação salva corretamente no banco.",
            transaction: postTransaction
        });
    }
    catch (error) {
        console.error("Erro ao criar transação: ", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}));
router.put("/transactions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, amount, type, date } = req.body;
        const numId = Number(id);
        if (isNaN(numId) || numId <= 0) {
            res.status(400).json({ message: "ID inválido. " });
            return;
        }
        // Verificação do tipo
        const formattedType = type.trim().toLowerCase();
        if (formattedType !== 'income' && formattedType !== 'expense') {
            res.status(400).json({ message: "O tipo deve ser 'income' ou 'expense'." });
            return;
        }
        // verificação de data
        const dateRegex = /^\d{4}[-.\/|\\](0[1-9]|1[0-2])[-.\/|\\](0[1-9]|[12]\d|3[01])$/;
        if (!dateRegex.test(date)) {
            res.status(400).json({ message: "Formato de data inválido. Use YYYY-MM-DD" });
            return;
        }
        const normalizedDate = date.replace(/[-.\/|\\]/g, "-");
        const updatedTransaction = yield updateTransaction(numId, title, amount, formattedType, normalizedDate);
        res.status(200).json({
            message: "Transação atualizada com sucesso.",
            transaction: updatedTransaction,
        });
    }
    catch (error) {
        console.error("Error ao atualizar a transação.", error);
        res.status(501);
    }
}));
router.delete("/transactions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const numId = Number(id);
        if (isNaN(numId) || numId <= 0) {
            res.status(400).json({ message: "ID inválido" });
            return;
        }
        const deletedTask = yield deleteTransaction(numId);
        res.status(204);
        return;
    }
    catch (error) {
        console.error("Error ao atualizar a transação.", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
}));
router.get("/dashboard", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { startDate, endDate } = req.query;
    if (startDate) {
        startDate = String(startDate);
        startDate = startDate.replace(/[-.\/|\\]/g, "-").trim();
    }
    if (endDate) {
        endDate = String(endDate);
        endDate = endDate.replace(/[-.\/|\\]/g, "-").trim();
    }
    const urlDateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if ((startDate && !urlDateRegex.test(startDate)) || (endDate && !urlDateRegex.test(endDate))) {
        res.status(400).json({ message: "Formato de data inválido. Use YYYY-MM-DD." });
        return;
    }
    const total = yield calculateTotal(startDate, endDate);
    const totalIncomes = yield calculateTotalIncomes(startDate, endDate);
    const totalExpenses = yield calculateTotalExpenses(startDate, endDate);
    const objStatus = { status: 200 };
    res.status(200).json({ objStatus, total, totalIncomes, totalExpenses });
}));
export default router;
