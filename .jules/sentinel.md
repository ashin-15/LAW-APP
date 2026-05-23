## 2025-03-05 - Privilege Escalation via Direct Object Creation
**Vulnerability:** In `firestore.rules`, the `allow create` rule for `/laws/{lawId}` only checked if the user was authenticated. This allowed any user to create a law with `status: 'approved'`, bypassing the admin verification workflow and escalating their privileges.
**Learning:** Security rules must explicitly validate default data states (e.g., `status == 'pending'`) during document creation, not just verify authentication or role.
**Prevention:** Always validate the data payload (`request.resource.data`) for restricted fields during `allow create` conditions to prevent users from bypassing expected workflows or role-based access controls.

## 2025-03-05 - Stored XSS via Insecure URIs in User-Provided URLs
**Vulnerability:** User-provided URLs (like `pdfUrl`) were retrieved from Firestore and directly rendered into `href` attributes without validation, allowing potential Stored XSS attacks via `javascript:` or `data:` URIs if a malicious actor manipulated the data directly in Firestore.
**Learning:** Never trust data from the database blindly, especially URLs intended for `href` attributes, as data can be tampered with outside the application UI. Always sanitize retrieved URLs before rendering.
**Prevention:** Implement strict URL sanitization functions that parse the URL and enforce safe protocols (e.g., `http:` and `https:`) while rejecting dangerous ones before mapping data to UI models.
