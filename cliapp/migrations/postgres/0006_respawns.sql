CREATE TABLE IF NOT EXISTS respawns (
    "id" serial PRIMARY KEY,

    "wid" uuid NULL,
    "aid" character varying(8) NULL,
    "iso" character varying(3),
    "prof" smallint NULL,
    "train_left" smallint NULL
);
