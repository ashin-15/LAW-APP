## 2024-05-20 - [Fix direct object creation vulnerability in firestore.rules]
**Vulnerability:** A direct object creation vulnerability existed in `firestore.rules` where authenticated users could create a document in the `/laws` collection with an `approved` status, bypassing the intended admin approval workflow.
**Learning:** Firestore security rules must explicitly validate default data states (e.g., `status == 'pending'`) during document creation (`allow create`), as users provide the initial document data which might otherwise include elevated status or privileges.
**Prevention:** Always enforce strict schema and default value validation in `allow create` conditions, explicitly validating critical fields like `status`, `role`, or `permissions` against safe default values.
