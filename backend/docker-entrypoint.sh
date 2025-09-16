#!/bin/sh
# Make sure our backend app does not start before db ready
echo "Waiting for database...."

while ! nc -z db 5432; do
  sleep 0.1 # short pause between checks
done
echo "Database started"

# Apply db migrations
npx prisma migrate deploy

echo "Generating Prisma Client"
# Generate prisma client
npx prisma generate

# Start the app
exec "$@"