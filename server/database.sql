CREATE DATABASE crypto_tracker;

CREATE TABLE users(
    user_id UUID DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE portfolios(
    portfolio_id UUID DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    portfolio_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (portfolio_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE assets(
    asset_id SERIAL,
    portfolio_id UUID NOT NULL,
    asset_coin_id VARCHAR(255) NOT NULL,
    asset_amount NUMERIC NOT NULL,
    initial_price NUMERIC NOT NULL,
    PRIMARY KEY (asset_id),
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(portfolio_id)
);

--insert users
INSERT INTO users (user_email, user_password)
VALUES ('david.rapala@gmail.com', 'gfg7fgdg32');

--insert portfolios
INSERT INTO portfolios (user_id, portfolio_name)
VALUES ('82168349-0e4f-424e-87e3-a163e78deb81', 'Portfolio 1');

--insert assets
INSERT INTO assets (portfolio_id, asset_name, asset_amount)
VALUES (3, 'Bitcoin', 9000);