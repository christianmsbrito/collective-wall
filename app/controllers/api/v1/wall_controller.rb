class Api::V1::WallController < ApplicationController
  skip_before_action :verify_authenticity_token
  # GET /:id
  def show
    wall = Wall.find(params[:id])
    render json: wall
  end

  # GET /
  def index
    walls = Wall.all
    render json: walls
  end

  # POST /
  def create
    test_user = User.find_or_create_by(name: "Test User")
    wall = Wall.new(context: "Once uppon a time there was a wall", owner: test_user)
    wall.save
    render json: wall
  end

  # POST /:id/contributions
  def create_contribution
    wall = Wall.find(params[:wall_id])

    if wall
      content, author = params[:contribution][:content], params[:contribution][:user_id]

      wall.paint_contribution(content, author)
      puts wall.inspect
      render json: wall
    end
  end

    # GET /:id/contributions
  def contributions_index
    wall = Wall.find(params[:wall_id])
    if not wall.nil?
        render json: { contributions: wall.contributions }
    else
        render json: {error: "Wall not found"}
    end
  end


  private
  def contribution_params
    params.require(:contribution).permit(:content, :author)
  end
end
