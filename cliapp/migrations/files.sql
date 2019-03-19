CREATE TABLE IF NOT EXISTS files (
    "fid" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "uid" uuid,-- REFERENCES userspaces(uid),
    "sid" smallint REFERENCES servers(sid),

    "path" character varying(256) NOT NULL,
    "vpath" character varying(256) NOT NULL,
    "descr" character varying(128),
    "checksum" character varying(40),
    "size" integer,
    "mime" character varying(64),

    "last_action" timestamp,
    "created_at" timestamp DEFAULT (now() AT TIME ZONE 'UTC'),
    "delete_at" timestamp,

    "downloads" int default 0,

    "iv" character varying(40),
    "shards" smallint
);
