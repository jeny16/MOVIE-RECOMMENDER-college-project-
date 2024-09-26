import SearchBar from "./Components/SearchBar";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import "./Components/styles/HomeStyles.css";
import MovieCard from "./Components/MovieCard";
import { useEffect, useState } from "react";

const Home = () => {
  const apiKey = "api_key=b97316ed479ee4226afefc88d1792909";
  const [list, setList] = useState([]);
  const [homeGenreList, setHomeGenreList] = useState([{}]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currMovies, setCurrMovies] = useState([{}]);

  // useEffect(() => {
  //   setCurrMovies([]);
  //   setSelectedGenres([]);
  //   setHomeGenreList([]);
  //   setList([]);

  // fetch("/api/movies")
  //   .then((Response) =>
  //     Response.json().then((data) => setList(data.arr))
  //   );

  // getting the list of all genres
  //   fetch(`https://api.themoviedb.org/3/genre/movie/list?${apiKey}`).then(
  //     (Response) =>
  //       Response.json().then((data) => setHomeGenreList(data.genres))
  //   );
  // }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/movies");
        if (!response.ok) {
          throw   (`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setList(data.arr);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?${apiKey}`
        );
        const data = await response.json();
        setHomeGenreList(data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchMovies();
    fetchGenres();
  }, []);

  useEffect(() => {
    const setMovies = async () => {
      if (selectedGenres.length === 0) {
        setCurrMovies([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&${apiKey}&release_date.lte=2019-12-12&with_genres=${encodeURIComponent(
            selectedGenres.join(",")
          )}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCurrMovies(data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    setMovies();
  }, [selectedGenres]);

  const onTagClick = (genreId) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter((item) => item !== genreId));
    } else {
      setSelectedGenres((selectedGenres) => [...selectedGenres, genreId]);
    }
    // let isPresent = false;
    // for (let id of selectedGenres) {
    //   if (id === genreId) {
    //     isPresent = true;
    //     break;
    //   }
    // }
    // if (isPresent) {
    //   setSelectedGenres(selectedGenres.filter((item) => item !== genreId));
    // } else {
    //   setSelectedGenres((selectedGenres) => [...selectedGenres, genreId]);
    // }
  };
  const renderMovies = () =>
    currMovies?.map((movie) => {
      if (movie) {
        return (
          <MovieCard key={movie.id + movie.original_title} movie={movie} />
        );
      } else {
        return null;
      }
    });

  return (
    <div className="container-fluid">
      <div className="HomePage">
        <NavBar />
        <div className="HomeSearch">
          <SearchBar movies={list} placeholder="Search for a Movie" />
        </div>

        <h2 className="genreHeader">SELECT THE GENRE OF MOVIE</h2>
        <div className="buttonGrid">
          {homeGenreList.map((genre) => (
            <div
              key={genre.id}
              onClick={() => onTagClick(genre.id)}
              className={
                selectedGenres.includes(genre.id) ? "genreTagON" : "genreTagOFF"
              }
            >
              {genre.name}
              {selectedGenres.includes(genre.id) ? (
                <i className="fa fa-times" aria-hidden="true"></i>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="container-fluid HomeMovies">
        <div className="container HomeMovieGrid">
          {currMovies.length > 0 ? renderMovies() : null}
        </div>
      </div>
      <div className="HomeFooter">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
