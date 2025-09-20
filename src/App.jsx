import './index.css'
import { useDebounce } from "react-use";
import React, { useState, useEffect } from "react";
import Spinner from './components/Spinner';
import Search from "./components/Search.jsx";
import MovieCard from "./components/MovieCard.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
};

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [moviesList, setMoviesList] = useState([]);
    const [trending, setTrending] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Debounce search
    useDebounce(() => {
        setDebouncedSearchTerm(searchTerm);
    }, 800, [searchTerm]);

    // Fetch movies (popular or search)
    const fetchMovies = async (query = '') => {
        try {
            setIsLoading(true);
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) throw new Error("Error fetching movies.");

            const data = await response.json();
            if (data.success === false) {
                setErrorMessage(data.status_message || "Failed fetching movie results.");
                setMoviesList([]);
                return;
            }
            setMoviesList(data.results || []);
        } catch (err) {
            console.error(err);
            setErrorMessage("Error fetching movies. Try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch trending movies (limit 5)
    const fetchTrendingMovies = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/trending/movie/week`, API_OPTIONS);
            if (!response.ok) throw new Error("Failed to fetch trending movies");

            const data = await response.json();
            if (data.success === false) {
                setErrorMessage(data.status_message || "Failed fetching trending movies.");
                setTrending([]);
                return;
            }
            setTrending((data.results || []).slice(0, 6)); // ✅ only first 5
        } catch (err) {
            console.error(err);
            setErrorMessage("Error fetching trending movies. Try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
        fetchTrendingMovies();
    }, [debouncedSearchTerm]);

    return (
        <main>
            <div className="pattern" />

            <div className="wrapper">
                <header>
                    <img src="/hero.png" alt="Hero Banner" />
                    <h1>
                        Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
                    </h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {/* Trending Section */}
                <section className="trending">
                    <h2 className="mt-8 text-gradient">Trending</h2>
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-600">{errorMessage}</p>
                    ) : (
                        <ul>
                            {trending.map((movie,index) => (
                               <li key={movie.id}>
                                   <p>{index+1}</p>
                                   <img
                                       src={movie.poster_path?`https://image.tmdb.org/t/p/w500/${movie.poster_path}`:"../public/no-movie.png"}
                                       alt={movie.title}/>
                               </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Popular/Search Section */}
                <section className="all-movies">
                    <h2 className="mt-8 text-gradient">
                        {debouncedSearchTerm ? "Search Results" : "Popular"}
                    </h2>
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-600">{errorMessage}</p>
                    ) : (
                        <ul>
                            {moviesList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie}  />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}

export default App;
