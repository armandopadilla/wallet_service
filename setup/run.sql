# Create Table
create table wallets (
  id int(11) AUTO_INCREMENT PRIMARY KEY,
  userId int(11) NOT NULL,
  type enum('btc', 'eth', 'bch', 'ltc'),
  balance decimal(15, 2) DEFAULT 0.00,
  createdDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_wallet` (`userId`, `type`)
);

# Create MySQL User
CREATE USER 'dev'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'dev'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
