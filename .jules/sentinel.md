## 2025-03-05 - Privilege Escalation via Direct Object Creation
**Vulnerability:** In `firestore.rules`, the `allow create` rule for `/laws/{lawId}` only checked if the user was authenticated. This allowed any user to create a law with `status: 'approved'`, bypassing the admin verification workflow and escalating their privileges.
**Learning:** Security rules must explicitly validate default data states (e.g., `status == 'pending'`) during document creation, not just verify authentication or role.
**Prevention:** Always validate the data payload (`request.resource.data`) for restricted fields during `allow create` conditions to prevent users from bypassing expected workflows or role-based access controls.
## 2025-03-05 - Stored XSS via Malicious PDF URLs
**Vulnerability:** User-provided URLs from Firestore, such as `pdfUrl`, were being retrieved and rendered directly into `href` attributes in the UI without validation. This could allow an attacker to craft a malicious payload using `javascript:` or `data:` URIs, leading to a Stored XSS vulnerability when a victim clicks the link.
**Learning:** Any user-provided URL loaded from a database that is ultimately rendered into an interactive context (like an anchor tag's `href`) must be strictly sanitized to ensure it uses safe protocols.
**Prevention:** Always validate and sanitize URLs at the data extraction layer (e.g., in converter functions before passing the data to React components). Use the `URL` constructor with a fallback base URL to cleanly parse and enforce allowed protocols (`http:`, `https:`).
