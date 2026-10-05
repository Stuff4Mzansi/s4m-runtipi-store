# Moola

Moola helps individuals and households understand their finances and plan ahead.

- **Budgets:** custom periods, spending categories and optional groups, recurring expenses, and budget-versus-spending analytics.
- **Subscriptions:** track renewals, costs, and spending trends.
- **Debt:** track balances and repayments, with interest estimates.
- **Savings and net worth:** manage savings goals, assets, liabilities, and liquidity insights.
- **Reminders:** in-app alerts and optional email reminders for subscriptions, recurring expenses, and budget limits.

## First start

Open Moola and create the first super administrator through the web UI. There are no default credentials. Administrators can add household members and assign roles. Complete initial setup before exposing the app publicly.

The app sets its address and timezone from Runtipi automatically. Administrators can configure SMTP under **Settings** and send a test email. Members enable email reminders for each budget under **Notifications**. The scheduler runs inside the container automatically.

## Storage and backups

The installation uses SQLite and one app container. The database, encryption key, files, and backups are persisted in the app data directory's `data` folder. Preserve this folder when upgrading. The encryption key is required to read encrypted credentials and restore the installation.

Use Runtipi's backup tools with the app stopped for a consistent filesystem backup. Moola also provides `php artisan moola:backup --no-interaction` inside the container and automatically backs up SQLite before pending migrations.

See the [Moola repository](https://github.com/Stuff4Mzansi/moola) for backup and recovery instructions.
