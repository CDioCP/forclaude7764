
const MovieCard = ({ movie }) => {
    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://placehold.co/500x750/05050a/00f7ff?text=NO+IMAGE';

    const isEnglish = movie.original_language === 'en';

    return (
        <div className="movie-card">
            <div className="poster-wrapper">
                <img src={imageUrl} alt={movie.title || movie.name} loading="lazy" />
                <div className="overlay">
                    <div className="score-badge">
                        {movie.match_score
                            ? `${movie.match_score}%`
                            : (movie.vote_average || 0).toFixed(1)}
                    </div>
                </div>
            </div>
            <div className="content">
                <h3>{movie.title || movie.name}</h3>
                <p>{movie.year || (movie.release_date || movie.first_air_date || '').split('-')[0]}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="media-type">{movie.media_type === 'tv' ? 'TV Series' : 'Movie'}</span>
                    {movie.original_language && (
                        <span className={`lang-badge${isEnglish ? '' : ' non-english'}`}>
                            {movie.original_language.toUpperCase()}
                        </span>
                    )}
                </div>

                {movie.overview && (
                    <p className="movie-overview">{movie.overview}</p>
                )}

                {/* Streaming Providers */}
                <div className="provider-row">
                    {movie.providers && movie.providers.length > 0 ? (
                        movie.providers.slice(0, 4).map((provider, index) => (
                            <img
                                key={index}
                                src={provider.logo_path}
                                alt={provider.name}
                                title={provider.name}
                                className="provider-icon"
                            />
                        ))
                    ) : (
                        <span className="provider-fallback">Rent/Buy only</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
