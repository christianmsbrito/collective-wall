# Dockerfile for Rails Backend

# Use an official Ruby runtime as a parent image
FROM ruby:3.1.4

# Set environment variables
ENV RAILS_ENV=production
ENV RAILS_LOG_TO_STDOUT=true

# Install dependencies
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client

# Set the working directory
WORKDIR /app

# Copy the Gemfile and Gemfile.lock
COPY Gemfile* ./

# Install Gems
RUN bundle install

# Copy the rest of the application code
COPY . .

# Precompile assets
RUN bundle exec rake assets:precompile

# Expose the port
EXPOSE 3000

# Start the Rails server
CMD ["rails", "server", "-b", "0.0.0.0"]
