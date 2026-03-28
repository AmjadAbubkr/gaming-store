# Google Play Data Safety Notes

Based on the current `gaming-store` codebase, these are the declarations you should review in Play Console before submission.

## Data collected

- Name
- Email address
- Phone number
- User ID / account identifier
- Purchase history / orders

## Why it is collected

- App functionality
- Account management
- Customer support
- Order processing and fulfillment

## Data sharing

- No direct third-party advertising or analytics sharing was found in the current app code.
- WhatsApp checkout is user-initiated, so order handoff can involve WhatsApp when the user explicitly taps the checkout action.

## Security

- Firebase Authentication and Firestore are used for account and order storage.
- Data is transmitted over encrypted connections.

## Deletion support

- In-app deletion request flow is available from the customer home screen.
- External deletion page:
  - `https://amjadabubkr.github.io/gaming-store/account-deletion.html`

## Things to double-check before answering Play Console

- If you later enable push notifications, analytics, ads, crash reporting, location, or contacts access, update the declarations.
- If you add direct file upload for customer content, update the collected data categories.
- If you change the deletion process from request-based to immediate deletion, update the account deletion description.
