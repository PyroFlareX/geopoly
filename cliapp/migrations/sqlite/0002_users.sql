CREATE TABLE IF NOT EXISTS users (
    "uid" character(36) PRIMARY KEY,
    "created_at" timestamp,

    "wid" character(36),
    "iso" character(5),

    "username" character varying(32) NULL,
    "email" character varying(40) NOT NULL,
    "salt" character varying(128) NOT NULL,
    "token" character varying(128) NOT NULL,
    "password" character varying(128) NOT NULL
);
