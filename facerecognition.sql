DROP DATABASE IF EXISTS facerecognitionbrain;
CREATE DATABASE facerecognitionbrain;

\c facerecognitionbrain;

DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    id      serial PRIMARY KEY,
    name    VARCHAR(255),
    email   VARCHAR(255) UNIQUE NOT NULL,
    entries INT DEFAULT 0,
    joined  TIMESTAMP           NOT NULL
);

DROP TABLE IF EXISTS login;
CREATE TABLE login
(
    id    serial PRIMARY KEY,
    hash  VARCHAR(255)        NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    FOREIGN KEY (email) REFERENCES users (email)
);

INSERT INTO users (name, email, joined)
VALUES ('John', 'john@gmail.com', NOW()),
       ('Sally', 'sally@gmail.com', NOW()),
       ('Jane', 'jane@gmail.com', NOW());

select *
from users
         join login on users.email = login.email;
