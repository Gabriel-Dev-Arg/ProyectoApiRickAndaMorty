const urlEpisodes = `https://rickandmortyapi.com/api/episode`;
const urlCharacters = `https://rickandmortyapi.com/api/character`;
const urlLocaciones = `https://rickandmortyapi.com/api/location`;

const { createApp } = Vue;

createApp({
    data() {
        return {
            episodes: [],
            characters: [],
            locaciones: [],
            topSpecies: [],
            topEpisodes: [],
            loading: true
        }
    },
    created() {
        this.fetchAllEpisodes();
        this.fetchAllCharacters();
    },
    methods: {
        fetchallPage(url) {
            let allResults = [];
            const fetchPage = (url) => {
                return fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        allResults = allResults.concat(data.results);
                        if (data.info && data.info.next) {
                            return fetchPage(data.info.next);
                        } else {
                            return allResults;
                        }
                    });
            };
            return fetchPage(url);
        },
        fetchAllCharacters() {
            this.loading = true;
            this.fetchallPage(urlCharacters)
                .then(data => {
                    this.characters = data;
                    this.calculateTopSpecies();
                    this.loading = false;
                })
                .catch(error => {
                    console.error("Error fetching characters:", error);
                    this.loading = false;
                });
        },
        fetchAllEpisodes() {
            this.loading = true;
            this.fetchallPage(urlEpisodes)
                .then(data => {
                    this.episodes = data;
                    this.calculateTopEpisodes();
                    this.loading = false;
                })
                .catch(error => {
                    console.error("Error fetching episodes:", error);
                    this.loading = false;
                });
        },
        calculateTopEpisodes() {
            this.topEpisodes = this.episodes
                .sort((a, b) => b.characters.length - a.characters.length)
                .slice(0, 5);
        },
        calculateTopSpecies() {
            const speciesCounts = this.characters.reduce((acc, character) => {
                acc[character.species] = (acc[character.species] || 0) + 1;
                return acc;
            }, {});

            this.topSpecies = Object.entries(speciesCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }));
        },
    },
})
.mount('#appStats');