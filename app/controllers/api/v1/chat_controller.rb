require "openai"

class Api::V1::ChatController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    # message = params[:message]

    # puts message
    # Process the message and perform any necessary actions
    # ...

    # Fetch current prompt    
    render json: { message: "Message sent successfully" }
  end


  def create
    
    client = OpenAI::Client.new
    
    # response = client.chat(
    #   parameters: {
    #     model: "gpt-3.5-turbo", # Required.
    #     messages: [{ role: "user", content: "Describe a character called Anna!"}], # Required.
    #     temperature: 0.7,
    #     stream: proc do |chunk, _bytesize|
    #       print chunk.dig("choices", 0, "delta", "content")
    #     end
    #   })
    
    # render json: response
    
    # response = client.images.generate(parameters: { prompt: 'Create a LARGE image of a desert landscape, styled in realism. The painting should depict [lizard, arid terrain, blazing sun], incorporating a color palette of [earthy tones, intense sunlight]. Aim for a composition that emphasizes harsh and barren environment, using acrylic paint to achieve a textured with rough brush strokes. The artwork should convey the theme of "search for meaning", with careful use of light and shadow to enhance "reflective and contemplative". Include elements of [ripples in the sand, distant mountains] to add depth and context, reflecting the "cultural reference to desert-dwelling reptiles" influences. Ensure the perspective adopts ground-level perspective to realistically represent spatial depth.'  , quality: "standard" })
    # puts response.dig("data", 0, "url")
    # "Create a {size} image of a {subject}, styled in {artistic style}. The painting should depict {specific elements of the subject}, incorporating a color palette of {color description}. Aim for a composition that emphasizes {desired compositional qualities}, using {medium} to achieve a {texture or effect description}. The artwork should convey the theme of {theme}, with careful use of light and shadow to enhance {specific mood or atmosphere}. Include elements of {additional features} to add depth and context, reflecting the {historical/cultural/personal background} influences. Ensure the perspective adopts {type of perspective} to realistically represent spatial depth."
  
    # Define variables for populating the prompt
    # size = "LARGE"
    # subject = "desert landscape"
    # artistic_style = "realism"
    # specific_elements = "[lizard, arid terrain, blazing sun]"
    # color_description = "[earthy tones, intense sunlight]"
    # desired_compositional_qualities = "harsh and barren environment"
    # medium = "acrylic paint"
    # texture_or_effect_description = "textured with rough brush strokes"
    # theme = "search for meaning"
    # specific_mood_or_atmosphere = "reflective and contemplative"
    # additional_features = "[ripples in the sand, distant mountains]"
    # historical_cultural_personal_background = "cultural reference to desert-dwelling reptiles"
    # type_of_perspective = "ground-level perspective"

    # Artist 1: Elena Rodriguez
    # Style: Impressionism, with a focus on light and color rather than detail.
    # Theme: Nature and tranquility.
    # Medium: Oil paint, known for its rich texture and vibrant colors.
    # Composition: Prefers balanced compositions with an emphasis on horizontal lines to evoke calmness.
    # Historical Context: Modern, with influences from early 20th-century impressionists.

    # https://oaidalleapiprodscus.blob.core.windows.net/private/org-t5m4QHgOMY1w92dBNMrKWmYK/user-rgzvizsDnG3RHmFDFiFl0Aco/img-WMd2YbenL8keNmUlW3LFUu04.png?st=2024-04-25T02%3A04%3A24Z&se=2024-04-25T04%3A04%3A24Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-04-24T19%3A09%3A16Z&ske=2024-04-25T19%3A09%3A16Z&sks=b&skv=2021-08-06&sig=siqbtQkhqK5FsZVtuVarfeY1DeJYmNhLtxQrZaqmYeU%3D

    # size = "LARGE"
    # subject = "desert landscape"
    # artistic_style = "Impressionism, with a focus on light and color rather than detail"
    # specific_elements = "[lizard, arid terrain, blazing sun]"
    # color_description = "[earthy tones, intense sunlight]"
    # desired_compositional_qualities = "balanced with an emphasis on horizontal lines to evoke calmness"
    # medium = "Oil paint, known for its rich texture and vibrant colors"
    # texture_or_effect_description = "textured with rough brush strokes"
    # theme = "search for meaning"
    # specific_mood_or_atmosphere = "reflective and contemplative"
    # additional_features = "[ripples in the sand, distant mountains]"
    # historical_cultural_personal_background = "Modern, with influences from early 20th-century impressionists"
    # type_of_perspective = "ground-level perspective"

    # Artist 2: Marco Chen
    # Style: Abstract Expressionism, emphasizing spontaneous, automatic, or subconscious creation.
    # Theme: Emotions and abstract concepts like chaos and harmony.
    # Medium: Acrylics and ink on canvas, often mixed media.
    # Composition: Dynamic, with an emphasis on bold strokes and irregular forms.
    # Historical Context: Contemporary, with roots in mid-20th-century abstract expressionism.

    size = "LARGE"
    subject = "desert landscape"
    artistic_style = "Abstract Expressionism, emphasizing spontaneous, automatic, or subconscious creation"
    specific_elements = "[lizard, arid terrain, blazing sun]"
    color_description = "[earthy tones, intense sunlight]"
    desired_compositional_qualities = "Dynamic, with an emphasis on bold strokes and irregular forms"
    medium = "Acrylics and ink on canvas, often mixed media"
    texture_or_effect_description = "textured with rough brush strokes"
    theme = "search for meaning"
    specific_mood_or_atmosphere = "reflective and contemplative"
    additional_features = "[ripples in the sand, distant mountains]"
    historical_cultural_personal_background = "Contemporary, with roots in mid-20th-century abstract expressionism"
    type_of_perspective = "ground-level perspective"

    # Artist 3: Sophia Bell
    # Style: Realism, focusing on meticulous detail and accuracy.
    # Theme: Urban life and its complexities.
    # Medium: Watercolor and graphite for subtle shading and detail.
    # Composition: Careful arrangement with a focus on depth using perspective techniques.
    # Historical Context: Draws influence from both contemporary urban scenes and historical realism.

    # size = "LARGE"
    # subject = "desert landscape"
    # artistic_style = ""
    # specific_elements = "[lizard, arid terrain, blazing sun]"
    # color_description = "[earthy tones, intense sunlight]"
    # desired_compositional_qualities = ""
    # medium = ""
    # texture_or_effect_description = "textured with rough brush strokes"
    # theme = "search for meaning"
    # specific_mood_or_atmosphere = "reflective and contemplative"
    # additional_features = "[ripples in the sand, distant mountains]"
    # historical_cultural_personal_background = ""
    # type_of_perspective = "ground-level perspective"
    
    # Use the variables in the prompt
    prompt = "Create a #{size} image of a #{subject}, styled in #{artistic_style}. The painting should depict #{specific_elements}, incorporating a color palette of #{color_description}. Aim for a composition that emphasizes #{desired_compositional_qualities}, using #{medium} to achieve a #{texture_or_effect_description}. The artwork should convey the theme of #{theme}, with careful use of light and shadow to enhance #{specific_mood_or_atmosphere}. Include elements of #{additional_features} to add depth and context, reflecting the #{historical_cultural_personal_background} influences. Ensure the perspective adopts #{type_of_perspective} to realistically represent spatial depth."
    
    # Use the prompt in the API call
    response = client.images.generate(parameters: { prompt: prompt, quality: "standard" })

    # puts prompt
    # render json: { prompt: prompt }

    puts response.dig("data", 0, "url")
    render json: response
  end
end
