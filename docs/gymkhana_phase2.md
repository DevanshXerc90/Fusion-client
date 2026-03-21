# Gymkhana Phase 2 Roadmap

## Scope
This phase extends the current 4-page Gymkhana MVP (`events`, `clubs`, `facilities`, `bookings`) into complete workflow coverage from UC/BR/WF docs.

## Proposed Features

1. Membership Management
   - Student membership application form
   - Coordinator review queue (approve/reject)
   - Status lock after decision (BR-GM-008)
   - Duplicate membership prevention (BR-GM-001)

2. Election Participation
   - Election listing + participation form
   - Single participation enforcement (BR-GM-004)
   - Mandatory field validation (BR-GM-003)

3. Budget Workflow
   - Coordinator budget submission
   - Counsellor review
   - Dean final decision
   - Final lock post decision (BR-GM-015)

4. Bill Settlement Workflow
   - Bill + receipt upload
   - Budget adherence checks (BR-GM-010)
   - Valid document format checks (BR-GM-011)

5. Club Lifecycle Controls
   - Inactive club identification
   - Deactivation workflow with financial clearance (BR-GM-013)

6. Communications
   - Club announcements/reports forms
   - Non-empty content validation (BR-GM-014)

## Suggested Delivery Order
- Sprint 1: Membership + Elections
- Sprint 2: Budget + Bill Settlement
- Sprint 3: Deactivation + Announcements/Reports

## Temporary Policy for Current Development
Until production college data and strict access controls are finalized:
- Keep create/update actions open for testing
- Keep business validations active (required fields, uniqueness, conflicts)
- Re-enable strict RBAC in a dedicated hardening pass
