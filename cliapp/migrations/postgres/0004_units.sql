CREATE TABLE IF NOT EXISTS units (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "created_at" timestamp NULL DEFAULT (now() AT TIME ZONE 'UTC'),

    "wid" uuid, --REFERENCES worlds(wid),
    "pid" uuid, --REFERENCES users(pid),
    "aid" character varying(8), --REFERENCES areas(id),

    "age" smallint NULL,
    "prof" smallint NULL,
    "skin" smallint NULL,
    "xp" smallint NULL,

    "name" character varying(30) NULL,
    "img_vector" json NOT NULL,

    "last_action" timestamp
);
