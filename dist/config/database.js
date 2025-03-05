import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pkg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
pool.on("connect", () => {
    console.log("Banco de Dados conectado com sucesso");
});
export default pool;
