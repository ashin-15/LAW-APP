## 2025-03-05 - Privilege Escalation via Direct Object Creation
**Vulnerability:** In `firestore.rules`, the `allow create` rule for `/laws/{lawId}` only checked if the user was authenticated. This allowed any user to create a law with `status: 'approved'`, bypassing the admin verification workflow and escalating their privileges.
**Learning:** Security rules must explicitly validate default data states (e.g., `status == 'pending'`) during document creation, not just verify authentication or role.
**Prevention:** Always validate the data payload (`request.resource.data`) for restricted fields during `allow create` conditions to prevent users from bypassing expected workflows or role-based access controls.

## 2025-03-05 - Stored XSS via Malicious pdfUrl
**Vulnerability:** The `pdfUrl` field on law documents was being read directly from Firestore and passed unvalidated to `href` attributes in `src/components/RepositoryView.tsx` and `UploadView.tsx` and `AdminView.tsx`. An attacker could inject a `javascript:` or `data:` URL as the `pdfUrl`, leading to Stored XSS when users clicked on "View PDF" links.
**Learning:** Any user-provided URL loaded from the database and rendered in an anchor tag (`<a href="...">`) is a potential XSS vector if not restricted to secure protocols.
**Prevention:** Always parse and validate URLs retrieved from the database. Enforce safe protocols (e.g., `http:`, `https:`) before rendering them in the UI, or sanitize them centrally at the data extraction layer (e.g., `firestoreLawToVerifiedLaw`) so the UI receives only safe URLs or `undefined`.
