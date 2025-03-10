var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from "../config/database.js";
export const createTransaction = (title, amount, type, date) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificação de Tipo
    const formattedType = type.trim().toLowerCase();
    if (formattedType !== "income" && formattedType !== "expense") {
        throw new Error("Tipo inválido. Use 'income' ou 'expense'.");
    }
    // Verificação de Data válida
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[-\/.](0[1-9]|1[0-2])[-\/.](\d{4})$/;
    const match = date.match(dateRegex);
    if (!match) {
        throw new Error("Formato de data inválido. Use DD/MM/YYYY ou DD-MM-YYYY");
    }
    const [, day, month, year] = match;
    const formattedDate = `${year}-${month}-${day}`;
    const result = yield pool.query("INSERT INTO transactions (title, amount,type,date) VALUES ($1,$2,$3,$4) RETURNING *", [title, amount, type, formattedDate]);
    return result.rows[0];
});
export const getTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT * FROM transactions ORDER BY created_at DESC");
    if (result.rows.length === 0) {
        return { message: "Nenhuma Transação encontrada," };
    }
    else {
        return result.rows;
    }
});
export const getTransactionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT * FROM transactions WHERE id = $1", [id]);
    return result.rows[0];
});
export const updateTransaction = (id, title, amount, type, date) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificação de Tipo
    const formattedType = type.trim().toLowerCase();
    if (formattedType !== "income" && formattedType !== "expense") {
        throw new Error("Tipo inválido. Use 'income' ou 'expense'.");
    }
    // Verificação de Data válida
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[-\/.](0[1-9]|1[0-2])[-\/.](\d{4})$/;
    const match = date.match(dateRegex);
    if (!match) {
        throw new Error("Formato de data inválido. Use DD/MM/YYYY ou DD-MM-YYYY");
    }
    const [, day, month, year] = match;
    const formattedDate = `${year}-${month}-${day}`;
    const result = yield pool.query("UPDATE transactions SET title = $1, amount = $2, type = $3, date = $4 WHERE id = $5 RETURNING *", [title, amount, type, formattedDate, id]);
    if (!result) {
    }
    return result.rows[0];
});
