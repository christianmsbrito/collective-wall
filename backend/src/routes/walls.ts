import express from 'express';
import prisma from '../db';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { CustomRequest } from '..';

const wallsRouter = express.Router();

// GET /
wallsRouter.get('/', async (req, res) => {
  const walls = await prisma.wall.findMany();

  // List all walls
  res.json({
    message: 'List of all walls',
    data: walls,
  });
});

// POST /
wallsRouter.post('/', async (req, res) => {
  const { context } = req.body;

  const createdWall = await prisma.wall.create({
    data: {
      context,
      ownerId: 1,
    },
  });

  res.json({
    message: 'Wall created successfully',
    data: createdWall,
  });
});


wallsRouter.get('/', async (req, res) => {
  const walls = await prisma.wall.findMany();
  res.json(walls);
});

wallsRouter.get('/current', async (req, res) => {
  const wall = await prisma.wall.findFirst({
    where: { isClosed: false },
    select: {
      id: true,
      ownerId: true,
      context: true,
      endTime: true,
      createdAt: true,
      updatedAt: true,
      imageUrl: true,
      isClosed: true,
    },
  });
  res.json(wall);
});


wallsRouter.get('/:id', async (req, res) => {
  const wall = await prisma.wall.findUnique({
    where: { id: parseInt(req.params.id) },
    select: {
      id: true,
      ownerId: true,
      context: true,
      endTime: true,
      createdAt: true,
      updatedAt: true,
      imageUrl: true,
      isClosed: true,
    },
  });
  res.json(wall);
});

wallsRouter.post('/:id/contributions', async (req: CustomRequest, res) => {
  const wall = await prisma.wall.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (wall) {
    const contribution = await prisma.contribution.create({
      data: {
        content: req.body.contribution.content,
        // userId: req.body.contribution.user_id,
        userId: req.user.userId,
        wallId: wall.id,
      },
    });
    res.json(contribution);
  } else {
    res.status(404).json({ error: 'Wall not found' });
  }
});

wallsRouter.get('/:id/contributions', async (req, res) => {
  const wall = await prisma.wall.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { contributions: true },
  });

  if (wall) {
    res.json({ contributions: wall.contributions });
  } else {
    res.status(404).json({ error: 'Wall not found' });
  }
});

wallsRouter.post('/:id/close', async (req, res) => {
  const wall = await prisma.wall.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      contributions: {
        select: { content: true } // Select only the 'content' field
      },
    },
  });

  if (wall) {
    const paintingPrompt = wall.context + ' ' + wall.contributions.map(c => c.content).join(' ');

    const wallDigestResponse = await generateWallDigest(paintingPrompt);
    const artist = createTestArtist();
    const wallImagePrompt = generateWallImagePrompt(wallDigestResponse, artist);

    const client = new ReplicateClient();
    const imageUrl = await generateWallImage(client, wallImagePrompt);

    const imagePath = path.join(__dirname, '..', '..', '..', 'frontend', 'public', 'images', `${wall.id}.jpg`);
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    
    fs.writeFileSync(imagePath, imageResponse.data);

    const localImageUrl = `/images/${wall.id}.jpg`;
    await prisma.wall.update({
      where: { id: wall.id },
      data: { imageUrl: localImageUrl, isClosed: true },
    });

    res.json({
      wall,
      wallDigest: wallDigestResponse,
      image: localImageUrl,
    });
  } else {
    res.status(404).json({ error: 'Wall not found' });
  }
});

const generateWallDigest = async (paintingPrompt: String) => {
  // const client = new OpenAIClient();
  const wallDigestPrompt = `
      Analyze the following picture description: "${paintingPrompt}"

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
      - Provide the output as a valid JSON object using the keys described above.
    `;

  // const wallDigestResponse = await client.chat({
  //   model: 'gpt-3.5-turbo',
  //   messages: [{ role: 'user', content: wallDigestPrompt }],
  //   response_format: { type: 'json_object' },
  // });

  // return JSON.parse(wallDigestResponse.choices[0].message.content);

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      // model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: wallDigestPrompt,
        },
      ],
    },
    {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  console.log('response.data.choices[0].message.content', response.data.choices[0].message.content);
  

  return JSON.parse(response.data.choices[0].message.content);
};

const createTestArtist = () => {
  // return new Artist(
  //   'Sophia Bell',
  //   'Realism, focusing on meticulous detail and accuracy',
  //   'Watercolor and graphite for subtle shading and detail',
  //   'Careful arrangement with a focus on depth using perspective techniques',
  //   'Draws influence from both contemporary urban scenes and historical realism'
  // );

  // return new Artist(
  //   'Alex Turner',
  //   'Impressionism, focusing on capturing light and movement',
  //   'Oil paints for vibrant colors and texture',
  //   'Loose brushwork with an emphasis on light and atmosphere',
  //   'Inspired by the works of Monet and Renoir, with a modern twist'
  // );

  // return new Artist(
  //   'Hiroshi Tanaka',
  //   'Manga, focusing on dynamic characters and expressive emotions',
  //   'Ink and digital tools for crisp lines and vibrant colors',
  //   'Strong emphasis on character poses and facial expressions',
  //   'Inspired by both classic and contemporary manga artists, blending traditional techniques with modern storytelling'
  // );

  // return new Artist(
  //   'Jordan Smith',
  //   'Abstract, focusing on shapes and colors rather than realistic depictions',
  //   'Acrylic paints for bold and vibrant colors',
  //   'Dynamic compositions with a focus on balance and contrast',
  //   'Inspired by modern abstract artists, blending geometric and organic forms'
  // );

  return new Artist(
    'Mika Chan',
    'Cartoonish, focusing on exaggerated features and playful expressions',
    'Digital tools for clean lines and vibrant colors',
    'Simple compositions with a focus on character interactions',
    'Inspired by modern cartoons and minimalistic design, using no more than 3 colors'
  );
};

const generateWallImagePrompt = (wallDigestResponse: any, artist: Artist) => {
  console.log('Wall Digest Response:', wallDigestResponse);

  const size = 'LARGE';
  const subject = wallDigestResponse.subject;
  const artisticStyle = artist.style;
  const specificElements = wallDigestResponse.key_elements;
  const colorDescription = wallDigestResponse.color_scheme;
  const desiredCompositionalQualities = wallDigestResponse.compositional_qualities;
  const medium = artist.medium;
  const textureOrEffectDescription = artist.composition;
  const theme = wallDigestResponse.theme;
  const specificMoodOrAtmosphere = wallDigestResponse.mood;
  const additionalFeatures = wallDigestResponse.additional_features;
  const historicalCulturalPersonalBackground = artist.background;
  const typeOfPerspective = wallDigestResponse.perspective;

  return `Create a ${size} image of a ${subject}, styled in ${artisticStyle}. The painting should depict [${specificElements.join(', ')}], incorporating a color palette of ${colorDescription}. Aim for a composition that emphasizes [${desiredCompositionalQualities.join(',')}], using ${medium} to achieve a ${textureOrEffectDescription}. The artwork should convey the theme of ${theme}, with careful use of light and shadow to enhance ${specificMoodOrAtmosphere}. Include elements of [${additionalFeatures.join(',')}] to add depth and context, reflecting the ${historicalCulturalPersonalBackground} influences. Ensure the perspective adopts ${typeOfPerspective} to realistically represent spatial depth.`;
};

const generateWallImage = async (client: ImageGenClient, wallImagePrompt: string) => {
  // const client = new OpenAIClient();
  const response = await client.generate({ prompt: wallImagePrompt });
  return response.url;
}

interface ImageResponse {
  url: string;
}

interface ImageGenClient {
  generate: (options: { prompt: string }) => Promise<ImageResponse>;
}

class ReplicateClient implements ImageGenClient {
  async generate(options: { prompt: string }) {
    const TOKEN = process.env.REPLICATE_API_KEY;
    const response = await axios.post(
      'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions',
      {
        input: {
          prompt: options.prompt,
          go_fast: true,
          num_outputs: 1,
          aspect_ratio: '1:1',
          output_format: 'jpg',
          output_quality: 80,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );


    console.log('Response:', response.data);
    let predictionResponse = response.data as ReplicatePredictionResponse;

    console.log('predictionResponse.status:', predictionResponse.status);
    while (predictionResponse.status !== 'succeeded') {
      console.log('predictionResponse.status:', predictionResponse.status);
      const response = await axios.get(predictionResponse.urls.get, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
        },
      });
      predictionResponse = response.data as ReplicatePredictionResponse;
      console.log('GET Response:', response.data);
    }


    return { url: predictionResponse.output[0] as string };
  }
}


// const generateWallImage = async (wallImagePrompt) => {
//     try {
//         const client = new OpenAIClient();
//         const response = await client.images.generate({ prompt: wallImagePrompt, quality: 'hd' });
//         return response.data[0].url;
//     } catch (error) {
//         if (error.response && error.response.status === 400) {
//             return handleBadRequestError(error, wallImagePrompt);
//         } else {
//             console.error('Error generating image:', error);
//         }
//     }
// };

// const handleBadRequestError = async (error, wallImagePrompt) => {
//     const errorMessage = error.response.data.error.message;

//     if (/Prompt must be length \d+ or less/.test(errorMessage)) {
//         const newPrompt = await generateNewPrompt(wallImagePrompt, errorMessage);
//         return generateWallImage(newPrompt);
//     }
// };
const generateNewPrompt = async (originalImagePrompt: string, errorMessage: string) => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `
            Given the following prompt for generating an image below that exceeds the max length, make it a little shorter - try to keep it close to boundary max length - to fit the limits described in the error.

            - Current Prompt: "${originalImagePrompt}"

            - Error Message: "${errorMessage}"

            Your output should be a revised prompt that is shorter in length but still conveys the same information.
          `,
        },
      ],
    },
    {
      headers: {
        'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content;
};

class Artist {
  name: string;
  style: string;
  medium: string;
  composition: string;
  background: string;

  constructor(name: string, style: string, medium: string, composition: string, background: string) {
    this.name = name;
    this.style = style;
    this.medium = medium;
    this.composition = composition;
    this.background = background;
  }
}

export interface ReplicatePredictionResponse {
    completed_at: Date;
    created_at:   Date;
    data_removed: boolean;
    error:        null;
    id:           string;
    input:        Input;
    logs:         string;
    metrics:      Metrics;
    output:       string[];
    started_at:   Date;
    status:       string;
    urls:         Urls;
    version:      string;
}

export interface Input {
    prompt:         string;
    go_fast:        boolean;
    num_outputs:    number;
    aspect_ratio:   string;
    output_format:  string;
    output_quality: number;
}

export interface Metrics {
    image_count:  number;
    predict_time: number;
    total_time:   number;
}

export interface Urls {
    get:    string;
    cancel: string;
}

export default wallsRouter;