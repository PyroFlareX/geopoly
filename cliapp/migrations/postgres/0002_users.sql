CREATE TABLE IF NOT EXISTS users (
    "uid" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "created_at" timestamp NULL DEFAULT (now() AT TIME ZONE 'UTC'),

    "wid" uuid NULL,
    "iso" character varying(5) NULL,

    "username" character varying(32) NULL,
    "email" character varying(40) NOT NULL,
    "salt" character varying(128) NOT NULL,
    "token" character varying(128) NOT NULL,
    "password" character varying(128) NOT NULL
);
