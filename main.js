const urlEpisodes = `https://rickandmortyapi.com/api/episode`;
const urlCharacters = `https://rickandmortyapi.com/api/character`;
const urlLocaciones = `https://rickandmortyapi.com/api/location`;

const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            episodes: [],
            characters: [],
            locaciones: [],
            textSearch: "",
            statusFilter: [],
            isCharacters: true,
            currentPage: 1,
            rowsPerPage: 20,
            totalPages: 1,
            loading: true,
            selectedCharacters: [],
            episodeImage: '/assets/img/morty-siendo-atacado_3840x2400_xtrafondos.com.jpg',
        }
    },
    created() {
        this.fetchAllCharacters();
        this.fetchAllEpisodes();
        this.fetchAllLocaciones();
        this.loadSelectedCharacters();
    },
    methods: {
        fetchallPage(url) {
            let allResults = [];
            function fetchPage(url) {
                return fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        allResults = allResults.concat(data.results);
                        if (data.info.next) {
                            return fetchPage(data.info.next);
                        } else {
                            return { results: allResults, totalPages: data.info.pages };
                        }
                    })
            }
            return fetchPage(url);
        },
        fetchAllCharacters() {
            this.loading = true;
            this.fetchallPage(urlCharacters)
                .then(data => {
                    this.characters = data.results;
                    this.totalPages = data.totalPages;
                    this.loading = false;
                })
                .catch(error => {
                    console.error("Error fetching characters:", error);
                    this.loading = false;
                });
        },
        fetchAllEpisodes() {
            this.fetchallPage(urlEpisodes)
                .then(data => {
                    this.episodes = data.results;
                })
                .catch(error => {
                    console.error("Error fetching episodes:", error);
                });
        },
        fetchAllLocaciones() {
            this.fetchallPage(urlLocaciones)
                .then(data => {
                    this.locaciones = data.results;
                })
                .catch(error => {
                    console.error("Error fetching locaciones:", error);
                });
        },


        // Paginación, que la pagina acual sea la 1 por defecto, y que la ultima que no se pase sino que sea la ultima
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        nextPage() {
            this.goToPage(this.currentPage + 1);
        },
        prevPage() {
            this.goToPage(this.currentPage - 1);
        },
        applyFilters() {
            this.currentPage = 1; // Reinicia a la primera página cuando se aplica un filtro
        },


        // Favoritos
        // Agregar o quitar de favoritos
        toggleFavorite(character) {
            const index = this.selectedCharacters.findIndex(c => c.id === character.id);
            if (index > -1) {
                this.selectedCharacters.splice(index, 1);
            } else {
                this.selectedCharacters.push(character);
            }
            this.saveSelectedCharacters(); // Guardar después de cada cambio
        },
        // si cumple la condicion, traeme el personaje de ese id
        isSelected(character) {
            return this.selectedCharacters.some(c => c.id === character.id);
            
        },
        removeCharacter(character) {
            const index = this.selectedCharacters.findIndex(c => c.id === character.id);
            if (index > -1) {
                this.selectedCharacters.splice(index, 1);
            }
            this.saveSelectedCharacters(); // Guardar después de cada cambio
        },
        clearAllCharacters() {
            this.selectedCharacters = [];
            this.saveSelectedCharacters(); // Guardar después de cada cambio
        },
        saveSelectedCharacters() {
            localStorage.setItem('selectedCharacters', JSON.stringify(this.selectedCharacters));
        },
        loadSelectedCharacters() {
            const savedCharacters = localStorage.getItem('selectedCharacters');
            if (savedCharacters) {
                this.selectedCharacters = JSON.parse(savedCharacters);
            }
        },
        clearSelectedCharacters() {
            this.selectedCharacters = [];
            localStorage.removeItem('selectedCharacters');
        }
    },
    computed:{
        filteredCharacters() {
            return this.characters.filter(item => {
                const nameMatch = item.name.toLowerCase().includes(this.textSearch.toLowerCase());
                const statusMatch = this.statusFilter.length === 0 || this.statusFilter.includes(item.status);
                return nameMatch && statusMatch;
            });
        },
        filterData() {
            // Aplicar paginación a los datos filtrados
            const startIndex = (this.currentPage - 1) * this.rowsPerPage;
            const endIndex = startIndex + this.rowsPerPage;
            return this.filteredCharacters.slice(startIndex, endIndex);
        },
        totalFilteredPages() {
            return Math.ceil(this.filteredCharacters.length / this.rowsPerPage);
        },
    },
    watch: {
        textSearch() {
            this.applyFilters();
        },
        statusFilter: {
            handler() {
                this.applyFilters();
            },
            deep: true
        }
    }
});

app.mount('#app');