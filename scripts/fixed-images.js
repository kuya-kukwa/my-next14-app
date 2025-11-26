/**
 * Fixed Image URLs for Broken Movie Posters
 * 
 * This file contains updated TMDB poster paths for the 9 movies
 * that were returning 404 errors. These can be used to update
 * the seed-movies.js script.
 * 
 * To apply these fixes:
 * 1. Update the corresponding entries in scripts/seed-movies.js
 * 2. Run: node scripts/seed-movies.js
 * 3. Verify: node scripts/validate-images.js
 */

module.exports = {
  fixedImages: {
    // ID 18: Gravity (2013)
    "18": {
      title: "Gravity",
      image: "https://image.tmdb.org/t/p/w500/uZSmmIargwBbYqC2iWWJHI8aFrA.jpg",
      thumbnail: "https://image.tmdb.org/t/p/w300/uZSmmIargwBbYqC2iWWJHI8aFrA.jpg",
    },
    
    // ID 19: Edge of Tomorrow (2014)
    "19": {
      title: "Edge of Tomorrow",
      image: "https://image.tmdb.org/t/p/w500/3bHNWPecQWHLzJ7fPOkx5tCHBqc.jpg",
      thumbnail: "https://image.tmdb.org/t/p/w300/3bHNWPecQWHLzJ7fPOkx5tCHBqc.jpg",
    },
    
    // ID 23: The Raid (2011)
    "23": {
      title: "The Raid",
      image: "https://image.tmdb.org/t/p/w500/cBJyM4EWrT0RXEi0hYlLaDbUEaW.jpg",
      thumbnail: "https://image.tmdb.org/t/p/w300/cBJyM4EWrT0RXEi0hYlLaDbUEaW.jpg",
    },
    
    // ID 24: The Bourne Ultimatum (2007)
    "24": {
      title: "The Bourne Ultimatum",
      image: "https://image.tmdb.org/t/p/w500/pMw89I5XcZYF0M9fMxPTqJPcaVj.jpg",
      thumbnail: "https://image.tmdb.org/t/p/w300/pMw89I5XcZYF0M9fMxPTqJPcaVj.jpg",
    },
    
    // ID 26: Casino Royale (2006)
    "26": {
      title: "Casino Royale",
      image: "https://image.tmdb.org/t/p/w500/lMrxYKJhsGQCZha4L0YMfiaq22r.jpg",
      thumbnail: "https://image.tmdb.org/t/p/w300/lMrxYKJhsGQCZha4L0YMfiaq22r.jpg",
    },
    
    // ID 37: Before Sunrise (1995)
    "37": {
      title: "Before Sunrise",
      image: "https://image.tmdb.org/t/p/w500/w9FqlNwyvdsjzsBx8cK0IZmHPDn.jpg",
      thumbnail: "https://image.tmdb.org/t/p/w300/w9FqlNwyvdsjzsBx8cK0IZmHPDn.jpg",
    },
    
    // ID 38: Call Me by Your Name (2017)
    "38": {
      title: "Call Me by Your Name",
      image: "https://image.tmdb.org/t/p/w500/nPTjj6ZfBXXBwOhd7iUy6tyuKWt.jpg",
      thumbnail: "https://image.tmdb.org/t/p/w300/nPTjj6ZfBXXBwOhd7iUy6tyuKWt.jpg",
    },
    
    // ID 40: Roman Holiday (1953)
    "40": {
      title: "Roman Holiday",
      image: "https://image.tmdb.org/t/p/w500/6NJnWvDJ5Z2RWLbPCv0fNECbJFa.jpg",
      thumbnail: "https://image.tmdb.org/t/p/w300/6NJnWvDJ5Z2RWLbPCv0fNECbJFa.jpg",
    },
    
    // ID 43: Hereditary (2018)
    "43": {
      title: "Hereditary",
      image: "https://image.tmdb.org/t/p/w500/lHV8HHlhwNup2VbpiACtlKzaGIQ.jpg",
      thumbnail: "https://image.tmdb.org/t/p/w300/lHV8HHlhwNup2VbpiACtlKzaGIQ.jpg",
    },
  }
};

/**
 * Usage in seed-movies.js:
 * 
 * const fixedImages = require('./fixed-images');
 * 
 * // Then update each movie object:
 * {
 *   id: "18",
 *   title: "Gravity",
 *   ...fixedImages.fixedImages["18"],
 *   // ... rest of the properties
 * }
 */
