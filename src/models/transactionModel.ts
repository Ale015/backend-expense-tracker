import pool from "../config/database.js";

export const createTransaction = async (title: string, amount: number, type: 'income' | 'expense', date: string) => {

    // Verificação de Tipo
    const formattedType = type.trim().toLowerCase();

    if(formattedType !== "income" && formattedType !== "expense" ){
        throw new Error("Tipo inválido. Use 'income' ou 'expense'.")
    }

    // Verificação de Data válida
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error("Formato de data inválido. Use DD/MM/YYYY ou DD-MM-YYYY");
    }

    const regexDate = date;
    const [, day, month, year] = regexDate;
    const formattedDate = `${year}-${month}-${day}`

    const result = await pool.query("INSERT INTO transactions (title, amount,type,date) VALUES ($1,$2,$3,$4) RETURNING *",[title,amount,type,formattedDate]);

    return result.rows[0]

};

export const getTransactions = async()=>{
    const result = await pool.query("SELECT * FROM transactions ORDER BY created_at DESC");

    if(result.rows.length === 0){
        return {message: "Nenhuma Transação encontrada,"}
    } else {
        return result.rows;
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
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error("Formato de data inválido. Use DD/MM/YYYY ou DD-MM-YYYY");
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

