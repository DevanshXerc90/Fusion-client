Use Case Template (<Module Abbr.>-UC-###)
UC ID	GM-UC-001
UC Name	View club information
UC Description [Goal (1–2 lines)]	Provide students and staff with detailed information about existing clubs.
Trigger (1 line)	User click
Actors	Primary: students  , secondary : faculty,staff
Preconditions	Student login
Main Flow (M1, M2, …)	Step ID	Steps	Alternate/ Sub flow	Applicable BRs
	M1
M2


M3
	Open club section
select the club to view its details.

system will show its details	[A1]
[A2]


[S1]	
none
Success Postconditions	  ClubDetails{id, viewed=true, timestamp}
 Event: "Club information accessed" logged in audit

Failure Postconditions	- <no state change / draft retained>
Alternate / Exception Flows (A1, A2, …)	  A1: Club not found → show error → return to M2
 A2: Session expired → redirect to login

Sub-Flows (S1, S2, …)	S1: Fetch club data → returns details to M3	
Global Alternate Flows	 A1: Network/server error → retry option or end(failure)
 A2: Unauthorized access → redirect to login
	
Notes (optional)	Notification/Message ID: INFO_CLUB_VIEW_SUCCESS, ERROR_CLUB_NOT_FOUND




                   Use Case Template (<Module Abbr.>-UC-###)
UC ID	GM-UC-002
UC Name	Club membership form
UC Description [Goal (1–2 lines)]	Allow a student to apply for membership in a club.
Trigger (1 line)	User click
Actors	 Primary: Student
  Secondary: Club Coordinator

Preconditions	Student login,club exists
Main Flow (M1, M2, …)	Step ID	Steps	Alternate/ Sub flow	Applicable BRs
	M1

M2


M3
	Student opens membership form.
Student fills details and submits.

System validates and forwards to coordinator.	
[A1]
[A2]

[S1]	
BR-GM-001, BR-GM-003
Success Postconditions	 MembershipForm{id, status=Draft or Submitted}
Event: "Membership request submitted" logged

Failure Postconditions	Application blocked; user notified of error.
Alternate / Exception Flows (A1, A2, …)	A1: Mandatory field missing → show error → return to M1
  A2: Student already member → reject immediately
	
Sub-Flows (S1, S2, …)	•	S1: Application validated → forwarded to coordinator review
  
	
Global Alternate Flows	  A1: Server error → retry or save draft
 A2: Unauthorized → redirect to login
	
Notes (optional)	Notifications: MEMBERSHIP_REQUEST_SUBMITTED, MEMBERSHIP_ALREADY_EXISTS





Use Case Template (<Module Abbr.>-UC-###)
UC ID	GM-UC-003
UC Name	Propose a new club
UC Description [Goal (1–2 lines)]	Allows a student to propose a Allow a student to submit a proposal for creating a new clubclub
Trigger (1 line)	User click
Actors	Primary: students  , secondary : faculty counsellor
Preconditions	Student login
Main Flow (M1, M2, …)	Step ID	Steps	Alternate/ Sub flow	Applicable BRs
	M1

M2



M3
	Open new club proposal form

Student fills details (club name, objectives) and submits.

System validates for completeness and uniqueness.	[A1]

[A2]



[S1]	BR-GM-003
BR-GM-002


Success Postconditions	  ClubProposal {id, status="Submitted"}
  Event: "Club proposal created"

Failure Postconditions	Proposal blocked; errors displayed.
Alternate / Exception Flows (A1, A2, …)	•  A1: Mandatory fields missing → show error → return to M1
•  A2: Proposed name already exists → reject submission
	
Sub-Flows (S1, S2, …)	S1: Forward valid proposal to faculty counsellor for review	
Global Alternate Flows	•  A1: Network/server error → retry or cancel
•  A2: Unauthorized access → redirect to login
	
Notes (optional)	Notification/Message ID: INFO_CLUB_PROPOSAL_SUBMITTED, ERROR_DUPLICATE_CLUB_NAME




Use Case Template (<Module Abbr.>-UC-###)
UC ID	GM-UC-004
UC Name	View club events
UC Description [Goal (1–2 lines)]	Provide students and staff with details of upcoming and past events.
Trigger (1 line)	User click
Actors	Primary: students  , secondary : faculty,staff
Preconditions	Student login
Main Flow (M1, M2, …)	Step ID	Steps	Alternate/ Sub flow	Applicable BRs
	M1
M2



M3
	Open club section
select event section of the club to view its assignments and events

System displays event details, marking past events as archived.	
[A1]
[A2]


[S1]	




BR-GM-007
Success Postconditions	•  •  EventDetails {id, viewed=true, timestamp}
•  Archived status shown for expired events

Failure Postconditions	No state change
Alternate / Exception Flows (A1, A2, …)	•  A1: Event not found → error → return to M2
•  A2: Session expired → redirect to login
	
Sub-Flows (S1, S2, …)	S1: Fetch event data from database	
Global Alternate Flows	•  A1: Network/server error → retry or failure
•  A2: Unauthorized access → redirect to login
	
Notes (optional)	Notification/Message ID: INFO_EVENT_VIEW_SUCCESS, ERROR_EVENT_NOT_FOUND





Use Case Template (<Module Abbr.>-UC-###)
UC ID	GM-UC-005
UC Name	Manage Membership Applications
UC Description [Goal (1–2 lines)]	Allows the club coordinator to manage members and view new membership applications
Trigger (1 line)	User click
Actors	Primary: Club Coordinator
Preconditions	Student login, coordinator role
Main Flow (M1, M2, …)	Step ID	Steps	Alternate/ Sub flow	Applicable BRs
	M1


M2



M3
	Coordinator opens applications list.

Selects an application to review.


Approves or rejects application.	[A1]


[A2]



[S1]	BR-GM-005

BR-GM-006


BR-GM-008
Success Postconditions	•  MembershipApplication {status="Approved/Rejected"}
•  Decision final and logged

Failure Postconditions	Application unchanged
Alternate / Exception Flows (A1, A2, …)	•	A1: No applications available → show message
•	A2: Applicant data invalid → reject automatically
	
Sub-Flows (S1, S2, …)	S1: Lock application status once approved/rejected	
Global Alternate Flows	•  A1: Network error → retry
•  A2: Unauthorized access → redirect to login
	
Notes (optional)	Notifications: MEMBER_APPROVED, MEMBER_REJECTED, ERROR_INVALID_ROLE



Use Case Template (<Module Abbr.>-UC-###)
UC ID	GM-UC-006
UC Name	Participate in club elections
UC Description [Goal (1–2 lines)]	•  Student participates in a club election securely.


Trigger (1 line)	User click
Actors	Primary: students  
Preconditions	Student login
Main Flow (M1, M2, …)	Step ID	Steps	Alternate/ Sub flow	Applicable BRs
	M1

M2


M3
	Student opens election form.

Student opens election form.


System validates and records vote.	[A1]

[A2]

[S1]	BR-GM-003
BR-GM-004
Success Postconditions	
Participation {id, recorded=true, timestamp}
•  
Failure Postconditions	Vote rejected, error shown
Alternate / Exception Flows (A1, A2, …)	•  A1: Form incomplete → error → return
•  A2: Duplicate participation → reject submission
	
Sub-Flows (S1, S2, …)	S1: Securely log participation entry	
Global Alternate Flows	•  A1: Network/server error → retry
•  A2: Unauthorized → redirect login
	
Notes (optional)	Notifications: ELECTION_PARTICIPATION_SUBMITTED, ERROR_ALREADY_PARTICIPATED



Use Case Template (<Module Abbr.>-UC-###)
UC ID	GM-UC-007
UC Name	Submit yearly budget

UC Description [Goal (1–2 lines)]	Allows club coordinators to prepare and submit the yearly budget for their club.
Trigger (1 line)	User click
Actors	Primary: Club Coordinator
Secondary: Faculty Counsellor
Preconditions	student login as coordinator role
Main Flow (M1, M2, …)	Step ID	Steps	Alternate/ Sub flow	Applicable BRs
	M1


M2


M3
	Open “Budget Submission” dashboard

Fill in details (expenses, requirements)inventory

Click submit, system forwards to counsellor	[A1]


[A2]

[S1]	BR-GM-003

BR-GM-005
Success Postconditions	 BudgetProposal {status="Submitted"}
Failure Postconditions	Proposal blocked
Alternate / Exception Flows (A1, A2, …)	•  A1: Mandatory fields empty → error
•  A2: User not coordinator → deny access
	
Sub-Flows (S1, S2, …)	S1: Forward valid budget to counsellor	
Global Alternate Flows	 A1: Network error → retry
A2: Unauthorized → redirect login
	
Notes (optional)	INFO_BUDGET_SUBMITTED, ERROR_ACCESS_DENIED




Use Case Template (<Module Abbr.>-UC-###)
UC ID	GM-UC-008
UC Name	Review budget
UC Description [Goal (1–2 lines)]	Allows faculty counsellor to review and approve/reject the submitted budgets.
Trigger (1 line)	User click
Actors	Primary: Faculty Counsellor
Secondary: Dean-Student
Preconditions	Budget submitted
Main Flow (M1, M2, …)	Step ID	Steps	Alternate/ Sub flow	Applicable BRs
	M1


M2

M3
	Counsellor opens submitted budget details.

Reviews financial breakdown.

Approves, rejects, or requests clarification.	[A1]


[A2]

S1	
BR-GM-005
Success Postconditions	BudgetReview {id, status="Reviewed"}, decision logged
Failure Postconditions	budget remains pending review
Alternate / Exception Flows (A1, A2, …)	A1: Budget incomplete → request clarification; 
A2: Counsellor not authorized → deny access	
Sub-Flows (S1, S2, …)	Forward approved budget to Dean	
Global Alternate Flows	A1: Network/server error → retry; A2: Unauthorized access → redirect login	
Notes (optional)	INFO_BUDGET_REVIEWED, ERROR_ACCESS_DENIED


UC ID	GM-UC-009
UC Name	Schedule Event
UC Description [Goal (1–2 lines)]	Coordinator schedules a new event for their club.
Trigger (1 line)	User click
Actors	Primary: Club Coordinator

Preconditions	student login as coordinator role
Main Flow (M1, M2, …)	Step ID	Steps	Alternate/ Sub flow	Applicable BRs
	M1


M2


M3
	Open event scheduling form.


Fill in details of event


Submit event to system.	[A1]


[A2]

[S1]	BR-GM-003

BR-GM-009
BR-GM-005

Success Postconditions	Event {id, status="Scheduled"}
Failure Postconditions	Event not created
Alternate / Exception Flows (A1, A2, …)	A1: Missing details → error; A2: Schedule conflict → reject submission	
Sub-Flows (S1, S2, …)	Validate event against existing schedule	
Global Alternate Flows	Network/server error; Unauthorized access → login	
Notes (optional)	NFO_EVENT_SCHEDULED, ERROR_SCHEDULE_CONFLICT


UC ID	GM-UC-010
UC Name	Submit Bill for Settlement
UC Description [Goal (1–2 lines)]	Coordinator submits bill with receipts for expenses.

Trigger (1 line)	User click
Actors	Primary: Club Coordinator

Preconditions	Approved budget exists.
Main Flow (M1, M2, …)	Step ID	Steps	Alternate/ Sub flow	Applicable BRs
	M1


M2


M3
	Open bill form and attach receipts.

Enter bill amount and details.


Submit bill to system.	[A1]


[A2]

[S1]	BR-GM-011

BR-GM-010
BR-GM-005

Success Postconditions	Bill {id, status="Submitted"}
Failure Postconditions	Bill rejected
Alternate / Exception Flows (A1, A2, …)	A1: Invalid receipt format → error; A2: Bill exceeds budget → reject	
Sub-Flows (S1, S2, …)	Validate bill	
Global Alternate Flows	Network/server error; Unauthorized access → login	
Notes (optional)	INFO_BILL_SUBMITTED, ERROR_INVALID_RECEIPT


UC ID	GM-UC-011
UC Name	Manage Announcements
UC Description [Goal (1–2 lines)]	Authorized user posts announcements on the portal.
Trigger (1 line)	User click
Actors	Primary: Club Coordinator

Preconditions
Main Flow (M1, M2, …)	Step ID	Steps	Alternate/ Sub flow	Applicable BRs
	M1


M2


M3
	Open announcement form.

Enter announcement content.



Submit announcement to system.	[A1]


[A2]

[S1]	BR-GM-003

BR-GM-005
BR-GM-005

Success Postconditions	Announcement {id, status="Published"}
Failure Postconditions	Announcement rejected
Alternate / Exception Flows (A1, A2, …)	A1: Missing details → error; A2: Unauthorized → deny access	
Sub-Flows (S1, S2, …)	S1: Save details and publish to portal	
Global Alternate Flows	Network/server error; Unauthorized access → login	
Notes (optional)	INFO_ANNOUNCEMENT_PUBLISHED, ERROR_ANNOUNCEMENT_FAILED


UC ID	GM-UC-012
UC Name	Review New Club Proposal
UC Description [Goal (1–2 lines)]	Faculty counsellor reviews a new club proposal.
Trigger (1 line)	User click
Actors	Primary: Faculty Counsellor

Preconditions	Proposal submitted by student.
Main Flow (M1, M2, …)	Step ID	Steps	Alternate/ Sub flow	Applicable BRs
	M1


M2


M3
	Counsellor opens proposal details.

Reviews club name, objectives, compliance.

Approves or rejects proposal.	[A1]


[A2]

[S1]	BR-GM-012

BR-GM-005
BR-GM-005

Success Postconditions	Proposal {status="Approved/Rejected"}
Failure Postconditions	•  Proposal remains pending

Alternate / Exception Flows (A1, A2, …)	A1: Policy violation → reject; A2: Unauthorized → deny access	
Sub-Flows (S1, S2, …)	: S1: Log decision in system	
Global Alternate Flows	Network/server error; Unauthorized → login	
Notes (optional)	INFO_PROPOSAL_REVIEWED, ERROR_POLICY_VIOLATION


UC ID	GM-UC-013
UC Name	Approve Budget (Dean)
UC Description [Goal (1–2 lines)]	Dean provides final approval/rejection for budget.
Trigger (1 line)	User click
Actors	Primary: Dean-Student
Preconditions	Budget forwarded by counsellor.
Main Flow (M1, M2, …)	Step ID	Steps	Alternate/ Sub flow	Applicable BRs
	M1


M2


M3
	Dean opens budget details.


Reviews budget


Approves or rejects proposal.	[A1]


[A2]

[S1]	BR-GM-015

BR-GM-015
BR-GM-005

Success Postconditions	Budget {status="Approved/Rejected"}, locked
Failure Postconditions	Budget undecided
Alternate / Exception Flows (A1, A2, …)	A1: Rejection logged; A2: Modifications blocked	
Sub-Flows (S1, S2, …)	: S1: Log decision in system	
Global Alternate Flows	Network/server error; Unauthorized → login	
Notes (optional)	INFO_BUDGET_APPROVED, ERROR_BUDGET_LOCKED

UC ID	GM-UC-014
UC Name	Deactivate Club
UC Description [Goal (1–2 lines)]	Dean deactivates inactive club after financial clearance.
Trigger (1 line)	User click
Actors	Primary: Dean-Student
Preconditions	Dean logged in.
Main Flow (M1, M2, …)	Step ID	Steps	Alternate/ Sub flow	Applicable BRs
	M1


M2


M3
	Dean selects inactive club from list.

System checks financial clearance 

Dean confirms deactivation..	[A1]


[A2]

[S1]	BR-GM-013

BR-GM-005
BR-GM-005

Success Postconditions	Club {status="Deactivated"}, archived
Failure Postconditions	Club remains active
Alternate / Exception Flows (A1, A2, …)	A1: Pending settlements → block; A2: Dean cancels → no change	
Sub-Flows (S1, S2, …)	S1: System archives club after confirmation	
Global Alternate Flows	Network/server error; Unauthorized → login	
Notes (optional)	INFO_CLUB_DEACTIVATED, ERROR_PENDING_SETTLEMENTS

UC ID	GM-UC-015
UC Name	Post Content (Announcements/Reports)
UC Description [Goal (1–2 lines)]	User posts new content (announcement/report).

Trigger (1 line)	User click
Actors	Primary: Club Coordinator
Preconditions	Proposal submitted by student.
Main Flow (M1, M2, …)	Step ID	Steps	Alternate/ Sub flow	Applicable BRs
	M1


M2


M3
	Open content submission form.

Enter content details.


Submit content	[A1]


[A2]

[S1]	BR-GM-014

BR-GM-005
BR-GM-005

Success Postconditions	Content {id, status="Published"}
Failure Postconditions	Content rejected
Alternate / Exception Flows (A1, A2, …)	A1: Empty content body → reject; A2: Unauthorized → deny	
Sub-Flows (S1, S2, …)	S1: Save and publish content	
Global Alternate Flows	Network/server error; Unauthorized → login	
Notes (optional)	INFO_CONTENT_POSTED, ERROR_EMPTY_CONTENT



