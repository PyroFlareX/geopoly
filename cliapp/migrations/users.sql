CREATE TABLE IF NOT EXISTS users (
    "uid" character varying PRIMARY KEY,
    --"created_at" timestamp NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),

    "mid" character varying NULL,
    "iso" character varying(5) NULL,
    "username" character varying(32) NULL,

    "email" character varying(40) NULL,
    "salt" character varying(128) NULL,
    "token" character varying(128) NULL,
    "password" character varying(128) NULL
);
