# S4M Runtipi Store

Custom Runtipi apps maintained by Stuff4Mzansi.

Add `https://github.com/Stuff4Mzansi/s4m-runtipi-store` under **Settings ? App Stores ? Add App Store** in Runtipi. After store updates are published, use **Update App Stores** to refresh the catalogue.

## Apps

- **Whoami:** a small HTTP diagnostic service.
- **Moola:** financial planning for individuals and households, including budgets, subscriptions, debt, savings, net worth, and reminders.

## Moola release preparation

The Moola entry targets `ghcr.io/stuff4mzansi/moola:1.0.0`. It is marked `available: false` until the image is publicly pullable and its Runtipi installation has been verified.

1. Push the intended Moola application release to `Stuff4Mzansi/moola`.
2. Run its **Docker** GitHub Actions workflow with **publish** enabled and version `1.0.0`. The workflow runs container smoke tests before publishing amd64 and arm64 images.
3. Set the GHCR package visibility to public and verify an unauthenticated pull of `ghcr.io/stuff4mzansi/moola:1.0.0`.
4. Test first-admin setup, restart persistence, reminders, and backup/restore on Runtipi; verify ARM installation on ARM hardware before advertising it as tested.
5. Set `apps/moola/config.json` to `available: true`, update its `updated_at`, run the store tests, and publish the store changes.

For later releases, update the pinned image tag and app version together, increment `tipi_version`, and update `updated_at`. Preserve the app data directory during upgrades.

## App structure

Each `apps/<id>/` directory contains `config.json`, `docker-compose.yml`, and `metadata/description.md` plus a square `metadata/logo.jpg`. Compose files use schema-v2 `x-runtipi` routing metadata. Legacy JSON compose files remain supported by the tests.

## Validation

Use a current Bun 1.3 release or newer to read the committed binary lockfile. The template declares an older Bun package that cannot read that lockfile.

```sh
bun install --frozen-lockfile
bun test
```

See the [Runtipi custom store guide](https://runtipi.io/docs/guides/create-your-own-app-store) and [dynamic compose reference](https://runtipi.io/docs/reference/dynamic-compose).
