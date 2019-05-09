CREATE TABLE IF NOT EXISTS units (
    "id" character(36),
    "created_at" timestamp,

    "wid" character(36),
    "pid" character(36),
    "aid" character(8),

    "age" smallint NULL,
    "prof" smallint NULL,
    "skin" smallint NULL,
    "xp" smallint NULL,

    "name" character varying(30) NULL,
    "img_vector" character varying(256) NOT NULL,

    "last_action" timestamp
);
