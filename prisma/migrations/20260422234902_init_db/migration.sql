-- CreateTable
CREATE TABLE "radio_station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "country_code" TEXT,
    "language" TEXT,
    "stream_url" TEXT,
    "homepage_url" TEXT,
    "logo_url" TEXT,
    "tags" TEXT[],

    CONSTRAINT "radio_station_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "radio_station_stream_url_key" ON "radio_station"("stream_url");

-- CreateIndex
CREATE INDEX "radio_station_country_idx" ON "radio_station"("country");

-- CreateIndex
CREATE INDEX "radio_station_language_idx" ON "radio_station"("language");

-- CreateIndex
CREATE INDEX "radio_station_name_idx" ON "radio_station"("name");

-- CreateIndex
CREATE INDEX "radio_station_tags_idx" ON "radio_station" USING GIN ("tags");
