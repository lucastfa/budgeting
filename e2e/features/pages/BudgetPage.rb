class BudgetPage < SitePrism::Page

  set_url 'http://localhost:3000/budget'

	element :category_options, 'select[name="categoryId"]'
  element :description_input, 'input[name="description"]'
  element :value_input, 'input[name="value"]'
  element :add_button, '.containers-EntryFormRow-style-formSection button'
  element :selected_menu_item, '.components-Header-style-selected'

  elements :added_items_information, '.components-BudgetGridRow-style-cellContent'

  elements :balance_values, '.components-Balance-style-balanceAmount'

  @previousInflowAmount = 0
  @previousOutflowAmount = 0
  @previousBalanceAmount = 0

  def verify_page_loaded
    selected_menu_item.text == 'Budget'
  end

  def input_item (category, derscription, value)
    @previousInflowAmount = balance_values.first.text
    @previousOutflowAmount = balance_values[1].text
    @previousBalanceAmount = balance_values.last.text

    category_options.select category
    description_input.set derscription
    value_input.set value
    add_button.click
  end

  def check_last_added_item (description, value)
    added_items_information[-2].text == description &&
    added_items_information[-1].text == value
  end

  def check_updated_inflow (addedValue)
    (format_amount_as_number(@previousInflowAmount).to_f + addedValue.to_f).round(2) == format_amount_as_number(balance_values.first.text).to_f
  end

  def check_updated_outflow (subtractededValue)
    (format_amount_as_number(@previousOutflowAmount).to_f + subtractededValue.to_f).round(2) == format_amount_as_number(balance_values[1].text).to_f
  end

  def check_updated_balance (updatedValue)
    (format_amount_as_number(@previousBalanceAmount).to_f + updatedValue.to_f).round(2) == format_amount_as_number(balance_values.last.text).to_f
  end

  def format_amount_as_number (amount)
    previousInflowAmountNum = amount.delete '$'
    previousInflowAmountNum.delete ','
  end

end
