CREATE TABLE IF NOT EXISTS worlds (
    "wid" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "created_at" timestamp NULL DEFAULT (now() AT TIME ZONE 'UTC'),

    "max_players" smallint,
    "turn_time" smallint,
    "turns" smallint
);
