## 2025-03-05 - Privilege Escalation via Direct Object Creation
**Vulnerability:** In `firestore.rules`, the `allow create` rule for `/laws/{lawId}` only checked if the user was authenticated. This allowed any user to create a law with `status: 'approved'`, bypassing the admin verification workflow and escalating their privileges.
**Learning:** Security rules must explicitly validate default data states (e.g., `status == 'pending'`) during document creation, not just verify authentication or role.
**Prevention:** Always validate the data payload (`request.resource.data`) for restricted fields during `allow create` conditions to prevent users from bypassing expected workflows or role-based access controls.

## 2025-03-05 - Stored XSS via Malicious URIs in Firestore Documents
**Vulnerability:** URLs fetched from Firestore (such as `pdfUrl` in `firestoreLawToVerifiedLaw`) were not sanitized before being rendered in the React application. This allowed for Stored Cross-Site Scripting (XSS) if a malicious user uploaded a document with a `javascript:` or `data:` URI in the `pdfUrl` field.
**Learning:** Even though data comes from the database, it must be validated and sanitized to ensure safe protocols (`http:`/`https:`) before being processed or displayed. React's protections do not prevent XSS when using `href` attributes with `javascript:` URIs.
**Prevention:** Always validate and sanitize URLs at the data extraction layer (e.g., converter functions) before the data reaches UI components, ensuring only secure protocols are allowed.
