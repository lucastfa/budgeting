Given("the user is on budget page") do
  @budgetPage = BudgetPage.new
  @budgetPage.load
  expect(@budgetPage.verify_page_loaded).to be true
  expect(@budgetPage).to be_all_there
end

When(/^the user adds a (.*) named (.*) with value (.*)$/) do |category, description, value|
  @budgetPage.input_item(category, description, value)
end

Then(/^the added (.*) should be visible with value (.*) in the bottom of the budget list$/) do |description, value|
  expect(@budgetPage.check_last_added_item(description, value)).to be true
end

Then(/^the total inflow should be updated by (.*)$/) do |value|
  expect(@budgetPage.check_updated_inflow(value)).to be true
end

Then(/^the total outflow should be updated by (.*)$/) do |value|
  expect(@budgetPage.check_updated_outflow(value)).to be true
end

Then(/^the working balance should be updated by (.*)$/) do |value|
  expect(@budgetPage.check_updated_balance(value)).to be true
end
