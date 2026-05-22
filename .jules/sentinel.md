## 2025-03-05 - Privilege Escalation via Direct Object Creation
**Vulnerability:** In `firestore.rules`, the `allow create` rule for `/laws/{lawId}` only checked if the user was authenticated. This allowed any user to create a law with `status: 'approved'`, bypassing the admin verification workflow and escalating their privileges.
**Learning:** Security rules must explicitly validate default data states (e.g., `status == 'pending'`) during document creation, not just verify authentication or role.
**Prevention:** Always validate the data payload (`request.resource.data`) for restricted fields during `allow create` conditions to prevent users from bypassing expected workflows or role-based access controls.
