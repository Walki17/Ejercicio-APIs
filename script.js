document.getElementById('BotonBuscar').addEventListener('click', function() {
    const Busqueda = document.getElementById('BuscarPersonaje').value.trim().toLowerCase().split(" "); //split hace que busque palabra por palabra
    const baseUrl = 'https://anapioficeandfire.com/api/characters';
    let page = 1; //empieza a buscar desde la primer pagina
    let EncontrarPj = false;

    function searchCharacter() {
        fetch(`${baseUrl}?page=${page}&pageSize=50`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red');
                }
                return response.json();
            })
            .then(data => {
                const FiltrarPj = data.filter(character => 
                    Busqueda.every(term => character.name.toLowerCase().includes(term))
                );

                if (FiltrarPj.length > 0) {
                    const characterInfo = FiltrarPj.map(character => `
                    <div class="card mb-2" style="width: 16rem;">
                        <div class="card-header">
                            <h2>${character.name}</h2>
                        </div>
                        <div class="card-header">
                            <h4 class="card-subtitle mb-2 text-body-secondary"><strong>Interpretado por:</strong> ${character.playedBy.length > 0 ? character.playedBy.join(', ') : 'N/A'}</h4>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><strong>Cultura:</strong> ${character.culture || 'N/A'}</li>
                            <li class="list-group-item"><strong>Nacido:</strong> ${character.born || 'N/A'}</li>
                            <li class="list-group-item"><strong>Títulos:</strong> ${character.titles.length > 0 ? character.titles.join(', ') : 'N/A'}</li>
                            <li class="list-group-item"><strong>Alias:</strong> ${character.aliases.length > 0 ? character.aliases.join(', ') : 'N/A'}</li>
                            <li class="list-group-item"><strong>Series de TV:</strong> ${character.tvSeries.length > 0 ? character.tvSeries.join(', ') : 'N/A'}</li>
                        </ul>
                    </div>`).join('');

                    document.getElementById('InfoPj').innerHTML = characterInfo;
                    EncontrarPj = true;
                } else if (data.length === 0 && !EncontrarPj) {
                    document.getElementById('InfoPj').innerHTML = '<p>No se encontraron personajes.</p>';
                } else if (!EncontrarPj) {
                    page++;
                    searchCharacter(); 
                }
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error);
                document.getElementById('InfoPj').innerHTML = '<p>Error al cargar la información.</p>';
            });
    }

    document.getElementById('InfoPj').innerHTML = '<p>Buscando personaje...</p>';
    searchCharacter();
});
