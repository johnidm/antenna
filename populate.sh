#!/bin/bash

echo "Extracting up to 1000 rows from stations.json to generate INSERT statements..."

cat << 'EOF' > transform.jq
def escape_sql:
  if type == "string" then gsub("'"; "''") else "" end;

def trim:
  if type == "string" then sub("^\\s+"; "") | sub("\\s+$"; "") else "" end;

.[0:1000] | .[] | 
"INSERT INTO radio_station (name, country, language, stream_url, homepage_url, logo_url, tags) VALUES (" +
"'" + (.name | trim | escape_sql) + "', " +
"'" + (.country | escape_sql) + "', " +
"'" + (.language | escape_sql) + "', " +
"'" + (.url | escape_sql) + "', " +
"'" + (.homepage | escape_sql) + "', " +
"'" + (.favicon | escape_sql) + "', " +
"string_to_array(nullif('" + (.tags | escape_sql) + "', ''), ',')" +
");"
EOF

jq -r -f transform.jq stations.json > populate.sql

echo "Checking the first few generated inserts:"
head -n 2 populate.sql

echo "Inserting data into PostgreSQL container..."
# Run the generated SQL script inside the docker container
# Make sure the container_name, user, and db match docker-compose.yml
docker exec -i antenna_db psql -U postgres -d antenna -q < populate.sql

echo "Cleaning up temporary files..."
rm transform.jq populate.sql

echo "Done! The database has been populated."
