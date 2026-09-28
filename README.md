# Interactive Holiday Gift Guide — Legacy Portfolio Reconstruction

A sanitized, modernized portfolio reconstruction of a custom interactive gift-guide application originally developed for a client.

The original project allowed visitors to browse a large promotional-product catalog, add products to a favorites list, review their selections, and email that list to another person. It combined front-end catalog interactions with a PHP-based email workflow.

> **Portfolio note:** This repository is intentionally not a byte-for-byte publication of the original production code or client catalog. Client assets, personal information, production domains, historical product data, and obsolete third-party dependencies have been removed or replaced.

## What the original project did

- Presented a large catalog of promotional products with brand, product name, SKU, image, and price data.
- Allowed users to add and remove products from a favorites list.
- Used JavaScript to manage the selected items and prepare checkout/form data.
- Accepted sender, reply-to, and recipient information.
- Used PHP to construct an HTML email containing the selected products and send the favorites list.
- Included asynchronous form handling for other site interactions.

## What this repository demonstrates

This version preserves the core business workflow while making the code safer and easier to evaluate as a portfolio sample:

- **Vanilla JavaScript** instead of the original jQuery/simpleCart.js dependency chain.
- **Responsive HTML/CSS** with semantic markup and basic accessibility considerations.
- **JSON-based POST requests** between the browser and PHP.
- **Server-side validation** of names, email addresses, item counts, and product IDs.
- **Output escaping** before user-controlled values are placed into HTML.
- **Server-owned product data** so prices and product details are not trusted from the browser.
- **No production email delivery** in the public demo. The PHP endpoint generates an email preview only, preventing the repository from becoming an open mail relay.
- **Fictional sample catalog data** instead of publishing historical client product content or imagery.

## Technology

- HTML5
- CSS3
- JavaScript (ES6+)
- PHP 8+
- Fetch API / JSON

## Project structure

```text
.
├── index.html
├── assets/
│   ├── css/
│   │   └── app.css
│   └── js/
│       └── app.js
├── server/
│   └── preview.php
├── .gitignore
├── SECURITY.md
└── README.md
```

## Running locally

PHP's built-in development server is enough to run the sample:

```bash
php -S localhost:8000
```

Then open `http://localhost:8000` in a browser.

The application does **not** send email. Submitting the form calls `server/preview.php`, which validates the request and returns the generated HTML email as a preview.

## Original vs. portfolio version

The original implementation was built with the conventions and dependencies available at the time, including jQuery, simpleCart.js, Colorbox, PHP's `mail()` function, and a large static product catalog. This repository is a portfolio-oriented reconstruction rather than an attempt to present legacy code as a current production architecture.

The modernization focused on the areas that matter most when evaluating the work today: input validation, output escaping, dependency reduction, separation of client/sample data, safer server behavior, responsive presentation, and clearer code organization.

## Security and privacy changes

The public version removes or avoids:

- Personal email addresses and other personal identifiers.
- Production sender addresses and domains.
- Original client product images and the full historical catalog.
- Direct use of user input in email headers or HTML.
- GET requests for form submissions containing personal information.
- Client-supplied prices or arbitrary product metadata.
- Publicly callable email-delivery functionality.

See [SECURITY.md](SECURITY.md) for additional notes.

## Authorship and third-party code

The original production project used third-party libraries, including simpleCart.js and Colorbox. Those libraries are **not included in this reconstruction**. The portfolio version replaces their relevant behavior with project-specific JavaScript so the repository more clearly shows the custom application workflow.

## Historical context

This project is included to demonstrate custom web-development work completed outside of a CMS: translating a client requirement into an interactive product-selection workflow spanning the browser, application state, form processing, and server-side output generation.

## License

No open-source license is granted by this repository. The code is published as a portfolio sample. Original client trademarks, product data, imagery, and other client-owned materials are not included.
