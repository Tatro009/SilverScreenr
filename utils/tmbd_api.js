const axios = require('axios');

const apiKey = 'process.env.API_KEY';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';


app.get('/api/popular-movies', async (req, res) => {
    try {
        const response = await axios.get(`${tmdbBaseUrl}/movie/popular`, {
            params: {
                api_key: apiKey,
            },
        });

        const popularMovies = response.data.results;
        res.json(popularMovies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
