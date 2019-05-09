CREATE TABLE IF NOT EXISTS areas (
    "id" character(8) PRIMARY KEY,

    "wid" uuid, --REFERENCES worlds(wid),
    "pid" uuid, --REFERENCES users(pid),
    "iso" character(3),

    "castle" smallint,
    "virgin" smallint
);
