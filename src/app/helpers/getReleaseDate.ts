import { Movie } from "../interfaces/interface";

export function getReleaseDate(movie: Movie): string {
    const dateMovie = movie.release_date || movie.first_air_date || 'Soon...';
    const year = dateMovie.slice(0, 4);
    const monthNumber = Number(dateMovie.slice(5, 7));
    const monthName = new Date(2020, monthNumber - 1).toLocaleString('en', {
      month: 'long',
    });
    const day = dateMovie.slice(-2);
    return `${monthName.slice(0, 3)} ${day}, ${year}`;
  }