import dotenv from "dotenv";
import app from "./app.js";
import pool from "./config/database.js"
import cors from 'cors'

dotenv.config();
app.use(cors({ origin: "*" }));

const PORT = process.env.PORT || 3000;

pool.query(
  "SELECT NOW()", (err, res)=>{
    if(err){
      console.error("Erro ao conectar ao banco de dados:", err)
      process.exit(1);

    } else {

      console.log("Conexão bem-sucedida: ", res.rows[0])

      app.listen(PORT, () => {
          console.log(`Servidor rodando na porta ${PORT}`);
        })
    }
  }
);