## 2025-03-05 - Privilege Escalation via Direct Object Creation
**Vulnerability:** In `firestore.rules`, the `allow create` rule for `/laws/{lawId}` only checked if the user was authenticated. This allowed any user to create a law with `status: 'approved'`, bypassing the admin verification workflow and escalating their privileges.
**Learning:** Security rules must explicitly validate default data states (e.g., `status == 'pending'`) during document creation, not just verify authentication or role.
**Prevention:** Always validate the data payload (`request.resource.data`) for restricted fields during `allow create` conditions to prevent users from bypassing expected workflows or role-based access controls.

## 2025-05-25 - Fix Stored XSS in User Uploaded PDF URLs
**Vulnerability:** The application was directly setting the `pdfUrl` from Firestore data into anchor tags (`<a href={law.pdfUrl}>`). This could allow an attacker to create a document with a malicious URL (e.g., `javascript:alert('XSS')`) and execute arbitrary scripts when victims clicked the link.
**Learning:** Any URL retrieved from a database that can be modified by users and then rendered into DOM attributes (like `href` or `src`) is a potential Stored XSS vector if not restricted to safe protocols.
**Prevention:** Always validate and sanitize URLs at the data extraction layer (e.g., inside the Firestore data converter before it reaches UI components), allowing only trusted protocols like `http:` and `https:`.
