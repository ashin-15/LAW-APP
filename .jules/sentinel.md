## 2025-03-05 - Privilege Escalation via Direct Object Creation
**Vulnerability:** In `firestore.rules`, the `allow create` rule for `/laws/{lawId}` only checked if the user was authenticated. This allowed any user to create a law with `status: 'approved'`, bypassing the admin verification workflow and escalating their privileges.
**Learning:** Security rules must explicitly validate default data states (e.g., `status == 'pending'`) during document creation, not just verify authentication or role.
**Prevention:** Always validate the data payload (`request.resource.data`) for restricted fields during `allow create` conditions to prevent users from bypassing expected workflows or role-based access controls.

## 2025-03-05 - Stored XSS via Malicious Data URIs
**Vulnerability:** The application was retrieving user-uploaded URLs from Firestore (e.g. `pdfUrl` in the `laws` collection) and rendering them directly into `href` attributes without sanitization. This allows an attacker to create documents with `javascript:` or `data:` URIs, leading to a Stored Cross-Site Scripting (XSS) vulnerability.
**Learning:** React's built-in protections against XSS do not apply to `href` values. Malicious strings like `javascript:alert(1)` will be blindly rendered and executed when clicked.
**Prevention:** Always sanitize user-provided URLs when fetching data from the database. Ensure URLs explicitly begin with secure protocols like `http://` or `https://` before sending them to the UI layer.
