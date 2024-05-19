class HomepageController < ApplicationController
  def index
    test_user = User.find_or_create_by(name: "Test User")

    if test_user
      # @wall = Wall.new(context: "Once uppon a time there was a wall", owner: test_user)
      @wall = Wall.find_by(created_at: Date.today.beginning_of_day..Date.today.end_of_day)

      # @wall.paint_contribution(Contribution.new(test_user, "meu"))
      # @wall.paint_contribution(Contribution.new(test_user, "cacete"))
  
      # puts @wall.contributions

      puts @wall.inspect

      # @wall.save
      # @app_props = { some_key: "test app data", contributions: @wall.contributions.map { |contribution| { user: contribution.user.name, word: contribution.word } } }
    else
      puts test_user.errors.full_messages
    end
  end

  def self.new_wall
    test_user = User.find_or_create_by(name: "Test User")
    if test_user
      @wall = Wall.new(context: "Once uppon a time there was a wall", owner: test_user)
      puts @wall.inspect
    else
      puts test_user.errors.full_messages
    end
  end
end


# class Contribution
#   attr_reader :user, :word

#   def initialize(user, word)
#     @user = user
#     @word = word
#     @timestamp = Time.now
#   end
# end