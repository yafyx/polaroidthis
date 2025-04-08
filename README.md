# polaroidthis

polaroidthis is a web application that allows movie enthusiasts to create minimalist movie posters in a Polaroid style.

## Features

- Search for movies using the TMDB API
- Generate minimalist Polaroid-style movie posters with customizable options
- Multiple ways to create posters:
  - Search movies directly by title
  - Paste streaming service URLs (Netflix, Amazon Prime, Disney+, etc.)
  - Manual input for custom creations
- Preview and adjust poster layout and style before downloading
- Download high-quality poster images
- Explore featured and popular movie posters
- Responsive design that works on mobile and desktop

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) 15 (App Router)
- **Frontend:**
  - [React](https://react.dev/) 19
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/) for styling
  - [shadcn/ui](https://ui.shadcn.com/) for UI components
  - [Radix UI](https://www.radix-ui.com/) for accessible components
  - [Framer Motion](https://www.framer.com/motion/) for animations
- **Image Generation:**

  - [html-to-image](https://github.com/bubkoo/html-to-image)

- **External APIs:**
  - [TMDB API](https://www.themoviedb.org/documentation/api) for movie data

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [pnpm](https://pnpm.io/) package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/polaroidthis.git
   cd polaroidthis
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   TMDB_API_KEY=your_tmdb_api_key
   ```

   You'll need to obtain an API key from [The Movie Database (TMDB)](https://www.themoviedb.org/settings/api).

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
pnpm build
pnpm start
```

## Project Structure

- `/app` - Next.js app router pages and API routes
  - `/api` - Backend API endpoints (TMDB data fetching, URL scraping)
  - `/create` - Poster creation pages
  - `/explore` - Explore movies and posters
  - `/about` - About page
- `/components` - React components
  - `/ui` - UI components (shadcn/ui)
  - `/poster-generator` - Poster generation components
- `/lib` - Utility functions and shared code
- `/hooks` - Custom React hooks
- `/public` - Static assets
- `/styles` - Global CSS styles

## API Routes

- `/api/tmdb/*` - TMDB API integration endpoints
- `/api/scrape-title/*` - Movie title scraping from streaming services
- `/api/extract-url/*` - URL processing for direct poster creation

## Deployment

The application can be deployed on Vercel, Netlify, or any other platform that supports Next.js.

## Credits

- This project uses the [TMDB API](https://www.themoviedb.org/documentation/api) but is not endorsed or certified by TMDB.
- UI components from [shadcn/ui](https://ui.shadcn.com/).
- Icons from [Lucide](https://lucide.dev/).

## How to Contribute

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and follow the code style of the project.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Roadmap

- Add user accounts for saving favorite posters
- Implement social sharing features
- Add more poster style templates
- Create gallery features for community-created posters
