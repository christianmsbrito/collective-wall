class WallsController < ApplicationController
  def index
    walls = Wall.all

    @app_props = {
      walls: walls.map do |wall|
        {
          id: wall.id,
          owner: wall.owner.id,
          context: wall.context,
          is_closed: wall.is_closed,
          contributions: wall.contributions.map { |contribution| { user: contribution.user.name, content: contribution.content } }
        }
      end
    }

    render 'main/index'
  end

  # def new
  # end

  # def create
  # end
end
