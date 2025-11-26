/*
Seed movies into Appwrite database.
This script reads movie data from src/data/movies.ts and upserts documents into Appwrite.

Requirements:
- .env.local must contain Appwrite credentials (API key + database id)
- Movie collection and attributes must exist in Appwrite (run scripts/create-appwrite-collections.js first)

Run with:
  node scripts/seed-movies.js
*/

// Load environment variables from .env.local explicitly
require('dotenv').config({ path: '.env.local' });
const { Client, Databases, ID } = require('node-appwrite');
const path = require('path');

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID;

if (!endpoint || !projectId || !apiKey || !databaseId) {
  console.error('❌ Missing required Appwrite env vars. Check .env.local');
  console.error('Required: NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, APPWRITE_API_KEY, APPWRITE_DATABASE_ID');
  process.exit(1);
}

const client = new Client();
client.setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const databases = new Databases(client);

// Import movies data with comprehensive information - 10 movies per category
const moviesData = [
  // Sci-Fi Movies (10)
  {
    id: "1",
    title: "Inception",
    category: "Sci-Fi",
    genre: "Sci-Fi",
    year: 2010,
    rating: 4.8,
    image: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
    duration: 148,
    contentRating: "PG-13",
  },
  {
    id: "3",
    title: "Interstellar",
    category: "Sci-Fi",
    genre: "Sci-Fi",
    year: 2014,
    rating: 4.8,
    image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival. A journey beyond the stars to save humanity from extinction.",
    duration: 169,
    contentRating: "PG-13",
  },
  {
    id: "10",
    title: "The Matrix",
    category: "Sci-Fi",
    genre: "Sci-Fi",
    year: 1999,
    rating: 4.8,
    image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers. A revolutionary sci-fi action film that redefined the genre.",
    duration: 136,
    contentRating: "R",
  },
  {
    id: "13",
    title: "Blade Runner 2049",
    category: "Sci-Fi",
    genre: "Sci-Fi",
    year: 2017,
    rating: 4.6,
    image: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    description: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years. A visually stunning neo-noir masterpiece.",
    duration: 164,
    contentRating: "R",
  },
  {
    id: "14",
    title: "The Martian",
    category: "Sci-Fi",
    genre: "Sci-Fi",
    year: 2015,
    rating: 4.7,
    image: "https://image.tmdb.org/t/p/w500/5BHuvQ6p9kfc091Z8RiFNhCwL4b.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/5BHuvQ6p9kfc091Z8RiFNhCwL4b.jpg",
    description: "An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth that he is alive. A thrilling survival story in space.",
    duration: 144,
    contentRating: "PG-13",
  },
  {
    id: "15",
    title: "Arrival",
    category: "Sci-Fi",
    genre: "Sci-Fi",
    year: 2016,
    rating: 4.6,
    image: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    description: "A linguist is recruited by the military to communicate with alien lifeforms after twelve mysterious spacecrafts land around the world. A thought-provoking exploration of communication and time.",
    duration: 116,
    contentRating: "PG-13",
  },
  {
    id: "16",
    title: "Dune",
    category: "Sci-Fi",
    genre: "Sci-Fi",
    year: 2021,
    rating: 4.7,
    image: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    description: "Paul Atreides, a brilliant and gifted young man born into a great destiny, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
    duration: 155,
    contentRating: "PG-13",
  },
  {
    id: "17",
    title: "Ex Machina",
    category: "Sci-Fi",
    genre: "Sci-Fi",
    year: 2014,
    rating: 4.5,
    image: "https://image.tmdb.org/t/p/w500/9goPE2IoMIXxTLWzl7aizwuIiLh.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/9goPE2IoMIXxTLWzl7aizwuIiLh.jpg",
    description: "A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence by evaluating the human qualities of a highly advanced humanoid A.I.",
    duration: 108,
    contentRating: "R",
  },
  {
    id: "18",
    title: "Gravity",
    category: "Sci-Fi",
    genre: "Sci-Fi",
    year: 2013,
    rating: 4.5,
    image: "https://picsum.photos/500/750?random=1",
    thumbnail: "https://picsum.photos/300/450?random=1",
    description: "Two astronauts work together to survive after an accident leaves them stranded in space. A breathtaking survival thriller set in the vastness of space.",
    duration: 91,
    contentRating: "PG-13",
  },
  {
    id: "19",
    title: "Edge of Tomorrow",
    category: "Sci-Fi",
    genre: "Sci-Fi",
    year: 2014,
    rating: 4.6,
    image: "https://picsum.photos/500/750?random=2",
    thumbnail: "https://picsum.photos/300/450?random=2",
    description: "A soldier fighting aliens gets to relive the same day over and over again, the day restarting every time he dies. An innovative sci-fi action thriller with a time loop twist.",
    duration: 113,
    contentRating: "PG-13",
  },

  // Action Movies (10)
  {
    id: "2",
    title: "The Dark Knight",
    category: "Action",
    genre: "Action",
    year: 2008,
    rating: 4.9,
    image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    duration: 152,
    contentRating: "PG-13",
  },
  {
    id: "4",
    title: "Gladiator",
    category: "Action",
    genre: "Action",
    year: 2000,
    rating: 4.7,
    image: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery. An epic tale of courage, betrayal, and redemption.",
    duration: 155,
    contentRating: "R",
  },
  {
    id: "7",
    title: "Avengers: Endgame",
    category: "Action",
    genre: "Action",
    year: 2019,
    rating: 4.7,
    image: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
    description: "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe. The epic conclusion to the Infinity Saga.",
    duration: 181,
    contentRating: "PG-13",
  },
  {
    id: "20",
    title: "Mad Max: Fury Road",
    category: "Action",
    genre: "Action",
    year: 2015,
    rating: 4.8,
    image: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
    description: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners and a drifter named Max.",
    duration: 120,
    contentRating: "R",
  },
  {
    id: "21",
    title: "John Wick",
    category: "Action",
    genre: "Action",
    year: 2014,
    rating: 4.6,
    image: "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
    description: "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him. A stylish and brutal action thriller.",
    duration: 101,
    contentRating: "R",
  },
  {
    id: "22",
    title: "Mission: Impossible - Fallout",
    category: "Action",
    genre: "Action",
    year: 2018,
    rating: 4.7,
    image: "https://image.tmdb.org/t/p/w500/AkJQpZp9WoNdj7pLYSj1L0RcMMN.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/AkJQpZp9WoNdj7pLYSj1L0RcMMN.jpg",
    description: "Ethan Hunt and his IMF team must track down stolen plutonium while being hunted by assassins. High-octane action with breathtaking stunts.",
    duration: 147,
    contentRating: "PG-13",
  },
  {
    id: "23",
    title: "The Raid",
    category: "Action",
    genre: "Action",
    year: 2011,
    rating: 4.6,
    image: "https://picsum.photos/500/750?random=3",
    thumbnail: "https://picsum.photos/300/450?random=3",
    description: "A S.W.A.T. team becomes trapped in a tenement run by a ruthless mobster and his army of killers and thugs. An intense martial arts action masterpiece.",
    duration: 101,
    contentRating: "R",
  },
  {
    id: "24",
    title: "The Bourne Ultimatum",
    category: "Action",
    genre: "Action",
    year: 2007,
    rating: 4.6,
    image: "https://picsum.photos/500/750?random=4",
    thumbnail: "https://picsum.photos/300/450?random=4",
    description: "Jason Bourne dodges a ruthless CIA official and his agents as he searches for the truth about his past as a trained assassin. Intense espionage thriller with pulse-pounding action.",
    duration: 115,
    contentRating: "PG-13",
  },
  {
    id: "25",
    title: "Logan",
    category: "Action",
    genre: "Action",
    year: 2017,
    rating: 4.7,
    image: "https://image.tmdb.org/t/p/w500/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg",
    description: "In a near future, a weary Logan cares for an ailing Professor X while protecting a young mutant girl from dark forces. A gritty and emotional superhero film.",
    duration: 137,
    contentRating: "R",
  },
  {
    id: "26",
    title: "Casino Royale",
    category: "Action",
    genre: "Action",
    year: 2006,
    rating: 4.6,
    image: "https://picsum.photos/500/750?random=5",
    thumbnail: "https://picsum.photos/300/450?random=5",
    description: "After earning his license to kill, James Bond's first mission takes him to Madagascar where he is to spy on a terrorist. The gripping reboot of the Bond franchise.",
    duration: 144,
    contentRating: "PG-13",
  },

  // Drama Movies (10)
  {
    id: "6",
    title: "The Shawshank Redemption",
    category: "Drama",
    genre: "Drama",
    year: 1994,
    rating: 5.0,
    image: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency. A powerful story of hope, friendship, and the indomitable human spirit.",
    duration: 142,
    contentRating: "R",
  },
  {
    id: "8",
    title: "Parasite",
    category: "Drama",
    genre: "Drama",
    year: 2019,
    rating: 4.8,
    image: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan. A masterful thriller that explores social inequality.",
    duration: 132,
    contentRating: "R",
  },
  {
    id: "11",
    title: "Forrest Gump",
    category: "Drama",
    genre: "Drama",
    year: 1994,
    rating: 4.9,
    image: "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/saHP97rTPS5eLmrLQEcANmKrsFl.jpg",
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75. A heartwarming journey through American history.",
    duration: 142,
    contentRating: "PG-13",
  },
  {
    id: "12",
    title: "Joker",
    category: "Drama",
    genre: "Drama",
    year: 2019,
    rating: 4.7,
    image: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    description: "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime that brings him face-to-face with his alter-ego: the Joker.",
    duration: 122,
    contentRating: "R",
  },
  {
    id: "27",
    title: "The Green Mile",
    category: "Drama",
    genre: "Drama",
    year: 1999,
    rating: 4.9,
    image: "https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/velWPhVMQeQKcxggNEU8YmIo52R.jpg",
    description: "The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift. A deeply moving supernatural drama.",
    duration: 189,
    contentRating: "R",
  },
  {
    id: "28",
    title: "Schindler's List",
    category: "Drama",
    genre: "Drama",
    year: 1993,
    rating: 5.0,
    image: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    description: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
    duration: 195,
    contentRating: "R",
  },
  {
    id: "29",
    title: "The Godfather",
    category: "Drama",
    genre: "Drama",
    year: 1972,
    rating: 5.0,
    image: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son. An epic tale of family, power, and betrayal.",
    duration: 175,
    contentRating: "R",
  },
  {
    id: "30",
    title: "12 Years a Slave",
    category: "Drama",
    genre: "Drama",
    year: 2013,
    rating: 4.7,
    image: "https://image.tmdb.org/t/p/w500/xdANQijuNrJaw1HA61rDccME4Tm.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/xdANQijuNrJaw1HA61rDccME4Tm.jpg",
    description: "In the antebellum United States, Solomon Northup, a free black man from upstate New York, is abducted and sold into slavery. A harrowing true story of resilience.",
    duration: 134,
    contentRating: "R",
  },
  {
    id: "31",
    title: "A Beautiful Mind",
    category: "Drama",
    genre: "Drama",
    year: 2001,
    rating: 4.6,
    image: "https://image.tmdb.org/t/p/w500/zwzWCmH72OSC9NA0ipoqw5Zjya8.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/zwzWCmH72OSC9NA0ipoqw5Zjya8.jpg",
    description: "After John Nash, a brilliant but asocial mathematician, accepts secret work in cryptography, his life takes a turn for the nightmarish. An inspiring story of genius and mental illness.",
    duration: 135,
    contentRating: "PG-13",
  },
  {
    id: "32",
    title: "Whiplash",
    category: "Drama",
    genre: "Drama",
    year: 2014,
    rating: 4.8,
    image: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    description: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    duration: 106,
    contentRating: "R",
  },

  // Romance Movies (10)
  {
    id: "5",
    title: "Titanic",
    category: "Romance",
    genre: "Romance",
    year: 1997,
    rating: 4.6,
    image: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic. A timeless love story set against one of history's greatest tragedies.",
    duration: 194,
    contentRating: "PG-13",
  },
  {
    id: "33",
    title: "The Notebook",
    category: "Romance",
    genre: "Romance",
    year: 2004,
    rating: 4.5,
    image: "https://image.tmdb.org/t/p/w500/qom1SZSENdmHFNZBXbtJAU0WTlC.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/qom1SZSENdmHFNZBXbtJAU0WTlC.jpg",
    description: "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated by their social differences. A touching tale of enduring love.",
    duration: 123,
    contentRating: "PG-13",
  },
  {
    id: "34",
    title: "La La Land",
    category: "Romance",
    genre: "Romance",
    year: 2016,
    rating: 4.6,
    image: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    description: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future. A modern musical romance.",
    duration: 128,
    contentRating: "PG-13",
  },
  {
    id: "35",
    title: "Pride and Prejudice",
    category: "Romance",
    genre: "Romance",
    year: 2005,
    rating: 4.5,
    image: "https://image.tmdb.org/t/p/w500/sGjIvtVvTlWnia2zfJfHz81pZ9Q.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/sGjIvtVvTlWnia2zfJfHz81pZ9Q.jpg",
    description: "Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy. But Mr. Darcy reluctantly finds himself falling in love with a woman beneath his class.",
    duration: 129,
    contentRating: "PG",
  },
  {
    id: "36",
    title: "Eternal Sunshine of the Spotless Mind",
    category: "Romance",
    genre: "Romance",
    year: 2004,
    rating: 4.7,
    image: "https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg",
    description: "When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories. A mind-bending romantic drama.",
    duration: 108,
    contentRating: "R",
  },
  {
    id: "37",
    title: "Before Sunrise",
    category: "Romance",
    genre: "Romance",
    year: 1995,
    rating: 4.6,
    image: "https://picsum.photos/500/750?random=6",
    thumbnail: "https://picsum.photos/300/450?random=6",
    description: "A young man and woman meet on a train in Europe, and spend one romantic evening together in Vienna. An intimate and philosophical romance.",
    duration: 101,
    contentRating: "R",
  },
  {
    id: "38",
    title: "Call Me by Your Name",
    category: "Romance",
    genre: "Romance",
    year: 2017,
    rating: 4.6,
    image: "https://picsum.photos/500/750?random=7",
    thumbnail: "https://picsum.photos/300/450?random=7",
    description: "In 1980s Italy, a romance blossoms between a seventeen-year-old student and the older man hired as his father's research assistant. A beautiful coming-of-age love story.",
    duration: 132,
    contentRating: "R",
  },
  {
    id: "39",
    title: "Casablanca",
    category: "Romance",
    genre: "Romance",
    year: 1942,
    rating: 4.8,
    image: "https://image.tmdb.org/t/p/w500/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg",
    description: "A cynical American expatriate struggles to decide whether or not to help his former lover and her fugitive husband escape French Morocco. A timeless classic.",
    duration: 102,
    contentRating: "PG",
  },
  {
    id: "40",
    title: "Roman Holiday",
    category: "Romance",
    genre: "Romance",
    year: 1953,
    rating: 4.7,
    image: "https://picsum.photos/500/750?random=8",
    thumbnail: "https://picsum.photos/300/450?random=8",
    description: "A bored and sheltered princess escapes her guardians and falls in love with an American newsman in Rome. A charming romantic comedy.",
    duration: 118,
    contentRating: "NR",
  },
  {
    id: "41",
    title: "500 Days of Summer",
    category: "Romance",
    genre: "Romance",
    year: 2009,
    rating: 4.4,
    image: "https://image.tmdb.org/t/p/w500/f9mbM0YMLpYemcWx6o2WeiYQLDP.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/f9mbM0YMLpYemcWx6o2WeiYQLDP.jpg",
    description: "An offbeat romantic comedy about a woman who doesn't believe true love exists, and the young man who falls for her. A non-linear exploration of modern romance.",
    duration: 95,
    contentRating: "PG-13",
  },

  // Horror Movies (10)
  {
    id: "9",
    title: "Get Out",
    category: "Horror",
    genre: "Horror",
    year: 2017,
    rating: 4.4,
    image: "https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
    description: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point. A groundbreaking horror-thriller.",
    duration: 104,
    contentRating: "R",
  },
  {
    id: "42",
    title: "The Shining",
    category: "Horror",
    genre: "Horror",
    year: 1980,
    rating: 4.7,
    image: "https://image.tmdb.org/t/p/w500/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg",
    description: "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.",
    duration: 146,
    contentRating: "R",
  },
  {
    id: "43",
    title: "Hereditary",
    category: "Horror",
    genre: "Horror",
    year: 2018,
    rating: 4.5,
    image: "https://picsum.photos/500/750?random=9",
    thumbnail: "https://picsum.photos/300/450?random=9",
    description: "A grieving family is haunted by tragic and disturbing occurrences after the death of their secretive grandmother. A deeply unsettling modern horror masterpiece.",
    duration: 127,
    contentRating: "R",
  },
  {
    id: "44",
    title: "A Quiet Place",
    category: "Horror",
    genre: "Horror",
    year: 2018,
    rating: 4.5,
    image: "https://image.tmdb.org/t/p/w500/nAU74GmpUk7t5iklEp3bufwDq4n.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/nAU74GmpUk7t5iklEp3bufwDq4n.jpg",
    description: "In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing. A tense and innovative thriller.",
    duration: 90,
    contentRating: "PG-13",
  },
  {
    id: "45",
    title: "The Exorcist",
    category: "Horror",
    genre: "Horror",
    year: 1973,
    rating: 4.6,
    image: "https://image.tmdb.org/t/p/w500/5x0CeVHJI8tcDx8tUUwYHQSNILq.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/5x0CeVHJI8tcDx8tUUwYHQSNILq.jpg",
    description: "When a teenage girl is possessed by a mysterious entity, her mother seeks the help of two priests to save her daughter. A landmark horror film that terrified generations.",
    duration: 122,
    contentRating: "R",
  },
  {
    id: "46",
    title: "It",
    category: "Horror",
    genre: "Horror",
    year: 2017,
    rating: 4.4,
    image: "https://image.tmdb.org/t/p/w500/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg",
    description: "Seven young outcasts in Derry, Maine, are about to face their worst nightmare -- an ancient, shape-shifting evil that emerges from the sewer every 27 years to prey on the town's children.",
    duration: 135,
    contentRating: "R",
  },
  {
    id: "47",
    title: "The Conjuring",
    category: "Horror",
    genre: "Horror",
    year: 2013,
    rating: 4.5,
    image: "https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
    description: "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse. Based on a true story.",
    duration: 112,
    contentRating: "R",
  },
  {
    id: "48",
    title: "The Witch",
    category: "Horror",
    genre: "Horror",
    year: 2015,
    rating: 4.4,
    image: "https://image.tmdb.org/t/p/w500/zap5hpFCWSvdWSuPGAQyjUv2wAC.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/zap5hpFCWSvdWSuPGAQyjUv2wAC.jpg",
    description: "A family in 1630s New England is torn apart by the forces of witchcraft, black magic, and possession. An atmospheric period horror film.",
    duration: 92,
    contentRating: "R",
  },
  {
    id: "49",
    title: "Midsommar",
    category: "Horror",
    genre: "Horror",
    year: 2019,
    rating: 4.3,
    image: "https://image.tmdb.org/t/p/w500/7LEI8ulZzO5gy9Ww2NVCrKmHeDZ.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/7LEI8ulZzO5gy9Ww2NVCrKmHeDZ.jpg",
    description: "A couple travels to Sweden to visit a rural hometown's fabled mid-summer festival. What begins as an idyllic retreat quickly devolves into an increasingly violent and bizarre competition.",
    duration: 148,
    contentRating: "R",
  },
  {
    id: "50",
    title: "Halloween",
    category: "Horror",
    genre: "Horror",
    year: 1978,
    rating: 4.5,
    image: "https://image.tmdb.org/t/p/w500/wijlZ3HaYMvlDTPqJoTCWKFkCPU.jpg",
    thumbnail: "https://image.tmdb.org/t/p/w300/wijlZ3HaYMvlDTPqJoTCWKFkCPU.jpg",
    description: "Fifteen years after murdering his sister on Halloween night, Michael Myers escapes from a mental hospital and returns to the small town to kill again. The film that defined the slasher genre.",
    duration: 91,
    contentRating: "R",
  },
];

async function upsertMovie(movieId, movieData) {
  try {
    // Try to create document with specified ID
    const res = await databases.createDocument(databaseId, 'Movie', movieId, movieData);
    console.log(`  ✓ Created movie: ${movieData.title} (${movieData.year})`);
    return res;
  } catch (e) {
    // If doc exists (409 conflict), update it
    if (e.code && e.code === 409) {
      try {
        const res2 = await databases.updateDocument(databaseId, 'Movie', movieId, movieData);
        console.log(`  ✓ Updated movie: ${movieData.title} (${movieData.year})`);
        return res2;
      } catch (u) {
        console.warn(`  ⚠ Update warning for movie ${movieId}:`, u.message || u);
        throw u;
      }
    }
    console.error(`  ✗ Error creating movie ${movieId}:`, e.message || e);
    throw e;
  }
}

(async () => {
  try {
    console.log('🎬 Starting movie seeding to Appwrite...\n');
    console.log(`Found ${moviesData.length} movies to seed\n`);

    const now = new Date().toISOString();
    let successCount = 0;
    let errorCount = 0;

    for (const movie of moviesData) {
      try {
        const moviePayload = {
          title: movie.title,
          category: movie.category,
          genre: movie.genre,
          year: movie.year,
          rating: movie.rating,
          image: movie.image,
          thumbnail: movie.thumbnail,
          description: movie.description || '',
          duration: movie.duration || 0,
          contentRating: movie.contentRating || 'NR',
          createdAt: now,
          updatedAt: now
        };
        
        await upsertMovie(movie.id, moviePayload);
        successCount++;
      } catch (error) {
        console.error(`Failed to seed movie ${movie.title}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n=== Seeding Summary ===');
    console.log(`✅ Successfully seeded: ${successCount} movies`);
    if (errorCount > 0) {
      console.log(`❌ Failed: ${errorCount} movies`);
    }
    console.log('======================\n');

    if (errorCount > 0) {
      process.exitCode = 1;
    }
  } catch (e) {
    console.error('\n❌ Seeding error:', e);
    process.exitCode = 1;
  }
})();
