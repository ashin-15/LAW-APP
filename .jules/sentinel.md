## 2025-03-05 - Privilege Escalation via Direct Object Creation
**Vulnerability:** In `firestore.rules`, the `allow create` rule for `/laws/{lawId}` only checked if the user was authenticated. This allowed any user to create a law with `status: 'approved'`, bypassing the admin verification workflow and escalating their privileges.
**Learning:** Security rules must explicitly validate default data states (e.g., `status == 'pending'`) during document creation, not just verify authentication or role.
**Prevention:** Always validate the data payload (`request.resource.data`) for restricted fields during `allow create` conditions to prevent users from bypassing expected workflows or role-based access controls.

## 2025-03-05 - Stored XSS via Unsanitized PDF URLs
**Vulnerability:** The application directly bound the `pdfUrl` field fetched from Firestore to `href` attributes in `<a href={law.pdfUrl}>` tags without validation. An attacker could store a malicious `javascript:alert(1)` URI, resulting in a Stored XSS vulnerability when an admin or user clicked the link.
**Learning:** Never trust data originating from databases when rendering sensitive HTML attributes like `href`, `src`, or `action`. Data models should sanitize this input before returning it to the UI layer.
**Prevention:** Always validate URLs explicitly when transforming database DTOs. For `href` links, strictly enforce that they begin with `http://` or `https://` and strip out whitespace.
