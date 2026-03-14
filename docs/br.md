BR-GM-001 — Membership Uniqueness
	
ID	BR-GM-001
Name	Membership Uniqueness
Type	Constraint
Canonical Statement	"A student MUST NOT be a member of the same club more than once."
Inputs & Terms	- studentId: string/ID<br>- clubId: string/ID
Logic (pick one)	b) IF a student with studentId is already a member of the club with clubId THEN block submission ELSE allow submission.
Effects/Outcome	Prevents duplicate memberships and ensures data integrity.
Referenced By	UC: GM-UC-002 (A2)
TBD / Policy Hook	- None
BR-GM-002 — Unique Club Name
	
ID	BR-GM-002
Name	Unique Club Name
Type	Constraint
Canonical Statement	"A new club proposal MUST have a unique name."
Inputs & Terms	- proposedClubName: string
Logic (pick one)	b) IF proposedClubName already exists in the list of active or pending clubs THEN block submission ELSE allow submission.
Effects/Outcome	Ensures that each club has a distinct identity and avoids confusion.
Referenced By	UC: GM-UC-003 (A2)
TBD / Policy Hook	- None
BR-GM-003 — Mandatory Form Fields
	
ID	BR-GM-003
Name	Mandatory Form Fields
Type	Constraint
Canonical Statement	"All mandatory fields in a form MUST be completed before submission."
Inputs & Terms	- formFields: object/map
Logic (pick one)	b) IF any mandatory field in formFields is empty or invalid THEN show validation errors and block submission ELSE allow submission.
Effects/Outcome	Ensures that all necessary information is collected and maintains data quality.
Referenced By	UC: GM-UC-002 (A1), GM-UC-003 (A1), GM-UC-006 (A1), GM-UC-007 (A1), GM-UC-009 (A1), GM-UC-011 (A2)
TBD / Policy Hook	- Define which fields are mandatory for each form type.
BR-GM-004 — Single Election Participation
	
ID	BR-GM-004
Name	Single Election Participation
Type	Constraint
Canonical Statement	"A student MUST NOT participate in the same club election more than once."
Inputs & Terms	- studentId: string/ID<br>- electionId: string/ID
Logic (pick one)	b) IF studentId has already participated in electionId THEN block resubmission ELSE allow participation.
Effects/Outcome	Ensures fair elections by preventing multiple votes or entries from the same person.
Referenced By	UC: GM-UC-006 (A2)
TBD / Policy Hook	- None
BR-GM-005 — Role-Based Access Control
	
ID	BR-GM-005
Name	Role-Based Access Control
Type	Authorization
Canonical Statement	"A user MUST have the required role to access certain features."
Inputs & Terms	- userId: string/ID<br>- userRole: string<br>- requiredRole: string
Logic (pick one)	b) IF userRole matches requiredRole THEN grant access ELSE deny access.
Effects/Outcome	Secures the system by ensuring that only authorized users can perform sensitive actions.
Referenced By	UC: GM-UC-005, GM-UC-007, GM-UC-008, GM-UC-009, GM-UC-010, GM-UC-011, GM-UC-012, GM-UC-013, GM-UC-014, GM-UC-015 (Preconditions)
TBD / Policy Hook	- Define the specific roles (Student, Club Coordinator, Faculty Counsellor, Dean-Student, Gymkhana Admin) and their permissions.
BR-GM-006 — Valid Applicant Data
	
ID	BR-GM-006
Name	Valid Applicant Data
Type	Validation
Canonical Statement	"Applicant data MUST be valid before a decision can be made."
Inputs & Terms	- applicantData: object
Logic (pick one)	b) IF applicantData is incomplete or contains invalid information THEN block the decision-making process ELSE allow the decision to be made.
Effects/Outcome	Prevents errors and ensures that decisions are based on accurate and complete information.
Referenced By	UC: GM-UC-005 (A1)
TBD / Policy Hook	- Specify the validation criteria for applicant data.
BR-GM-007 — Event Expiration
	
ID	BR-GM-007
Name	Event Expiration
Type	Constraint
Canonical Statement	"Expired events MUST be clearly marked as archived."
Inputs & Terms	- eventDate: date/timestamp
Logic (pick one)	b) IF eventDate is in the past THEN display an “archived event” message ELSE display the event as active.
Effects/Outcome	Provides clarity to users by distinguishing between current and past events.
Referenced By	UC: GM-UC-004 (A2)
TBD / Policy Hook	- None
BR-GM-008 — Application Status Lock
	
ID	BR-GM-008
Name	Application Status Lock
Type	Constraint
Canonical Statement	"A membership application that has been approved or rejected MUST NOT be processed again."
Inputs & Terms	- applicationId: string/ID<br>- applicationStatus: string
Logic (pick one)	b) IF applicationStatus is 'Approved' or 'Rejected' THEN block any further action ELSE allow action.
Effects/Outcome	Prevents accidental reprocessing of membership requests and ensures finality of decisions.
Referenced By	UC: GM-UC-005 (A2)
TBD / Policy Hook	- None
BR-GM-009 — Event Schedule Conflict
	
ID	BR-GM-009
Name	Event Schedule Conflict
Type	Constraint
Canonical Statement	"A new event MUST NOT have a date/time conflict with another event from the same club."
Inputs & Terms	- newEventDate: date/timestamp<br>- clubId: string/ID
Logic (pick one)	b) IF there is an existing event for clubId at newEventDate THEN show a warning and block submission ELSE allow submission.
Effects/Outcome	Avoids scheduling conflicts and ensures better event planning.
Referenced By	UC: GM-UC-009 (A2)
TBD / Policy Hook	- Decide if this rule should apply across all clubs or just within the same club.
BR-GM-010 — Budget Adherence
	
ID	BR-GM-010
Name	Budget Adherence
Type	Constraint
Canonical Statement	"A bill submission MUST NOT exceed the club's approved budget for the relevant category."
Inputs & Terms	- billAmount: number<br>- approvedBudget: number
Logic (pick one)	b) IF billAmount > approvedBudget THEN block submission ELSE allow submission.
Effects/Outcome	Enforces financial discipline and ensures clubs operate within their allocated funds.
Referenced By	UC: GM-UC-010 (A1)
TBD / Policy Hook	- None
BR-GM-011 — Valid Document Format
	
ID	BR-GM-011
Name	Valid Document Format
Type	Constraint
Canonical Statement	"Uploaded documents such as receipts MUST be in an accepted format."
Inputs & Terms	- fileType: string
Logic (pick one)	b) IF fileType is NOT in the list of allowed formats (e.g., PDF, JPG, PNG) THEN show an error ELSE allow upload.
Effects/Outcome	Ensures system compatibility and that all submitted documents are readable.
Referenced By	UC: GM-UC-010 (A2)
TBD / Policy Hook	- Define the list of allowed file formats and size limits.
BR-GM-012 — Club Policy Adherence
	
ID	BR-GM-012
Name	Club Policy Adherence
Type	Constraint
Canonical Statement	"A new club proposal MUST adhere to institutional policies."
Inputs & Terms	- proposalDetails: object
Logic (pick one)	b) IF proposalDetails violate any institutional policy (e.g., naming conventions, objectives) THEN the proposal can be rejected.
Effects/Outcome	Ensures all student clubs align with the institution's values and guidelines.
Referenced By	UC: GM-UC-012 (A2)
TBD / Policy Hook	- A detailed policy document for club formation needs to be created and linked.
BR-GM-013 — Financial Clearance for Deactivation
	
ID	BR-GM-013
Name	Financial Clearance for Deactivation
Type	Constraint
Canonical Statement	"An inactive club MUST NOT be deactivated if it has pending financial settlements."
Inputs & Terms	- clubId: string/ID<br>- financialStatus: string
Logic (pick one)	b) IF financialStatus for clubId is 'Pending Settlements' THEN block deactivation ELSE allow deactivation.
Effects/Outcome	Ensures all financial matters are resolved before a club is officially closed.
Referenced By	UC: GM-UC-014 (A1)
TBD / Policy Hook	- None
BR-GM-014 — Non-Empty Content Submission
	
ID	BR-GM-014
Name	Non-Empty Content Submission
Type	Constraint
Canonical Statement	"Content for announcements or reports MUST NOT be empty."
Inputs & Terms	- contentBody: string
Logic (pick one)	b) IF contentBody is empty or only contains whitespace THEN block submission ELSE allow submission.
Effects/Outcome	Prevents the accidental posting of empty or meaningless content.
Referenced By	UC: GM-UC-015 (A1)
TBD / Policy Hook	- None
BR-GM-015 — Budget Modification Lock
	
ID	BR-GM-015
Name	Budget Modification Lock
Type	Constraint
Canonical Statement	"A budget MUST NOT be modified after it has been finally approved or rejected by the Dean-Student."
Inputs & Terms	- budgetId: string/ID<br>- budgetStatus: string
Logic (pick one)	b) IF budgetStatus is 'Approved' or 'Rejected' THEN lock the budget from further edits ELSE allow edits.
Effects/Outcome	Ensures the integrity and finality of the budget approval process.
Referenced By	UC: GM-UC-013
TBD / Policy Hook	- None

