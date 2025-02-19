import express from 'express';


const app = express();

const port = process.env.PORT || 5000

app.use(express.json());

app.get('/', (req,res)=>{
    res.status(200).send(`Hello World`)
})


app.listen(port, ()=> {
    console.log(`Servidor rodando na porta ${port}`)    
})