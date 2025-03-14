import fs from "fs";
import path from "path";
import pool from "../config/database.js"

async function runMigration(){
    const migrationSQL = `
        CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        type VARCHAR(10) CHECK (type IN ('income','expense')) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        date DATE NOT NULL
);`

    try {
        console.log("📦 Aplicando migrações...");
        await pool.query(migrationSQL);
        console.log("✅ Migrações aplicadas com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao rodar migrações:", error);
        process.exit(1);
    }
}

runMigration();

export default runMigration;