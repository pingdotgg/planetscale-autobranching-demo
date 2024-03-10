source .env.example
PLANETSCALE_DB=$DATABASE_NAME
PLANETSCALE_BRANCH=$(git rev-parse --abbrev-ref HEAD | tr -cd '[:alnum:]-' | tr '[:upper:]' '[:lower:]')
PLANETSCALE_STAGING_BRANCH=preview
SCHEMA_PATH=src/db/schema.ts

if [ -n "$(git diff main -- $SCHEMA_PATH)" ]; then
    echo "Schema changes detected. Connecting to branch..."
    pscale branch show $PLANETSCALE_DB $PLANETSCALE_BRANCH --org $PLANETSCALE_ORG -f json > /dev/null
    exit_code=$?
    if [ $exit_code -ne 0 ]; then
        echo "Branch does not exist. Creating new branch..."
        pscale branch create $PLANETSCALE_DB $PLANETSCALE_BRANCH --org $PLANETSCALE_ORG --from $PLANETSCALE_STAGING_BRANCH --wait > /dev/null
    fi

    # TIP: If you're not using database-js, you can tunnel into the db instead of creating credentials
    #      Maybe you could also be clever and use [ps-http-sim](https://github.com/mattrobenolt/ps-http-sim)
    #      to serve as the HTTP API and connect to the tunneled PlanetScale database.
    # pscale connect $PLANETSCALE_DB $PLANETSCALE_BRANCH --org $PLANETSCALE_ORG

    # Create credentials
    response=$(pscale password create $PLANETSCALE_DB $PLANETSCALE_BRANCH local-$(date +%s) --org $PLANETSCALE_ORG -f json)
    data=$(echo "$response" | tr -d '\n')
    export DATABASE_USERNAME=$(echo "$data" | jq -r '.username')
    export DATABASE_PASSWORD=$(echo "$data" | jq -r '.plain_text')

    pnpm db:push
    pnpm next dev --turbo
else
    echo "No schema changes detected. Starting server with default credentials..."
    pnpm next dev --turbo
fi