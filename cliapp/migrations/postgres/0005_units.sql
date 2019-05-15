CREATE TABLE IF NOT EXISTS units (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "created_at" timestamp NULL DEFAULT (now() AT TIME ZONE 'UTC'),

    "wid" uuid REFERENCES worlds(wid),
    "pid" uuid, --REFERENCES users(pid),
    "aid" character varying(8), --REFERENCES areas(id),
    "iso" character varying(5), --REFERENCES countries(iso),

    "prof" smallint NULL,
    "skin" smallint NULL,

    "age" smallint NULL,
    "name" character varying(30) NULL,
    "img_vector" json NOT NULL,

    "move_left" smallint NULL,
    "health" smallint NULL,
    "xp" smallint NULL,

    "last_action" timestamp
);
