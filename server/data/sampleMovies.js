// Shared sample movies used as a fallback when MongoDB is unavailable
// and as the auto-seed set when the collection is empty.
const sourceList = [
  {
    title: 'Neon Horizon',
    genre: 'Sci-Fi',
    duration: '2h 18min',
    image: 'https://images.pexels.com/photos/18386912/pexels-photo-18386912.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    desc: 'In a city lit by perpetual neon, a rogue engineer uncovers a conspiracy that could reboot reality itself.',
  },
  {
    title: 'The Last Cartographer',
    genre: 'Adventure',
    duration: '2h 05min',
    image: 'https://images.pexels.com/photos/30217124/pexels-photo-30217124.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    desc: 'A solitary mapmaker journeys across uncharted lands to find a fabled city that appears on no map.',
  },
  {
    title: 'Echoes of Midnight',
    genre: 'Thriller',
    duration: '1h 52min',
    image: 'https://images.pexels.com/photos/24286060/pexels-photo-24286060.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    desc: 'A retired detective is pulled back when a series of disappearances mirror a case she never solved.',
  },
  {
    title: 'Golden Hour',
    genre: 'Romance',
    duration: '1h 47min',
    image: 'https://images.pexels.com/photos/11592363/pexels-photo-11592363.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    desc: 'Two strangers meet under the glow of a cinema marquee and spend one luminous night wandering the city.',
  },
  {
    title: 'Clapperboard',
    genre: 'Comedy',
    duration: '1h 38min',
    image: 'https://images.pexels.com/photos/14455876/pexels-photo-14455876.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    desc: 'A hapless film crew races against daylight to finish a single impossible shot before sunset.',
  },
  {
    title: 'Spotlight',
    genre: 'Drama',
    duration: '2h 12min',
    image: 'https://images.pexels.com/photos/11916973/pexels-photo-11916973.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    desc: 'Behind the bright stage lights, a director confronts the cost of a lifetime devoted to art.',
  },
];

// Stable pseudo-ids so the frontend can use them like real Mongo docs.
const sampleMovies = sourceList.map((m, i) => ({
  _id: `sample-${i + 1}`,
  ...m,
}));

module.exports = sampleMovies;
module.exports.sourceList = sourceList;
