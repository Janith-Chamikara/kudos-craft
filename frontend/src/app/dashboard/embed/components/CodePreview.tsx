import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodePreviewProps {
  style: string;
  framework: string;
}

export function CodePreview({ style, framework }: CodePreviewProps) {
  const getCode = () => {
    switch (style) {
      case 'carousel':
        return framework === 'nextjs' ? carouselNextJsCode : carouselHtmlCode;
      case 'grid':
        return framework === 'nextjs' ? gridNextJsCode : gridHtmlCode;
      case 'cards':
        return framework === 'nextjs' ? cardsNextJsCode : cardsHtmlCode;
      case 'quotes':
        return framework === 'nextjs' ? quotesNextJsCode : quotesHtmlCode;
      default:
        return '';
    }
  };

  return (
    <div className="rounded-md overflow-hidden">
      <SyntaxHighlighter
        language={framework === 'nextjs' ? 'jsx' : 'html'}
        style={tomorrow}
      >
        {getCode()}
      </SyntaxHighlighter>
    </div>
  );
}
const cardsNextJsCode = `
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Testimonial {
  id: number
  author: string
  content: string
}

interface CardTestimonialsProps {
  testimonials: Testimonial[]
}

export function CardTestimonials({ testimonials }: CardTestimonialsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id}>
          <CardHeader>
            <CardTitle>{testimonial.author}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{testimonial.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
`;

const cardsHtmlCode = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Card Testimonials</title>
  <style>
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      overflow: hidden;
    }
    .card-header {
      background-color: #f7fafc;
      padding: 1rem;
    }
    .card-title {
      font-size: 1.25rem;
      font-weight: bold;
    }
    .card-content {
      padding: 1rem;
    }
  </style>
</head>
<body>
  <div class="grid">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">John Doe</h3>
      </div>
      <div class="card-content">
        <p>This product is amazing! It has completely transformed my workflow.</p>
      </div>
    </div>
    <!-- Add more card testimonials here -->
  </div>
</body>
</html>
`;

const quotesNextJsCode = `
interface Testimonial {
  id: number
  author: string
  content: string
}

interface QuoteTestimonialsProps {
  testimonials: Testimonial[]
}

export function QuoteTestimonials({ testimonials }: QuoteTestimonialsProps) {
  return (
    <div className="space-y-8">
      {testimonials.map((testimonial) => (
        <blockquote key={testimonial.id} className="italic border-l-4 border-gray-300 pl-4">
          <p className="mb-2">{testimonial.content}</p>
          <footer className="text-right">— <cite>{testimonial.author}</cite></footer>
        </blockquote>
      ))}
    </div>
  )
}
`;

const quotesHtmlCode = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quote Testimonials</title>
  <style>
    .testimonials {
      max-width: 800px;
      margin: 0 auto;
    }
    blockquote {
      margin: 0 0 1.5rem;
      padding-left: 1rem;
      border-left: 4px solid #cbd5e0;
      font-style: italic;
    }
    cite {
      display: block;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="testimonials">
    <blockquote>
      <p>This product is amazing! It has completely transformed my workflow.</p>
      <footer>— <cite>John Doe</cite></footer>
    </blockquote>
    <!-- Add more quote testimonials here -->
  </div>
</body>
</html>
`;

const carouselNextJsCode = `
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function InfiniteCarousel({ testimonials }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const scrollWidth = container.scrollWidth
    const animateScroll = () => {
      if (container.scrollLeft >= scrollWidth / 2) {
        container.scrollLeft = 0
      } else {
        container.scrollLeft += 1
      }
    }
    const animationId = setInterval(animateScroll, 50)
    return () => clearInterval(animationId)
  }, [])

  return (
    <div className="overflow-hidden" ref={containerRef}>
      <motion.div className="flex">
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <div key={index} className="flex-shrink-0 w-64 p-4 bg-white shadow-md rounded-md mx-2">
            <p className="text-gray-600">{testimonial.content}</p>
            <p className="mt-2 font-bold">{testimonial.author}</p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
`;

const carouselHtmlCode = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Infinite Carousel</title>
  <style>
    .carousel-container {
      overflow: hidden;
      width: 100%;
    }
    .carousel {
      display: flex;
      animation: scroll 30s linear infinite;
    }
    .testimonial {
      flex-shrink: 0;
      width: 300px;
      padding: 1rem;
      background-color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-radius: 0.375rem;
      margin: 0 0.5rem;
    }
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  </style>
</head>
<body>
  <div class="carousel-container">
    <div class="carousel">
      <div class="testimonial">
        <p>This product is amazing! It has completely transformed my workflow.</p>
        <p><strong>John Doe</strong></p>
      </div>
      <div class="testimonial">
        <p>I cannot recommend this service enough. The team is incredibly responsive and helpful.</p>
        <p><strong>Jane Smith</strong></p>
      </div>
      <!-- Add more testimonials here -->
    </div>
  </div>
</body>
</html>
`;

const gridNextJsCode = `
export function GridLayout({ testimonials }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="bg-white p-4 rounded-md shadow-md">
          <p className="text-gray-600">{testimonial.content}</p>
          <p className="mt-2 font-bold">{testimonial.author}</p>
        </div>
      ))}
    </div>
  )
}
`;

const gridHtmlCode = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Testimonial Grid Layout</title>
  <style>
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }
    .testimonial {
      background-color: white;
      padding: 1rem;
      border-radius: 0.375rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  <div class="grid-container">
    <div class="testimonial">
      <p>This product is amazing! It has completely transformed my workflow.</p>
      <p><strong>John Doe</strong></p>
    </div>
    <div class="testimonial">
      <p>I cannot recommend this service enough. The team is incredibly responsive and helpful.</p>
      <p><strong>Jane Smith</strong></p>
    </div>
    <!-- Add more testimonials here -->
  </div>
</body>
</html>
`;
