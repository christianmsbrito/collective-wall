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
    wall = Wall.create(
      context: "Once upon a time there was a wall",
      owner: User.find_or_create_by(name: "Test User")
    )
    render json: wall
  end

  # POST /:id/contributions
  def create_contribution
    wall = Wall.find(params[:wall_id])

    if wall
      contribution = wall.paint_contribution(
        params.dig(:contribution, :content), 
        params.dig(:contribution, :user_id)
      )
      render json: contribution
    end
  end

    # GET /:id/contributions
  def contributions_index
    wall = Wall.find(params[:wall_id])

    if wall
        render json: { contributions: wall.contributions }
    else
        render json: {error: "Wall not found"}
    end
  end

  def close_wall
    wall = Wall.find(params[:wall_id])

    if wall
      # wall.finish_painting
      # generate image
      client = OpenAI::Client.new

      wall_digest_prompt = <<~PROMPT
        Analyze the following picture description: "#{wall.painting_prompt}"

        Break down the image description into the following specific topics, and provide your responses in a 1-liner CSV format with each response separated by a semicolon (;):

        {subject} (String) - What is the primary subject or scene depicted in the image? (e.g., "a serene lakeside scene")
        {key_elements} Array<String> - What are the key elements of the subject to focus on? (e.g., "the reflection of the setting sun on the water")
        {color_scheme} (String) - What is the color scheme of the image? (e.g., "warm, golden tones")
        {compositional_qualities} (Array<String>) - What are the desired compositional qualities? (e.g., "balance and harmony")
        {theme} (String) - What is the underlying theme of the image? (e.g., "tranquility and solitude")
        {mood} (String) - What is the specific mood or atmosphere? (e.g., "melancholic")
        {additional_features} (Array<String>) - What additional features or details are included? (e.g., "period clothing")
        {perspective} (String) - What type of perspective is used? (e.g., "two-point perspective")

        Please provide the output as a valid JSON obejct using the keys described above.
      PROMPT

      wall_diggest_response = client.chat(
        parameters: {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: wall_digest_prompt}],
            response_format: { type: "json_object" },
        })
      puts wall_diggest_response.dig("choices", 0, "message", "content")

      wall_diggest_response_json = JSON.parse(wall_diggest_response.dig("choices", 0, "message", "content"))

      # render json: { wall: wall, wall_digest: wall_diggest_response_json }
      
      size = "LARGE"
      subject = wall_diggest_response_json["subject"]
      artistic_style = "Abstract Expressionism, emphasizing spontaneous, automatic, or subconscious creation"
      specific_elements = wall_diggest_response_json["key_elements"]
      color_description = wall_diggest_response_json["color_scheme"]
      desired_compositional_qualities = wall_diggest_response_json["compositional_qualities"]
      medium = "Acrylics and ink on canvas, often mixed media"
      texture_or_effect_description = "textured with rough brush strokes"
      theme = wall_diggest_response_json["theme"]
      specific_mood_or_atmosphere = wall_diggest_response_json["mood"]
      additional_features = wall_diggest_response_json["additional_features"]
      historical_cultural_personal_background = "Contemporary, with roots in mid-20th-century abstract expressionism"
      type_of_perspective = wall_diggest_response_json["perspective"]


      wall_image_prompt = "Create a #{size} image of a #{subject}, styled in #{artistic_style}. The painting should depict [#{specific_elements.join(', ')}], incorporating a color palette of #{color_description}. Aim for a composition that emphasizes [#{desired_compositional_qualities.join(',')}], using #{medium} to achieve a #{texture_or_effect_description}. The artwork should convey the theme of #{theme}, with careful use of light and shadow to enhance #{specific_mood_or_atmosphere}. Include elements of [#{additional_features.join(',')}] to add depth and context, reflecting the #{historical_cultural_personal_background} influences. Ensure the perspective adopts #{type_of_perspective} to realistically represent spatial depth."
    
    #   # Use the prompt in the API call
      response = client.images.generate(parameters: { prompt: wall_image_prompt, quality: "standard" })

    #   # puts prompt
    #   # render json: { prompt: prompt }

      puts response.dig("data", 0, "url")
      render json: { image: response.dig("data", 0, "url"), wall: wall, wall_digest: wall_diggest_response_json }

    #   render json: wall
    # else
    #   render json: {error: "Wall not found"}
    end
  end

  private
  def contribution_params
    params.require(:contribution).permit(:content, :author)
  end
end
