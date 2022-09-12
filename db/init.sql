CREATE DATABASE crypto_portfolio_tracker;
\c crypto_portfolio_tracker;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
    user_id UUID DEFAULT uuid_generate_v4(),
    user_email VARCHAR NOT NULL UNIQUE,
    user_password VARCHAR NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT 'f',
    PRIMARY KEY (user_id)
);

CREATE TABLE portfolios(
    portfolio_id UUID DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    portfolio_name VARCHAR(24) NOT NULL,
    main BOOLEAN NOT NULL DEFAULT 'f',
    PRIMARY KEY (portfolio_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TYPE TRANSACTION AS ENUM ('buy', 'sell');
CREATE TABLE transactions(
    transaction_id BIGSERIAL,
    portfolio_id UUID NOT NULL,
    asset_id VARCHAR NOT NULL,
    asset_amount DOUBLE PRECISION NOT NULL,
    initial_price DOUBLE PRECISION NOT NULL,
    transaction_type TRANSACTION NOT NULL,
    transaction_date TIMESTAMP NOT NULL,
    PRIMARY KEY (transaction_id),
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(portfolio_id)
);

CREATE TABLE jwt_blacklist (
    jwt_id BIGSERIAL,
    jwt VARCHAR NOT NULL
);