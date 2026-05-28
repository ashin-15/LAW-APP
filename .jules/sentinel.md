## 2025-03-05 - Privilege Escalation via Direct Object Creation
**Vulnerability:** In `firestore.rules`, the `allow create` rule for `/laws/{lawId}` only checked if the user was authenticated. This allowed any user to create a law with `status: 'approved'`, bypassing the admin verification workflow and escalating their privileges.
**Learning:** Security rules must explicitly validate default data states (e.g., `status == 'pending'`) during document creation, not just verify authentication or role.
**Prevention:** Always validate the data payload (`request.resource.data`) for restricted fields during `allow create` conditions to prevent users from bypassing expected workflows or role-based access controls.

## 2025-03-05 - Stored XSS in PDF URLs
**Vulnerability:** User-provided URLs for PDF files (`pdfUrl`) were fetched directly from Firestore and rendered into the UI via `href` attributes without prior sanitization. This could allow an attacker to inject `javascript:` or `data:` URIs, leading to Stored XSS.
**Learning:** Data from Firestore cannot be inherently trusted. It must be sanitized at the extraction layer (e.g., in converter functions like `firestoreLawToVerifiedLaw`) before reaching React UI components.
**Prevention:** Always validate and sanitize user-provided URLs to ensure they only use secure `http://` or `https://` protocols, neutralizing potential XSS payloads early in the data pipeline.
