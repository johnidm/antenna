CREATE TABLE IF NOT EXISTS radio_station (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT,
    language TEXT,
    stream_url TEXT,
    homepage_url TEXT,
    logo_url TEXT,
    tags TEXT[]
);
