
# Vector Image Finder

A React-based image similarity search application that uses machine learning to find visually similar images. The application leverages Hugging Face Transformers for image processing and Supabase for storage and vector similarity search.

## Features

- **Image Upload**: Users can upload images through drag-and-drop or file selection
- **Real-time Progress**: Visual feedback during image processing and similarity search
- **Similar Image Results**: Displays a grid of visually similar images based on the uploaded image
- **Download Options**: Each similar image can be downloaded with a single click
- **Responsive Design**: Works seamlessly across different screen sizes

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Machine Learning**: Hugging Face Transformers (MobileNetV4)
- **Backend & Storage**: Supabase (PostgreSQL with pgvector)

## Project Structure

- `/src/components/`: React components including ImageUploader, ImagePreview, and ResultGrid
- `/src/lib/`: Utility functions and Supabase client configuration
- `/supabase/`: Supabase functions and database migrations

## Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Notes

- The application uses the `mobilenetv4_conv_small.e2400_r224_in1k` model for generating image embeddings
- Similar images are found using vector similarity search in Supabase with pgvector
- Progress indicators show real-time status during image processing

For detailed setup instructions and configuration, visit the [Lovable documentation](https://docs.lovable.dev/).

