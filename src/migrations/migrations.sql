CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('income','expense')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);