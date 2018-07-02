# Budgeting App End to End test suite

## Test Plan
To test the application the following strategy was applied:

As the application does not have a human readable documentation where we can check the application's requirements, some test scenarios were exploratory written using the Gherkin language, so we can have a live documentation reading the test cases.

Here are the test cases:

```
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
```

```
Feature: Reports
```

## Strategy on automation
With the test cases in hands I decided to select 3 of them to automate, using the cucumber framework, so we can use the already written test cases and the BDD approach. This way all the team members (tech and non tech) will have the visibility of what is being developed and tested just reading the feature files.

The test cases selection was made by choosing the critical part of the system: the expenses input. If this part has a problem, the reports part would not behave well, of course. And also this the basic usage of the system, like the core. Without this part working fine, the system would be useless for the final user.

As an extra scope of this task I would check if both parts of the application are well covered in a unit test level, so we can balance the pyramid and have a better strategy on which scenarios to automate or not.

## How to execute the automation code
* Make sure you have Ruby and bundler gem installed (if not after Ruby installation run `gem install bundler`).
* Go to `e2e` folder.
* Install the dependencies running `bundle install`.
* Make sure you have `Google Chrome` installed.
* Run one of the rake tasks created in `Rakefile`:
* `bundle exec rake test_e2e`: just run all the 3 created scenarios.
* `bundle exec rake test_e2e_reports`: run the scenarios and create an html report.

Notes: the HTML report will be saved in a folder called reports, also when a test fail a screenshot is saved in the folder screenshots. Screenshots are saved using the date to make it easy to identify when it ran. Reports are kept only the last execution.

### About the failing test
From the 3 automated scenarios, one of them is failing: `Adds a big expense that changes the balance to negative`.

This happens because there is a bug in the system: when the expenses are bigger than the incomes, the working balance is still being showed as positive and not negative.

So for example if I have a total of $250 incomes and a total of $750 expenses, the system is showing $500 as the balance, but it has to show -$500. This is a critical issue because it can make the user thinks that its finances are good when in reality it's bad.

## About the used gems
In my solution I made use of the following gems:
* Cucumber: as already mentioned I used Cucumber to have the benefit of have a live documentation of the system and the tests. During the product development would be good to make use of Cucumber with the BDD so we can take advantages of Cucumber features and not only to have it written and forgotten.
* Capybara: it's a framework that makes the selenium automated tests more readable and easy to maintain and write.
* RSpec: to make the tests assertions.
* Pry: debug the code while the test is being created.
* Site Prism: I decided to use the page objects model to keep the code well organized, with the elements and operations made on them isolated in respective classes. This way changes on the application would have small impact on the test suite, and the become more easy to read and maintain. Site Prism is a gem that implements the page objects model for capybara.
* Rake: to create tasks and facilitate the execution of them, so the person who is executing does not need to write complex commands every time. Just need to read the documentation and run it!

## Want to contribute? Know the structure
Here is how the tests and automation code are organized:
* `features` folder:
* `features/step_definitions` folder:
* `features/pages` folder:
* `features/support` folder:
