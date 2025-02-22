import express from 'express';
import { AppDataSource } from './Config/data-source';
import "reflect-metadata";
import transactionRoute from "./Routes/transactionRoutes";


// Conexão com o banco de dados Postgres
AppDataSource.initialize().then(()=>{
    console.log("Banco de dados conectado com sucesso!")
}).catch((error)=>{
    console.error("Erro ao conectar ao banco: ", error);
})

// Inicialização do servidor express e da porta de acesso:
const app = express();
const port = process.env.PORT || 5000

app.use(express.json());


app.use('/api', transactionRoute);


app.listen(port, ()=> {
    console.log(`Servidor rodando na porta ${port}`)    
})