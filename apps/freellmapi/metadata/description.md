# FreeLLMAPI

FreeLLMAPI combines free LLM provider tiers and custom OpenAI-compatible endpoints behind one API, with fallback routing and a dashboard for managing provider keys and models.

## Access and security

This is a single-user service. Keep it on a trusted local network and do not expose it to the public internet. Runtipi generates the encryption key used to protect provider credentials; keep the app configuration and data directory together in backups, and do not change that key after adding credentials.

After startup, add provider keys in the dashboard and create a unified API key for clients. Provider availability and free-tier limits are set by each provider and can change.

See the [FreeLLMAPI repository](https://github.com/tashfeenahmed/freellmapi) for documentation and release notes.
