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
          image: wall.image_url,
          contributions: wall.contributions.map { |contribution| { user: contribution.user.name, content: contribution.content } }
        }
      end
    }

    render 'main/index'
  end

  def show
    wall = Wall.find(params[:id])

    @app_props = {
      wall: {
        id: wall.id,
        owner: wall.owner.id,
        context: wall.context,
        is_closed: wall.is_closed,
        image: wall.image_url,
        contributions: wall.contributions.map { |contribution| { user: contribution.user.name, content: contribution.content } }
      }
    }

    render 'main/index'
  end

  # def create
  # end
end
