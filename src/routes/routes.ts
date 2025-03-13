import { Router } from "express";
import { calculateTotal, calculateTotalExpenses, calculateTotalIncomes, createTransaction, deleteTransaction, getTransactionById, getTransactions, updateTransaction } from "../models/transactionModel.js";


const router = Router();


router.get("/", async (req, res) => {
    res.send("API Funcionando com rotas separadas!");
});

// ROTAS
router.get("/transactions", async (req, res) => {
    try {
        
        const { startDate, endDate } = req.query;
        let { orderBy } = req.query;
        
        const urlDateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        if ((startDate && !urlDateRegex.test(startDate as string)) || (endDate && !urlDateRegex.test(endDate as string))) {
            res.status(400).json({ message: "Formato de data inválido. Use YYYY-MM-DD." });
            return;
        }
        
        let validOrderBy = 'ASC';
        orderBy = String(orderBy);
        if(orderBy.trim().toUpperCase() === 'ASC' || orderBy.trim().toUpperCase() === 'DESC'){
            validOrderBy = orderBy.trim().toUpperCase();
        } else {
            validOrderBy = 'ASC'
        }
        
        const transactions = await getTransactions(startDate as string | undefined, endDate as string | undefined, validOrderBy);
        if(transactions.length === 0){
            res.json([])
        }
        
        res.json(transactions)
        
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar transações" });
        return;
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
            return;
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

        const dateRegex = /^\d{4}[-.\/|\\](0[1-9]|1[0-2])[-.\/|\\](0[1-9]|[12]\d|3[01])$/;
        if(!dateRegex.test(date)){
            res.status(400).json({message: "Formato de data inválido. Use YYYY-MM-DD."})
            return;
        }

        const normalizedDate = date.replace(/[-.\/|\\]/g, "-");

        const postTransaction = await createTransaction(title,amount,formattedType,normalizedDate);


        res.status(201).json({
            message: "Transação salva corretamente no banco.",
            transaction: postTransaction
        });

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
            res.status(400).json({message:"O tipo deve ser 'income' ou 'expense'."})
            return;
        }

        // verificação de data
        const dateRegex = /^\d{4}[-.\/|\\](0[1-9]|1[0-2])[-.\/|\\](0[1-9]|[12]\d|3[01])$/;
        if(!dateRegex.test(date)){
            res.status(400).json({message: "Formato de data inválido. Use YYYY-MM-DD"});
            return;
        }

        const normalizedDate = date.replace(/[-.\/|\\]/g, "-");

        const updatedTransaction = await updateTransaction(numId,title,amount,formattedType,normalizedDate);

        res.status(200).json({
            message: "Transação atualizada com sucesso.",
            transaction: updatedTransaction,
        });

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

router.get("/dashboard", async (req, res) => {

    let { startDate, endDate } = req.query;
    
    if(startDate){
        startDate = String(startDate)
        startDate = startDate.replace(/[-.\/|\\]/g, "-");
    }

    if(endDate){
        endDate = String(endDate)
        endDate =endDate.replace(/[-.\/|\\]/g, "-");
    }

    const urlDateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if ((startDate && !urlDateRegex.test(startDate as string)) || (endDate && !urlDateRegex.test(endDate as string))) {
        res.status(400).json({ message: "Formato de data inválido. Use YYYY-MM-DD." });
        return;
    }



    const total = await calculateTotal(startDate, endDate);
    const totalIncomes = await calculateTotalIncomes(startDate, endDate);
    const totalExpenses = await calculateTotalExpenses(startDate,endDate);
    res.json({total,totalIncomes,totalExpenses});
});



export default router;