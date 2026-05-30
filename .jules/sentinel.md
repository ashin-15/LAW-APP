## 2025-03-05 - Privilege Escalation via Direct Object Creation
**Vulnerability:** In `firestore.rules`, the `allow create` rule for `/laws/{lawId}` only checked if the user was authenticated. This allowed any user to create a law with `status: 'approved'`, bypassing the admin verification workflow and escalating their privileges.
**Learning:** Security rules must explicitly validate default data states (e.g., `status == 'pending'`) during document creation, not just verify authentication or role.
**Prevention:** Always validate the data payload (`request.resource.data`) for restricted fields during `allow create` conditions to prevent users from bypassing expected workflows or role-based access controls.
## 2025-02-28 - URL Parsing Resiliency for XSS Prevention
**Vulnerability:** Weak XSS prevention in document mapping. Unsanitized `pdfUrl` input could permit `javascript:` or `data:` URIs, leading to Stored XSS.
**Learning:** When using `new URL()` to sanitize URLs by checking protocol, failing to provide a fallback base URL (e.g. `new URL(url, 'http://dummy.com')`) causes the constructor to throw on relative paths. This strips out valid relative paths and could inadvertently break functionality if the system supports relative URLs.
**Prevention:** Always provide a base URL when validating potentially relative paths via `new URL()` to avoid throwing uncaught TypeErrors during input sanitization.
