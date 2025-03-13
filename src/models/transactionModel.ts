import { start } from "repl";
import pool from "../config/database.js";

export const createTransaction = async (title: string, amount: number, type: 'income' | 'expense', date: string) => {

    // Verificação de Tipo
    const formattedType = type.trim().toLowerCase();

    if(formattedType !== "income" && formattedType !== "expense" ){
        throw new Error("Tipo inválido. Use 'income' ou 'expense'.")
    }

    // Verificação de Data válida
    if (!date.match(/^\d{4}[-.\/|\\](0[1-9]|1[0-2])[-.\/|\\](0[1-9]|[12]\d|3[01])$/)) {
        throw new Error("Formato de data inválido. Use YYYY-MM-DD");
    }

    const result = await pool.query("INSERT INTO transactions (title, amount,type,date) VALUES ($1,$2,$3,$4) RETURNING *",[title,amount,type,date]);

    return result.rows[0]

};

export const getTransactions = async(startDate?: string, endDate?: string, orderBy:string = 'ASC')=>{   
    try {
        let query = "SELECT * FROM transactions"
        const values: string[] = [];
        let paramIndex: number = 1;


        if(startDate && endDate){
            if(new Date(startDate) > new Date(endDate)){
                throw new Error("A data inicial não pode ser maior que a data final.");
            }

            query += ` WHERE date BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
            values.push(startDate, endDate);

            paramIndex += 2;

        } else if (startDate){

            query += ` WHERE date >= $${paramIndex}`
            values.push(startDate);
            paramIndex++;
            
        } else if (endDate){

            query += ` WHERE date <= $${paramIndex}`
            values.push(endDate);
            paramIndex++;            
        }

        query += ` ORDER BY date ${orderBy}`;

        const result = await pool.query(query, values);
        
        if(result.rows.length === 0){
            return [];
        } else {
            return result.rows;
        }

    } catch (error) {
        console.error("Erro no model de requisição das transações")
        throw new Error(`Erro ao buscar transações: ${error}`);
    }
    
};

export const getTransactionById = async(id: number)=>{

    try {

        const result = await pool.query("SELECT * FROM transactions WHERE id = $1", [id])
    
        return result.rows[0];
        
    } catch (error) {
        console.error("Erro ao buscar transação.", error)
    }

};

export const updateTransaction = async(id: number,title: string,amount: number,type:'income' | 'expense',date: string) => {

    // Verificação de Data válida
    if (!date.match(/^\d{4}[-.\/|\\](0[1-9]|1[0-2])[-.\/|\\](0[1-9]|[12]\d|3[01])$/)) {
        throw new Error("Formato de data inválido. Use YYYY-MM-DD");
    }
    
    const result = await pool.query("UPDATE transactions SET title = $1, amount = $2, type = $3, date = $4 WHERE id = $5 RETURNING *",
        [title,amount,type,date,id]);

    if(result.rowCount === 0){
        throw new Error("Transação não encontrada ou não atualizada.")       
    }
        
    return result.rows[0];
};

export const deleteTransaction = async (id:Number) => {
    
    const result = await pool.query(
        "DELETE FROM transactions WHERE id = $1",
        [id]
    );

    if(result.rowCount === 0){
        throw new Error("Exclusão de Transaction impossibilitada. ")
    }

    return { message: "Transação excluída com sucesso." };
}

export const calculateTotal = async (startDate?: string, endDate?: string) => {
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

        const result = await pool.query(query, values);

        const totalIncomes = result.rows[0].total_incomes;
        const totalExpenses = result.rows[0].total_expenses;

        return totalIncomes - totalExpenses;
        
    } catch (error) {
        console.error("Erro ao calcular o total", error);
        throw new Error(`Erro ao calcular o total: ${error}`);
    }
};



export const calculateTotalIncomes = async (startDate?: string, endDate?: string) => {
    try { 
        
        let query = `SELECT SUM(amount) AS total FROM transactions WHERE type = 'income'`
        const values: string[] = [];
        let paramIndex: number = 1;

        if(startDate && endDate){
            if(new Date (startDate) > new Date (endDate)){
                throw new Error("A data inicial não pode ser maior que a data final.")
            }
            
            query += ` AND date BETWEEN $${paramIndex} AND $${paramIndex +1}`
            values.push(startDate, endDate)
            paramIndex += 2;
            
        } else if (startDate){
            
            query += ` AND date >= $${paramIndex}`;
            values.push(startDate);
            paramIndex++;

        } else if (endDate){

            query += ` AND date <= $${paramIndex}`
            values.push(endDate);
            paramIndex++;
        }
        
        const result = await pool.query(query,values);

        if(result.rows.length === 0 || result.rows[0].total === null){
            return 0;
        } else {
            const numResult = Number(result.rows[0].total)
            return numResult
        }
    
        
    } catch (error) {
        console.error("Erro no retorno do valor total de Incomes")
        throw new Error(`Erro ao calcular Incomes: ${error}`);
    }
}




export const calculateTotalExpenses = async (startDate?: string, endDate?: string) => {
    try { 
        
        let query = `SELECT SUM(amount) AS total FROM transactions WHERE type = 'expense'`
        const values: string[] = [];
        let paramIndex: number = 1;

        if(startDate && endDate){
            if(new Date (startDate) > new Date (endDate)){
                throw new Error("A data inicial não pode ser maior que a data final.")
            }
            
            query += ` AND date BETWEEN $${paramIndex} AND $${paramIndex +1}`
            values.push(startDate, endDate)
            paramIndex += 2;
            
        } else if (startDate){
            
            query += ` AND date >= $${paramIndex}`;
            values.push(startDate);
            paramIndex++;

        } else if (endDate){

            query += ` AND date <= $${paramIndex}`
            values.push(endDate);
            paramIndex++;
        }
        
        const result = await pool.query(query,values);

        if(result.rows.length === 0 || result.rows[0].total === null){
            return 0;
        } else {
            
            const numResult = Number(result.rows[0].total)
            return numResult
        }
    
        
    } catch (error) {
        console.error("Erro no retorno do valor total de Expenses")
        throw new Error(`Erro ao calcular Expenses: ${error}`);
    }
}