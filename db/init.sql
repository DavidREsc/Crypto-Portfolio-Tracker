CREATE DATABASE crypto_portfolio_tracker;
\c crypto_portfolio_tracker;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
    user_id UUID DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT 'f',
    PRIMARY KEY (user_id)
);

CREATE TABLE portfolios(
    portfolio_id UUID DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    portfolio_name VARCHAR(255) NOT NULL,
    main BOOLEAN NOT NULL,
    PRIMARY KEY (portfolio_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE assets(
    asset_id SERIAL,
    portfolio_id UUID NOT NULL,
    asset_coin_id VARCHAR(255) NOT NULL,
    asset_amount DOUBLE PRECISION NOT NULL,
    initial_price DOUBLE PRECISION NOT NULL,
    PRIMARY KEY (asset_id),
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(portfolio_id)
);