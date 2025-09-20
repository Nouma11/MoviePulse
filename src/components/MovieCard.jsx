import React, { useState } from 'react';

const MovieCard = ({
                       movie: { title, vote_average, poster_path, release_date, original_language, overview },
                   }) => {
    const [isOpen, setIsOpen] = useState(false);

    const imageUrl = poster_path
        ? `https://image.tmdb.org/t/p/w500/${poster_path}`
        : "/no-movie.png";

    return (
        <>
            {/* Movie Card */}
            <div
                className="movie-card cursor-pointer hover:scale-[1.03] transition duration-200"
                onClick={() => setIsOpen(true)}
            >
                <img src={imageUrl} alt={title} />
                <div className="mt-4">
                    <h3>{title}</h3>
                    <div className="content">
                        <div className="rating">
                            <img src="/star.svg" alt="Star icon" />
                            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
                        </div>
                        <span>•</span>
                        <div className="lang">{original_language}</div>
                        <span>•</span>
                        <div className="year">{release_date ? release_date.split("-")[0] : "N/A"}</div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/70  flex items-center justify-center z-50">
                    <div className="bg-dark-100 p-6  rounded-2xl max-w-lg w-full relative">
                        <button
                            className="absolute right-3 top-0 cursor-pointer text-white text-[50px]  font-bold"
                            onClick={() => setIsOpen(false)}
                        >
                            ×
                        </button>

                        <img src={imageUrl} alt={title} className="rounded-lg w-[75%] mb-4" />
                        <h2 className="text-white text-2xl font-bold">{title}</h2>
                        <p className="text-gray-300 mt-2">{overview || "No description available."}</p>
                        <p className="mt-3 text-gray-400">
                            ⭐ {vote_average ? vote_average.toFixed(1) : "N/A"} | 📅{" "}
                            {release_date ? release_date : "N/A"}
                        </p>
                        <p className="mt-1 text-gray-400">Language: {original_language}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default MovieCard;
