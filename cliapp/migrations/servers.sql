CREATE TABLE IF NOT EXISTS servers (
    "fid" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "uid" uuid,-- REFERENCES userspaces(uid),
    "sid" smallint REFERENCES servers(sid),

    "sid" serial PRIMARY KEY,
    "name" character varying(20) NOT NULL,
    "type" smallint NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
    "email" character varying(40) NOT NULL,
    "address" character varying(128) NOT NULL,
    "credentials" json NOT NULL,
    "storage_left" integer DEFAULT 0
);
