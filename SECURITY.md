# Security Notes

This repository is a portfolio sample and is not intended to be deployed unchanged as a production email application.

## Intentional safeguards

- Email delivery is disabled. The server returns a preview rather than calling `mail()` or an external email service.
- Requests must use POST with JSON.
- Email addresses are validated server-side.
- User-controlled strings are escaped before inclusion in generated HTML.
- Submitted product metadata is not trusted. The server accepts product IDs and resolves authoritative product details from its own allowlist.
- Item counts are bounded.
- Responses use JSON and include `X-Content-Type-Options: nosniff`.

## Production considerations

A production implementation should additionally use an authenticated/authorized transactional email service, CSRF protection where appropriate, rate limiting, bot/abuse controls, centralized logging, environment-based configuration, a Content Security Policy, HTTPS-only deployment, and automated dependency/security scanning.

Do not add API keys, SMTP passwords, production email addresses, customer information, or other secrets to this repository. Use environment variables or a managed secret store for production credentials.
