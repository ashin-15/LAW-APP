## 2026-05-19 - [Prevent Direct Object Creation in Firestore Rules]
**Vulnerability:** A user could potentially create an already-approved law by passing `status: 'approved'` during document creation, bypassing the admin approval workflow.
**Learning:** `allow create` conditions must explicitly validate default data states (e.g., `request.resource.data.status == 'pending'`) to prevent privilege escalation via direct object creation vulnerabilities.
**Prevention:** Always validate initial states for important status or permission fields in Firestore security rules `allow create` blocks.
