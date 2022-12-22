source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.1.2"

gem "activerecord-import"
gem "axios_rails"
gem "bootsnap", require: false
gem "devise"
gem "importmap-rails"
gem "jsonapi-serializer"
gem "pg", "~> 1.1"
gem "puma", "~> 5.0"
gem "pundit", "~> 2.2"
gem "rails", "~> 7.0.4"
gem "sprockets-rails"
gem "sassc-rails"
gem "stimulus-rails"
gem "tailwindcss-rails"
gem "turbo-rails"
gem "tzinfo-data", platforms: %i[ mingw mswin x64_mingw jruby ]
gem "rails_12factor"


# Use Sass to process CSS
# gem "sassc-rails"

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[ mri mingw x64_mingw ]
  gem "factory_bot_rails"
  gem "faker", :git => "https://github.com/faker-ruby/faker.git", :branch => "main"
  gem "pry-rails"
  gem "rspec-rails", "~> 5.1", ">= 5.1.2"
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console"

  # Add speed badges [https://github.com/MiniProfiler/rack-mini-profiler]
  # gem "rack-mini-profiler"

  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  # gem "spring"
end

group :test do
  gem "shoulda-matchers", "~> 5.0"
end
