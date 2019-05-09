CREATE TABLE IF NOT EXISTS areas (
    "id" character(8) PRIMARY KEY,

    "wid" character(36),
    "pid" character(36),
    "iso" character(3),

    "castle" smallint,
    "virgin" smallint
);
