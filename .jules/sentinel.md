## 2025-03-05 - Privilege Escalation via Direct Object Creation
**Vulnerability:** In `firestore.rules`, the `allow create` rule for `/laws/{lawId}` only checked if the user was authenticated. This allowed any user to create a law with `status: 'approved'`, bypassing the admin verification workflow and escalating their privileges.
**Learning:** Security rules must explicitly validate default data states (e.g., `status == 'pending'`) during document creation, not just verify authentication or role.
**Prevention:** Always validate the data payload (`request.resource.data`) for restricted fields during `allow create` conditions to prevent users from bypassing expected workflows or role-based access controls.

## 2025-05-29 - Stored XSS via Malicious pdfUrl
**Vulnerability:** Unsanitized `pdfUrl` values fetched from Firestore and rendered directly in user interfaces could allow Stored XSS if they contain `javascript:` or `data:` URIs.
**Learning:** External URLs stored in the database must be strictly validated during extraction to ensure they use safe protocols before being passed to UI components.
**Prevention:** Implement a sanitizeUrl helper function that validates the URL protocol (`http:` or `https:`) whenever data containing URLs is read from the database, dropping invalid or unsafe entries.
