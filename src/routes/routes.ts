import { Router } from "express";
import { createTransaction, deleteTransaction, getTransactionById, getTransactions, updateTransaction } from "../models/transactionModel.js";

const router = Router();


router.get("/", async (req, res) => {
    res.send("API Funcionando com rotas separadas!");
});

// ROTAS
router.get("/transactions", async (req, res) => {
    try {
        const transactions = await getTransactions();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar transações" });
    }
});

router.get("/transactions/:id", async (req,res)=>{
    const { id } = req.params;
    
    const numId = Number(id);

    if(isNaN(numId)){
        res.status(400).json({message: "ID inválido"});
        return;
    }

    try {

        const transaction = await getTransactionById(numId)

        if(!transaction){
            res.status(404).json({message: "Transação não encontrada"})
        }

        res.json(transaction);

    } catch (error) {
        console.error("Erro ao buscar transação: ", error)
        res.status(500).json({message: "Erro interno do servidor"})
    }
})

router.post("/transactions", async (req,res)=>{
    try {
        const { title, amount, type, date } = req.body;

        if (!title || !amount || !type || !date){
            res.status(400).json({message: "Todos os campos são obrigatórios"})
            return;
        }

        const formattedType = type.trim().toLowerCase();

        if(formattedType !== "income" && formattedType !== "expense"){
            res.status(400).json({message: "Informe o tipo corretamente: 'income' ou 'expense'"})
            return;
        }

        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[-\/.](0[1-9]|1[0-2])[-\/.](\d{4})$/;
        const match = date.match(dateRegex);
        if(!match){
            res.status(400).json({message: "Formato de data inválido. Use DD/MM/YYYY ou DD-MM-YYYY."})
            return;
        }

        const [, day, month, year ] = match;
        const formattedDate = `${year}-${month}-${day}`;

        const postTransaction = await createTransaction(title,amount,formattedType,formattedDate);


        res.status(201).json({
            message: "Transação salva corretamente no banco.",
            transaction: postTransaction
        });

        return;



    } catch (error) {
        console.error("Erro ao criar transação: ", error);
        res.status(500).json({message: "Erro interno do servidor."});
    }
}) 

router.put("/transactions/:id", async (req,res) => {
    try {
        const { id } = req.params;
        const {title, amount, type, date} = req.body;
        
        const numId = Number(id);
        if(isNaN(numId) || numId <= 0){
            res.status(400).json({message: "ID inválido. "})
            return;
        }

        // Verificação do tipo
        const formattedType = type.trim().toLowerCase();
        if (formattedType !== 'income' && formattedType !== 'expense' ){
            res.status(400).json({message:"Informe o tipoo corretamente"})
        }

        // verificação de dados
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[-\/.](0[1-9]|1[0-2])[-\/.](\d{4})$/;
        const dateMatch = date.match(dateRegex);
        if(!dateMatch){
            res.status(400).json({message: "Formato de data inválido. Use DD/MM/YYYY ou DD-MM-YYYY."})
            return;
        }

        const [, day, month, year ] = dateMatch;
        const formattedDate = `${year}-${month}-${day}`;


        const updatedTransaction = await updateTransaction(numId,title,amount,formattedType,formattedDate);

        res.status(200).json({
            message: "Transação atualizada com sucesso.",
            transaction: updatedTransaction,
        });
        return;
        
    } catch (error) {
        console.error("Error ao atualizar a transação.", error)
        res.status(501)
    }
})

router.delete("/transactions/:id", async (req,res)=>{
    try {
        const { id } = req.params;

        const numId = Number(id);
         
        if(isNaN(numId) || numId <= 0){
            res.status(400).json({message: "ID inválido"})
            return;
        }

        const deletedTask = await deleteTransaction(numId)

        res.status(204);
        return;

    } catch (error) {
        console.error("Error ao atualizar a transação.", error)
        res.status(500).json({ message: "Erro interno do servidor" });
    }

})

export default router;