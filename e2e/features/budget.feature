Feature: Budget

	As a personal budget user
	I want to input my incomes and debits
	So I can manage my money better

	Scenario: Adds an income
	Given the user is on budget page
  When the user adds a Income named Salary with value 20
  Then the added Salary should be visible with value $20.00 in the bottom of the budget list
  And the total inflow should be updated by 20
  And the working balance should be updated by 20

	Scenario: Adds an expense
	Given the user is on budget page
	When the user adds a Travel named Vacations with value 500
	Then the added Vacations should be visible with value -$500.00 in the bottom of the budget list
  And the total outflow should be updated by 500
  And the working balance should be updated by -500

	Scenario: Adds a big expense that changes the balance to negative
	Given the user is on budget page
	When the user adds a Misc named Expense with value 50000
	Then the added Expense should be visible with value -$50,000.00 in the bottom of the budget list
  And the total outflow should be updated by 50000
  And the working balance should be updated by -50000
