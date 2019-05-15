CREATE TABLE IF NOT EXISTS areas (
    "id" character varying(8),
    "wid" uuid REFERENCES worlds(wid),

    "pid" uuid, --REFERENCES users(pid),
    "iso" character varying(3),

    "castle" smallint,
    "virgin" smallint,

    "training" smallint,
    "train_left" smallint,

    PRIMARY KEY (id, wid)
);
