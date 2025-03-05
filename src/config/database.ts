import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
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
