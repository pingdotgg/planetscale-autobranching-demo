# Automatic branching for PlanetScale x Vercel

This repository shows how we use PlanetScale and Vercel to automatically create a new database branch for every pull request that contains database changes.

## Prerequisites

### Github

The following secrets need to be set in the Github repository:
- `PLANETSCALE_SERVICE_TOKEN_ID` & `PLANETSCALE_SERVICE_TOKEN`: https://planetscale.com/docs/concepts/service-tokens
- `PLANETSCALE_DB` & `PLANETSCALE_ORG`: The name of the PlanetScale organization and database
- `VERCEL_TEAM` & `VERCEL_PROJECT_ID`: Your Vercel team and project ID
- `VERCEL_TOKEN`: An access token for the Vercel REST API

### Local

> This has not been made to be cross-platform friendly. We all use MacOS. Changes will have to be made if you have devs working on Windows.

- Authenticated to the PlanetScale CLI: https://planetscale.com/features/cli
- Some fairly standard command-line tools: `jq`, `tr`
- Credentials for your staging branch in `.env` (or whatever other branch you use for development when there are no schema changes)

## Background

At UploadThing, we currently use the staging database branch as the default development branch. This works until you need to make changes, and want to branch off onto a fresh, new branch. This setup allows for a streamlined process of creating a new database branch and automatically connecting the Vercel preview environment to it. Additionally, a PlanetScale deploy request is automatically created for you to merge before merging your pull request.

## How it works

Locally, all you should ever have to do is run `pnpm dev`. This runs the [dev script](./dev.sh) which checks if you have made any database schema changes. If you have, it will upsert a new database branch connected to the current Git branch. Then, we'll create some PlanetScale credentials and override the `DATABASE_USERNAME` and `DATABASE_PASSWORD` environment variables from your `.env` file with the new credentials. Finally, we'll sync the database schema to the new branch by running `pnpm db:push`, before starting the Next.js development server.

> As noted in the [dev script](./dev.sh), you could tunnel into the database using `pscale connect` to avoid creating new credentials everytime you start the development server. This however doesn't work with `database-js` out of the box.

Later when you push your local changes up to GitHub, the [pscale-open workflow](.github/workflows/pscale-open.yaml) will run and check for schema changes as well. If it finds any, it will upsert a new database branch, create some PlanetScale credentials, and override the `DATABASE_USERNAME` and `DATABASE_PASSWORD` environment variables in the Vercel project for the current git branch (this is a super cool feature of Vercel btw). Then, it will trigger a redeploy so the new environment variables are used and the preview environment is connected to the new database branch.
