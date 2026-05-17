## 2025-05-17 - [Authorization Bypass in Firestore Rules]
**Vulnerability:** Firestore rules for creating laws allowed any authenticated user to set `status: 'approved'` and spoof the `uploadedBy` uid, bypassing the admin approval process.
**Learning:** Even if the client-side code hardcodes `status: 'pending'`, backend rules must explicitly validate incoming `request.resource.data` to prevent malicious clients from exploiting the endpoint.
**Prevention:** Always add constraints to `allow create` rules checking field values (like `status`) and verifying user ownership (`request.auth.uid == request.resource.data.uploadedBy`).
