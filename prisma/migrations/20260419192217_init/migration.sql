-- CreateTable
CREATE TABLE "radio_station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "language" TEXT,
    "stream_url" TEXT,
    "homepage_url" TEXT,
    "logo_url" TEXT,
    "tags" TEXT[],

    CONSTRAINT "radio_station_pkey" PRIMARY KEY ("id")
);
