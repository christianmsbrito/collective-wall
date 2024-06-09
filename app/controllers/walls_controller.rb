class WallsController < ApplicationController
  def index
    walls = Wall.all

    @app_props = {
      # wall: { 
      #   id: wall.id, 
      #   owner: wall.owner.id,
      #   context: wall.context,
      #   is_closed: wall.is_closed,
      #   contributions: wall.contributions.map { |contribution| { user: contribution.user.name, content: contribution.content } }
      # }
      walls: [
        {
          wall: {
            id: 1,
            owner: 1,
            context: "Once uppon a time there was a wall",
            is_closed: false,
            contributions: [ { user: 1, content: 'that tests' } ]
          }
        },
        {
          wall: {
            id: 2,
            owner: 1,
            context: "In a small island",
            is_closed: false,
            contributions: [ { user: 1, content: 'that also tests' } ]
          }
        }
      ]
    }

    render 'main/index'
  end

  # def new
  # end

  # def create
  # end
end
