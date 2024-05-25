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
      context: "In a galaxy far far away...",
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

          # Artist 1: Elena Rodriguez
    # Style: Impressionism, with a focus on light and color rather than detail.
    # Theme: Nature and tranquility.
    # Medium: Oil paint, known for its rich texture and vibrant colors.
    # Composition: Prefers balanced compositions with an emphasis on horizontal lines to evoke calmness.
    # Historical Context: Modern, with influences from early 20th-century impressionists.

    # artist = TestArtist.new(
    #   "Elena Rodriguez",
    #   "Impressionism, with a focus on light and color rather than detail",
    #   "Oil paint, known for its rich texture and vibrant colors",
    #   "Prefers balanced compositions with an emphasis on horizontal lines to evoke calmness",
    #   "Modern, with influences from early 20th-century impressionists"
    # )

      # Artist 3: Sophia Bell
      # Style: Realism, focusing on meticulous detail and accuracy.
      # Theme: Urban life and its complexities.
      # Medium: Watercolor and graphite for subtle shading and detail.
      # Composition: Careful arrangement with a focus on depth using perspective techniques.
      # Historical Context: Draws influence from both contemporary urban scenes and historical realism.

      artist = TestArtist.new(
        "Sophia Bell", 
        "Realism, focusing on meticulous detail and accuracy",
        "Watercolor and graphite for subtle shading and detail", 
        "Careful arrangement with a focus on depth using perspective techniques",
        "Draws influence from both contemporary urban scenes and historical realism"
      )

          # Artist 2: Marco Chen
    # Style: Abstract Expressionism, emphasizing spontaneous, automatic, or subconscious creation.
    # Theme: Emotions and abstract concepts like chaos and harmony.
    # Medium: Acrylics and ink on canvas, often mixed media.
    # Composition: Dynamic, with an emphasis on bold strokes and irregular forms.
    # Historical Context: Contemporary, with roots in mid-20th-century abstract expressionism.


      # artist = TestArtist.new(
      #   "Marco Chen", 
      #   "Abstract Expressionism, emphasizing spontaneous, automatic, or subconscious creation",
      #   "Acrylics and ink on canvas, often mixed media", 
      #   "Dynamic, with an emphasis on bold strokes and irregular forms",
      #   "Contemporary, with roots in mid-20th-century abstract expressionism"
      # )


      # artist = TestArtist.new(
      #   "Takaro Nozomi", 
      #   "Manga, focusing on meticulous detail and accuracy",
      #   "Nanquim and digital for subtle shading and detail", 
      #   "Careful arrangement with a focus on depth using perspective techniques",
      #   "Draws influence from both contemporary urban scenes and historical realism"
      # )

      size = "LARGE"
      subject = wall_diggest_response_json["subject"]
      artistic_style = artist.style
      specific_elements = wall_diggest_response_json["key_elements"]
      color_description = wall_diggest_response_json["color_scheme"]
      desired_compositional_qualities = wall_diggest_response_json["compositional_qualities"]
      medium = artist.medium
      texture_or_effect_description = artist.composition
      theme = wall_diggest_response_json["theme"]
      specific_mood_or_atmosphere = wall_diggest_response_json["mood"]
      additional_features = wall_diggest_response_json["additional_features"]
      historical_cultural_personal_background = artist.background
      type_of_perspective = wall_diggest_response_json["perspective"]


      wall_image_prompt = "Create a #{size} image of a #{subject}, styled in #{artistic_style}. The painting should depict [#{specific_elements.join(', ')}], incorporating a color palette of #{color_description}. Aim for a composition that emphasizes [#{desired_compositional_qualities.join(',')}], using #{medium} to achieve a #{texture_or_effect_description}. The artwork should convey the theme of #{theme}, with careful use of light and shadow to enhance #{specific_mood_or_atmosphere}. Include elements of [#{additional_features.join(',')}] to add depth and context, reflecting the #{historical_cultural_personal_background} influences. Ensure the perspective adopts #{type_of_perspective} to realistically represent spatial depth."
    
      puts wall_image_prompt
    #   # Use the prompt in the API call
      response = client.images.generate(parameters: { prompt: wall_image_prompt, quality: "standard" })

    #   # puts prompt
    #   # render json: { prompt: prompt }

      # puts response.dig("data", 0, "url")
      render json: {
        image: response.dig("data", 0, "url"),
        # image: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-t5m4QHgOMY1w92dBNMrKWmYK/user-rgzvizsDnG3RHmFDFiFl0Aco/img-iRRUMkImc4nUkTigka3tbc41.png?st=2024-05-25T03%3A05%3A09Z&se=2024-05-25T05%3A05%3A09Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-05-24T21%3A21%3A56Z&ske=2024-05-25T21%3A21%3A56Z&sks=b&skv=2021-08-06&sig=SogWXIeZUcdwTcVbPm7T/svwolaL8jyCr%2BTqZyiQjGg%3D",
        wall: wall,
        wall_digest: wall_diggest_response_json
      }

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
