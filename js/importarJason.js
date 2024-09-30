document.addEventListener("DOMContentLoaded", function() {
    const videosContainer = document.querySelector('.videos__container');
    const pesquisaInput = document.getElementById('pesquisar');
    let todosOsVideos = [];

    function carregarVideos() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/videos', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                todosOsVideos = JSON.parse(xhr.responseText);
                exibirVideos(todosOsVideos);
            }
        };
        xhr.send();
    }

    function exibirVideos(videos) {
        videosContainer.innerHTML = ''; 
        videos.forEach(video => {
            const videoItem = document.createElement('li');
            videoItem.classList.add('videos__item');

            const videoEmbed = document.createElement('iframe');
            videoEmbed.setAttribute('width', '100%');
            videoEmbed.setAttribute('height', '72%');
            videoEmbed.setAttribute('src', video.url);
            videoEmbed.setAttribute('title', video.title);
            videoEmbed.setAttribute('frameborder', '0');
            videoEmbed.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            videoEmbed.setAttribute('allowfullscreen', '');

            const descricaoVideo = document.createElement('div');
            descricaoVideo.classList.add('descricao-video');

            const thumbnail = document.createElement('img');
            thumbnail.setAttribute('src', `./img/videos/clipeicon.png`);
            thumbnail.setAttribute('alt', 'Thumbnail do canal');

            const titulo = document.createElement('h3');
            titulo.textContent = video.title;

            const views = document.createElement('p');
            views.textContent = `${video.views} - ${video.uploaded}`;

            descricaoVideo.appendChild(thumbnail);
            descricaoVideo.appendChild(titulo);
            descricaoVideo.appendChild(views);

            videoItem.appendChild(videoEmbed);
            videoItem.appendChild(descricaoVideo);

            videosContainer.appendChild(videoItem);
        });
    }

    const linkAdicionar = document.querySelector('.cabecalho__videos');
    const formularioContainer = document.getElementById('formulario-container');
    const videoForm = document.getElementById('adicionar-video-form');

    linkAdicionar.addEventListener('click', function(event) {
        event.preventDefault(); 
        formularioContainer.style.display = formularioContainer.style.display === 'none' ? 'block' : 'none';
    });

    function adicionarVideoNaAPI(novoVideo) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/videos', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 201) {
                console.log('Vídeo adicionado com sucesso!');
                carregarVideos();
            } else {
                console.error('Erro ao adicionar vídeo:', xhr.responseText);
            }
        };
        xhr.send(JSON.stringify(novoVideo)); 
    }

    videoForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const videoTitle = document.getElementById('video-title').value;
        const videoURL = document.getElementById('video-url').value;
        const videoGenero = document.getElementById('video-genero').value;

        // Identificar o próximo id
        const ultimoVideo = todosOsVideos[todosOsVideos.length - 1];
        const proximoId = ultimoVideo ? parseInt(ultimoVideo.id) + 1 : 1; // Se não houver vídeos, id começa em 1

        // Criar novo vídeo com o id incrementado
        const novoVideo = {
            id: proximoId.toString(),
            title: videoTitle,
            url: videoURL,
            genero: videoGenero,
            views: '0',
            uploaded: new Date().toLocaleDateString()
        };

        todosOsVideos.push(novoVideo);

        exibirVideos(todosOsVideos);

        adicionarVideoNaAPI(novoVideo);

        videoForm.reset();
        formularioContainer.style.display = 'none'; 
    });

    function filtrarVideosPorGenero(genero) {
        const videosFiltrados = todosOsVideos.filter(video => video.genero === genero);
        exibirVideos(videosFiltrados);
    }

    function filtrarVideosPorPesquisa(query) {
        const videosFiltrados = todosOsVideos.filter(video => video.title.toLowerCase().includes(query.toLowerCase()));
        exibirVideos(videosFiltrados);
    }

    pesquisaInput.addEventListener('input', function() {
        const query = this.value; 
        filtrarVideosPorPesquisa(query); 
    });

    const generos = document.querySelectorAll('.superior__secao__container a');
    generos.forEach(genero => {
        genero.addEventListener('click', function(event) {
            event.preventDefault(); 
            const generoSelecionado = this.getAttribute('data-genero');
            filtrarVideosPorGenero(generoSelecionado);
        });
    });

    const generosRodape = document.querySelectorAll('.rodape__container a');
    generosRodape.forEach(genero => {
        genero.addEventListener('click', function(event) {
            event.preventDefault();
            const generoSelecionado = this.getAttribute('data-genero');
            filtrarVideosPorGenero(generoSelecionado);
        });
    });

    carregarVideos();
});
