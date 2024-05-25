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
      context: params[:context],
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
      wall_digest_response = generate_wall_digest(wall.painting_prompt)
      wall_digest_response_json = JSON.parse(wall_digest_response)
      artist = create_test_artist
      puts "wall_digest_response_json:", wall_digest_response_json
      wall_image_prompt = generate_wall_image_prompt(wall_digest_response_json, artist)
      puts "wall_image_prompt:", wall_image_prompt
      image_url = generate_wall_image(wall_image_prompt)
      render json: {
        wall: wall,
        wall_digest: wall_digest_response_json,
        image: image_url
      }
    end
  end

  private

  def generate_wall_digest(painting_prompt)
    client = OpenAI::Client.new
    wall_digest_prompt = <<~PROMPT
      Analyze the following picture description: "#{painting_prompt}"

      Break down the image description into the following specific topics:

      {subject} (String) - What is the primary subject or scene depicted in the image? (e.g., "a serene lakeside scene")
      {key_elements} Array<String> - What are the key elements of the subject to focus on? (e.g., "the reflection of the setting sun on the water")
      {color_scheme} (String) - What is the color scheme of the image? (e.g., "warm, golden tones")
      {compositional_qualities} (Array<String>) - What are the desired compositional qualities? (e.g., "balance and harmony")
      {theme} (String) - What is the underlying theme of the image? (e.g., "tranquility and solitude")
      {mood} (String) - What is the specific mood or atmosphere? (e.g., "melancholic")
      {additional_features} (Array<String>) - What additional features or details are included? (e.g., "period clothing")
      {perspective} (String) - What type of perspective is used? (e.g., "two-point perspective")

      - Make sure to be detailed on each topic for better accuracy. 
      - Provide the output as a valid JSON obejct using the keys described above.
    PROMPT

    wall_digest_response = client.chat(
      parameters: {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: wall_digest_prompt }],
        response_format: { type: "json_object" },
      }
    )
    wall_digest_response.dig("choices", 0, "message", "content")
  end

  def create_test_artist
    TestArtist.new(
      "Takaro Nozomi",
      "Manga, focusing on meticulous detail and accuracy",
      "Nanquim and digital for subtle shading and detail",
      "Careful arrangement with a focus on depth using perspective techniques",
      "Draws influence from both contemporary urban scenes and historical realism"
    )
  end

  def generate_wall_image_prompt(wall_digest_response_json, artist)
    size = "LARGE"
    subject = wall_digest_response_json["subject"]
    artistic_style = artist.style
    specific_elements = wall_digest_response_json["key_elements"]
    color_description = wall_digest_response_json["color_scheme"]
    desired_compositional_qualities = wall_digest_response_json["compositional_qualities"]
    medium = artist.medium
    texture_or_effect_description = artist.composition
    theme = wall_digest_response_json["theme"]
    specific_mood_or_atmosphere = wall_digest_response_json["mood"]
    additional_features = wall_digest_response_json["additional_features"]
    historical_cultural_personal_background = artist.background
    type_of_perspective = wall_digest_response_json["perspective"]

    "Create a #{size} image of a #{subject}, styled in #{artistic_style}. The painting should depict [#{specific_elements.join(', ')}], incorporating a color palette of #{color_description}. Aim for a composition that emphasizes [#{desired_compositional_qualities.join(',')}], using #{medium} to achieve a #{texture_or_effect_description}. The artwork should convey the theme of #{theme}, with careful use of light and shadow to enhance #{specific_mood_or_atmosphere}. Include elements of [#{additional_features.join(',')}] to add depth and context, reflecting the #{historical_cultural_personal_background} influences. Ensure the perspective adopts #{type_of_perspective} to realistically represent spatial depth."
  end

  def generate_wall_image(wall_image_prompt)
    begin
      client = OpenAI::Client.new
      response = client.images.generate(parameters: { prompt: wall_image_prompt, quality: "hd" })
      puts "response >", response
      response.dig("data", 0, "url")
    rescue Faraday::BadRequestError => e
      handle_bad_request_error(e, wall_image_prompt)
    rescue StandardError => e
      puts "Error generating image: #{e.inspect}"
    end
  end

  private

  def handle_bad_request_error(error, wall_image_prompt)
    error_message = error.response[:body]['error']['message']

    if error_message =~ /Prompt must be length \d+ or less/
      new_prompt = generate_new_prompt(wall_image_prompt, error)
      puts "New prompt generated: #{new_prompt}"
      generate_wall_image(new_prompt)
    end
  end

  def generate_new_prompt(original_image_prompt, error_message)
    client = OpenAI::Client.new
    response = client.chat(
      parameters: {
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: <<~PROMPT
            Given the following prompt for generating an image below. Make adjusts to it to address the error message described.

            - Current Prompt: "#{original_image_prompt}"

            - Error Message: "#{error_message}"
          PROMPT
        }],
      }
    )
    response.dig("choices", 0, "message", "content")
  end

  private
  def contribution_params
    params.require(:contribution).permit(:content, :author)
  end
end

class TestArtist
  attr_accessor :name, :style, :theme, :medium, :composition, :background

  def initialize(name, style, medium, composition, background)
    @name = name
    @style = style
    @medium = medium
    @composition = composition
    @background = background
  end
end
