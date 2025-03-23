import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({

    connectionString: process.env.DATABASE_URL,
    // user: process.env.PG_USER,
    // password: process.env.PG_PASSWORD,
    // host: process.env.PG_HOST || "db", // Garante que "db" é o default
    // database: process.env.PG_DATABASE,
    // port: parseInt(process.env.PG_PORT || "5432"), 
});

// Testa a conexão imediatamente ao iniciar
(async () => {
    try {
        const client = await pool.connect();
        console.log("🟢 Banco de Dados conectado com sucesso!");
        client.release();
    } catch (err) {
        console.error("🔴 Erro ao conectar ao banco de dados:", err);
    }
})();

export default pool;
