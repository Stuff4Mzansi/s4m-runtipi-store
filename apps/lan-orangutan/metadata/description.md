# LAN Orangutan

LAN Orangutan discovers devices on your local networks and helps you label them, track changes, and export network reports. Use it only on networks you own or are authorized to manage.

## First start and access

LAN Orangutan requires Linux host networking to discover the server's real network. Open `http://<server-ip>:291` from your local network and create a password on first start. The dashboard has no built-in HTTPS, and Runtipi proxy exposure is disabled because this app uses host networking. Restrict access to trusted devices or put it behind an appropriately secured HTTPS reverse proxy.

Tailscale integration requires Tailscale installed on the host and is not available in this container setup.

## Storage

Device data, settings, and the password hash are persisted in the app data directory's `data` folder. Back up this folder to preserve your installation.

See the [LAN Orangutan repository](https://github.com/291-Group/LAN-Orangutan) for documentation and release notes.
