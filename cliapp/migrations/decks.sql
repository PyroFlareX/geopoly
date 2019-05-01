CREATE TABLE IF NOT EXISTS decks (
    "did" INTEGER PRIMARY KEY AUTOINCREMENT,
    "uid" character varying(128) NULL,
    "name" character varying(30) NULL,

    "inf_light" int,
    "inf_home" int,
    "inf_heavy" int,
    "inf_skirmish" int,
    "cav_lancer" int,
    "cav_hussar" int,
    "cav_dragoon" int,
    "cav_heavy" int,
    "art_light" int,
    "art_heavy" int,
    "art_mortar" int
);
