Workflow Template (GM-WF-###)
GM-WF-001 — New Club Proposal Workflow <Student Proposes Club><Counsellor Reviews><End>
	
Workflow Code	GM-WF-001
Workflow Name	<Student Proposes Club><Counsellor Reviews><End>
Objective	To manage the process of a student proposing a new club and a faculty counsellor reviewing it.
Trigger	User click to start a new club proposal.
Actors / Lanes	Student
Preconditions	Student must be logged in.
Start Task (UC)	GM-UC-003
End States	END-1 (Approved), END-2 (Rejected)
Activity Graph –
Nodes (Use Cases, Decisions, Ends):
Node ID	Type	Label	Actor/Lane	Notes
N1	UC	GM-UC-003	Student	Student submits a new club proposal.
D1	Decision	Is proposal valid? [BR-GM-002, BR-GM-003]	System	System checks for unique name and complete fields.
N2	UC	GM-UC-012	Faculty Counsellor	Counsellor reviews the submitted proposal.
D2	Decision	Does proposal adhere to policy? [BR-GM-012]	Faculty Counsellor	Counsellor checks for policy compliance.
END-1	End	Proposal Approved	-	
END-2	End	Proposal Rejected	-	
Directed Edges (with BR Guards):
Edge ID	From	To	Guard / Condition (BRs)	On Timeout (XXX-BR-XXX)	Notes / Outcome
E1	N1	D1	[Submitted]	-	Proposal sent for initial validation.
E2	D1	N2	[ValidationPassed] BR-GM-002, BR-GM-003	-	Valid proposals are sent to the counsellor.
E3	D1	END-2	[ValidationFailed]	-	Invalid proposals are rejected.
E4	N2	D2	[Reviewed]	-	Counsellor makes a decision.
E5	D2	END-1	[PolicyCompliant] BR-GM-012	-	The new club is approved.
E6	D2	END-2	[PolicyViolation]	-	The proposal is rejected for policy reasons.
GM-WF-002 — Club Budget Approval Workflow <Coordinator Submits><Counsellor Reviews><Dean Approves>
	
Workflow Code	GM-WF-002
Workflow Name	<Coordinator Submits><Counsellor Reviews><Dean Approves>
Objective	To streamline the multi-level approval process for a club's yearly budget.
Trigger	Club coordinator initiates budget submission.
Actors / Lanes	Club Coordinator
Preconditions	User must have 'Club Coordinator' role.
Start Task (UC)	GM-UC-007
End States	END-1 (Budget Approved), END-2 (Budget Rejected)
Activity Graph –
Nodes (Use Cases, Decisions, Ends):
Node ID	Type	Label	Actor/Lane	Notes
N1	UC	GM-UC-007	Club Coordinator	Coordinator prepares and submits the budget.
D1	Decision	Are details complete? [BR-GM-003]	System	Initial check for mandatory fields.
N2	UC	GM-UC-008	Faculty Counsellor	Counsellor reviews the budget details.
D2	Decision	Counsellor's Decision?	Faculty Counsellor	Approve, Reject, or Request Clarification.
N3	UC	GM-UC-013	Dean-Student	Dean performs the final review and approval.
D3	Decision	Dean's Final Decision? [BR-GM-015]	Dean-Student	Final Approve or Reject.
END-1	End	Budget Approved	-	
END-2	End	Budget Rejected	-	
Directed Edges (with BR Guards):
Edge ID	From	To	Guard / Condition (BRs)	On Timeout (XXX-BR-XXX)	Notes / Outcome
E1	N1	D1	[Submitted]	-	Budget is submitted for validation.
E2	D1	N2	[ValidationPassed] BR-GM-003	-	Sent to counsellor for review.
E3	D1	END-2	[ValidationFailed]	-	Rejected due to incomplete information.
E4	N2	D2	[Reviewed]	-	Counsellor submits their decision.
E5	D2	N3	[Approved/Forwarded]	-	Forwarded to Dean for final approval.
E6	D2	END-2	[Rejected]	-	Counsellor rejects the budget.
E7	N3	D3	[Reviewed]	-	Dean makes the final call.
E8	D3	END-1	[Approved] BR-GM-015	-	Budget is officially approved.
E9	D3	END-2	[Rejected] BR-GM-015	-	Budget is finally rejected.
GM-WF-003 — Club Member Management Workflow <Student Applies><Coordinator Manages>
	
Workflow Code	GM-WF-003
Workflow Name	<Student Applies><Coordinator Manages>
Objective	To handle a student's application for club membership and the subsequent management by the Club Coordinator.
Trigger	Student submits a membership form.
Actors / Lanes	Student
Preconditions	Student is logged in; Club exists.
Start Task (UC)	GM-UC-002
End States	END-1 (Membership Approved), END-2 (Membership Rejected)
Activity Graph –
Nodes (Use Cases, Decisions, Ends):
Node ID	Type	Label	Actor/Lane	Notes
N1	UC	GM-UC-002	Student	Student fills and submits the membership form.
D1	Decision	Is student already a member? [BR-GM-001]	System	System checks for duplicate membership.
N2	UC	GM-UC-005	Club Coordinator	Coordinator views and manages the application.
D2	Decision	Coordinator's Decision? [BR-GM-008]	Club Coordinator	Approve or Reject the application.
END-1	End	Membership Approved	-	
END-2	End	Membership Rejected	-	
Directed Edges (with BR Guards):
Edge ID	From	To	Guard / Condition (BRs)	On Timeout (XXX-BR-XXX)	Notes / Outcome
E1	N1	D1	[Submitted]	-	Application sent for validation.
E2	D1	N2	[IsNotMember] BR-GM-001	-	Application forwarded to the Coordinator.
E3	D1	END-2	[IsAlreadyMember]	-	Application is rejected automatically.
E4	N2	D2	[Reviewed]	-	Coordinator makes a decision.
E5	D2	END-1	[Approved] BR-GM-008	-	Student becomes a club member.
E6	D2	END-2	[Rejected] BR-GM-008	-	Student's application is rejected.
GM-WF-004 — Bill Settlement Workflow <Coordinator Submits Bill><FIC Verifies>
	
Workflow Code	GM-WF-004
Workflow Name	<Coordinator Submits Bill><FIC Verifies>
Objective	To manage the submission and verification process for club expense bills.
Trigger	Club Coordinator submits a new bill for settlement.
Actors / Lanes	Club Coordinator
Preconditions	Coordinator is logged in; an approved budget exists for the club.
Start Task (UC)	GM-UC-010
End States	END-1 (Bill Settled), END-2 (Bill Rejected)
Activity Graph –
Nodes (Use Cases, Decisions, Ends):
Node ID	Type	Label	Actor/Lane	Notes
N1	UC	GM-UC-010	Club Coordinator	Submits bill with details and receipts.
D1	Decision	Valid Submission? [BR-GM-010, BR-GM-011]	System	Checks if bill exceeds budget and if receipt format is valid.
N2	UC	-	FIC	FIC reviews the bill and attached documents.
D2	Decision	DEAN's Decision?	DEAN	Approve or Reject the settlement.
END-1	End	Bill Settled	-	
END-2	End	Bill Rejected	-	
Directed Edges (with BR Guards):
Edge ID	From	To	Guard / Condition (BRs)	On Timeout (XXX-BR-XXX)	Notes / Outcome
E1	N1	D1	[Submitted]	-	Bill submitted for automatic checks.
E2	D1	N2	[ValidationPassed] BR-GM-010, BR-GM-011	-	Bill is forwarded to the administrator.
E3	D1	END-2	[ValidationFailed]	-	Rejected for budget/format issues.
E4	N2	D2	[Reviewed]	-	Dean makes a decision.
E5	D2	END-1	[Approved]	-	The expense is settled.
E6	D2	END-2	[Rejected]	-	The settlement is rejected with comments.
GM-WF-005 — Club Deactivation Workflow <Dean Identifies Inactive Club><Dean Deactivates>
	
Workflow Code	GM-WF-005
Workflow Name	<Dean Identifies Inactive Club><Dean Deactivates>
Objective	To formalize the process of deactivating an inactive club.
Trigger	Dean-Student initiates the deactivation process from the dashboard.
Actors / Lanes	Dean-Student
Preconditions	Dean-Student is logged in.
Start Task (UC)	GM-UC-014
End States	END-1 (Club Deactivated), END-2 (Deactivation Cancelled)
Activity Graph –
Nodes (Use Cases, Decisions, Ends):
Node ID	Type	Label	Actor/Lane	Notes
N1	UC	GM-UC-014	Dean-Student	Dean identifies and selects an inactive club.
D1	Decision	Financial Clearance? [BR-GM-013]	System	System checks for pending financial settlements.
N2	Task	Confirm Deactivation	Dean-Student	Dean must confirm the action in a dialog.
END-1	End	Club Deactivated	-	
END-2	End	Deactivation Cancelled	-	
Directed Edges (with BR Guards):
Edge ID	From	To	Guard / Condition (BRs)	On Timeout (XXX-BR-XXX)	Notes / Outcome
E1	N1	D1	[DeactivationInitiated]	-	Request sent for financial check.
E2	D1	N2	[FinanciallyCleared] BR-GM-013	-	Proceeds to final confirmation.
E3	D1	END-2	[PendingSettlements]	-	Deactivation blocked until finances are cleared.
E4	N2	END-1	[Confirmed]	-	Club is archived and marked as inactive.
E5	N2	END-2	[Cancelled]	-	Dean cancels the deactivation process.
GM-WF-006 — Club Election Participation Workflow <Student Participates>
	
Workflow Code	GM-WF-006
Workflow Name	<Student Participates>
Objective	To manage a student's participation in a club election.
Trigger	Student clicks to participate in an open club election.
Actors / Lanes	Student
Preconditions	Student is logged in and a member of the club.
Start Task (UC)	GM-UC-006
End States	END-1 (Participation Recorded), END-2 (Participation Rejected)
Activity Graph –
Nodes (Use Cases, Decisions, Ends):
Node ID	Type	Label	Actor/Lane	Notes
N1	UC	GM-UC-006	Student	Student fills and submits the election form.
D1	Decision	Valid Participation? [BR-GM-003, BR-GM-004]	System	Checks for complete form and single participation.
END-1	End	Participation Recorded	-	
END-2	End	Participation Rejected	-	
Directed Edges (with BR Guards):
Edge ID	From	To	Guard / Condition (BRs)	On Timeout (XXX-BR-XXX)	Notes / Outcome
E1	N1	D1	[Submitted]	-	Participation form submitted for validation.
E2	D1	END-1	[ValidationPassed] BR-GM-003, BR-GM-004	-	The student's participation is successfully recorded.
E3	D1	END-2	[ValidationFailed]	-	Rejected due to incomplete form or prior participation.

