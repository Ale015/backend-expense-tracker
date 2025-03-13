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
    if (!date.match(/^\d{4}[-.\/|\\](0[1-9]|1[0-2])[-.\/|\\](0[1-9]|[12]\d|3[01])$/)) {
        throw new Error("Formato de data inválido. Use YYYY-MM-DD");
    }
    const result = yield pool.query("INSERT INTO transactions (title, amount,type,date) VALUES ($1,$2,$3,$4) RETURNING *", [title, amount, type, date]);
    return result.rows[0];
});
export const getTransactions = (startDate_1, endDate_1, ...args_1) => __awaiter(void 0, [startDate_1, endDate_1, ...args_1], void 0, function* (startDate, endDate, orderBy = 'ASC') {
    try {
        let query = "SELECT * FROM transactions";
        const values = [];
        let paramIndex = 1;
        if (startDate && endDate) {
            if (new Date(startDate) > new Date(endDate)) {
                throw new Error("A data inicial não pode ser maior que a data final.");
            }
            query += ` WHERE date BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
            values.push(startDate, endDate);
            paramIndex += 2;
        }
        else if (startDate) {
            query += ` WHERE date >= $${paramIndex}`;
            values.push(startDate);
            paramIndex++;
        }
        else if (endDate) {
            query += ` WHERE date <= $${paramIndex}`;
            values.push(endDate);
            paramIndex++;
        }
        query += ` ORDER BY date ${orderBy}`;
        const result = yield pool.query(query, values);
        if (result.rows.length === 0) {
            return [];
        }
        else {
            return result.rows;
        }
    }
    catch (error) {
        console.error("Erro no model de requisição das transações");
        throw new Error(`Erro ao buscar transações: ${error}`);
    }
});
export const getTransactionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pool.query("SELECT * FROM transactions WHERE id = $1", [id]);
        return result.rows[0];
    }
    catch (error) {
        console.error("Erro ao buscar transação.", error);
    }
});
export const updateTransaction = (id, title, amount, type, date) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificação de Data válida
    if (!date.match(/^\d{4}[-.\/|\\](0[1-9]|1[0-2])[-.\/|\\](0[1-9]|[12]\d|3[01])$/)) {
        throw new Error("Formato de data inválido. Use YYYY-MM-DD");
    }
    const result = yield pool.query("UPDATE transactions SET title = $1, amount = $2, type = $3, date = $4 WHERE id = $5 RETURNING *", [title, amount, type, date, id]);
    if (result.rowCount === 0) {
        throw new Error("Transação não encontrada ou não atualizada.");
    }
    return result.rows[0];
});
export const deleteTransaction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("DELETE FROM transactions WHERE id = $1", [id]);
    if (result.rowCount === 0) {
        throw new Error("Exclusão de Transaction impossibilitada. ");
    }
    return { message: "Transação excluída com sucesso." };
});
export const calculateTotal = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Definir valores padrão se não forem passados
        const defaultStartDate = '0001-01-01';
        const defaultEndDate = '9000-12-31';
        startDate = startDate || defaultStartDate;
        endDate = endDate || defaultEndDate;
        if (new Date(startDate) > new Date(endDate)) {
            throw new Error("A data inicial não pode ser maior que a data final.");
        }
        const query = `
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_incomes,
                COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses
            FROM transactions
            WHERE date BETWEEN $1 AND $2
        `;
        const values = [startDate, endDate];
        const result = yield pool.query(query, values);
        const totalIncomes = result.rows[0].total_incomes;
        const totalExpenses = result.rows[0].total_expenses;
        return totalIncomes - totalExpenses;
    }
    catch (error) {
        console.error("Erro ao calcular o total", error);
        throw new Error(`Erro ao calcular o total: ${error}`);
    }
});
export const calculateTotalIncomes = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = `SELECT SUM(amount) AS total FROM transactions WHERE type = 'income'`;
        const values = [];
        let paramIndex = 1;
        if (startDate && endDate) {
            if (new Date(startDate) > new Date(endDate)) {
                throw new Error("A data inicial não pode ser maior que a data final.");
            }
            query += ` AND date BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
            values.push(startDate, endDate);
            paramIndex += 2;
        }
        else if (startDate) {
            query += ` AND date >= $${paramIndex}`;
            values.push(startDate);
            paramIndex++;
        }
        else if (endDate) {
            query += ` AND date <= $${paramIndex}`;
            values.push(endDate);
            paramIndex++;
        }
        const result = yield pool.query(query, values);
        if (result.rows.length === 0 || result.rows[0].total === null) {
            return 0;
        }
        else {
            const numResult = Number(result.rows[0].total);
            return numResult;
        }
    }
    catch (error) {
        console.error("Erro no retorno do valor total de Incomes");
        throw new Error(`Erro ao calcular Incomes: ${error}`);
    }
});
export const calculateTotalExpenses = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = `SELECT SUM(amount) AS total FROM transactions WHERE type = 'expense'`;
        const values = [];
        let paramIndex = 1;
        if (startDate && endDate) {
            if (new Date(startDate) > new Date(endDate)) {
                throw new Error("A data inicial não pode ser maior que a data final.");
            }
            query += ` AND date BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
            values.push(startDate, endDate);
            paramIndex += 2;
        }
        else if (startDate) {
            query += ` AND date >= $${paramIndex}`;
            values.push(startDate);
            paramIndex++;
        }
        else if (endDate) {
            query += ` AND date <= $${paramIndex}`;
            values.push(endDate);
            paramIndex++;
        }
        const result = yield pool.query(query, values);
        if (result.rows.length === 0 || result.rows[0].total === null) {
            return 0;
        }
        else {
            const numResult = Number(result.rows[0].total);
            return numResult;
        }
    }
    catch (error) {
        console.error("Erro no retorno do valor total de Expenses");
        throw new Error(`Erro ao calcular Expenses: ${error}`);
    }
});
