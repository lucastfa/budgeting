require 'capybara/cucumber'
require 'site_prism'
require 'pry'
require 'rspec'
require 'capybara-screenshot/cucumber'

Capybara.javascript_driver = :chrome
Capybara.register_driver :selenium do |app|
  Capybara::Selenium::Driver.new(app, :browser => :chrome)
end
Capybara.default_driver = :selenium
Capybara.page.driver.browser.manage.window.maximize
Capybara.default_max_wait_time = 5
Capybara.save_path = "screenshots"
Capybara::Screenshot.prune_strategy = :keep_last_run
