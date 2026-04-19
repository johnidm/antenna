#!/bin/sh
set -e

echo "Running Prisma migrations..."
node_modules/.bin/prisma migrate deploy

echo "Starting Antenna server..."
exec node .output/server/index.mjs
