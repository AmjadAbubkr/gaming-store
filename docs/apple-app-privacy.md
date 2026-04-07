# Apple App Privacy (Nutrition Labels)

Based on the current `gaming-store` codebase, these are the declarations you should
provide in App Store Connect when submitting the iOS version.

## Data linked to you (used for App Functionality)

| Data Type | Collected? | Purpose |
|-----------|-----------|---------|
| Name | Yes | Account profile display |
| Email Address | Yes | Account creation & authentication |
| Phone Number | Yes | WhatsApp checkout & customer support |
| User ID | Yes | Firebase Authentication identifier |
| Purchase History | Yes | Order tracking & fulfillment |

## Data NOT collected

- Location
- Financial info (no in-app payment processing)
- Health & fitness
- Browsing history
- Search history
- Diagnostics / crash logs (Crashlytics not enabled)
- Contacts
- Sensitive info

## Tracking

- **No** — the app does not track users across other companies' apps or websites.

## Third-party SDKs

| SDK | Purpose | Data shared |
|-----|---------|------------|
| Firebase Auth | Authentication | Email, user ID |
| Cloud Firestore | Database | Account data, orders |
| Firebase Storage | File storage | Product images (admin only) |

None of these SDKs are used for advertising or analytics tracking.

## Things to double-check before answering App Store Connect

- If you later add push notifications (`expo-notifications` is installed but may not
  be configured for iOS yet), update the data collection for "Device Token".
- If you add analytics (Firebase Analytics, Mixpanel, etc.), update accordingly.
- If you add crash reporting (Crashlytics), declare "Crash Data" under Diagnostics.
- If you add in-app purchases, declare "Purchase History" under Financial Info.
