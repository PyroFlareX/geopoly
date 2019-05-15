CREATE OR REPLACE FUNCTION map_retraining(prof smallint)
   RETURNS smallint AS
$$
DECLARE
   reti smallint;
BEGIN
    CASE
        WHEN prof = 0 THEN
        -- FOOT
            reti := 1
        WHEN prof = 1 THEN
        -- PIKE
            reti := 1
        WHEN prof = 2 THEN
        -- LIGHTCAV
            reti := 1
        WHEN prof = 3 THEN
        -- KNIGHT
            reti := 1
        WHEN prof = 4 THEN
        -- ARCHER
            reti := 1
        WHEN prof = 5 THEN
        -- CATA
            reti := 1
        WHEN prof = 6 THEN
        -- BARD
            reti := 1
        WHEN prof = 7 THEN
        -- BARBAR
            reti := 1
        WHEN prof = 8 THEN
        -- THUG
            reti := 1
        WHEN prof = 9 THEN
        -- STRONG
            reti := 1
        WHEN prof = 10 THEN
        -- HERO
            reti := 1
        WHEN prof = 11 THEN
        -- DEFENDER
            reti := 1
        reti := 1
        ELSE
            reti := 0
    END CASE;

   RETURN reti;
END;
$$
LANGUAGE 'plpgsql' IMMUTABLE;