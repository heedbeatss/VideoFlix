document.addEventListener("DOMContentLoaded", function() {
    const videosContainer = document.querySelector('.videos__container');
    const pesquisaInput = document.getElementById('pesquisar');

    // Array para armazenar todos os vídeos
    let todosOsVideos = [];

    // Função para carregar o JSON externo
    function carregarVideos() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/videos', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                todosOsVideos = JSON.parse(xhr.responseText);
                exibirVideos(todosOsVideos); // Exibir todos os vídeos inicialmente
            }
        };
        xhr.send();
    }

    // Função para exibir os vídeos na página
    function exibirVideos(videos) {
        videosContainer.innerHTML = ''; // Limpa o container antes de adicionar novos vídeos

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

    // Seleciona o link e o container do formulário
    const linkAdicionar = document.querySelector('.cabecalho__videos');
    const formularioContainer = document.getElementById('formulario-container');
    const videoForm = document.getElementById('adicionar-video-form');
    

    // Adiciona um evento de clique ao link
    linkAdicionar.addEventListener('click', function(event) {
        event.preventDefault(); // Previne o comportamento padrão do link
        // Alterna a visibilidade do formulário
        if (formularioContainer.style.display === 'none') {
            formularioContainer.style.display = 'block'; // Exibe o formulário
        } else {
            formularioContainer.style.display = 'none'; // Oculta o formulário
        }
    });

   // Adiciona um evento de envio ao formulário
videoForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o comportamento padrão de envio do formulário

    // Captura os dados do formulário
    const videoTitle = document.getElementById('video-title').value;
    const videoURL = document.getElementById('video-url').value;
    const videoGenero = document.getElementById('video-genero').value;

    // Cria um objeto de vídeo para adicionar à lista
    const novoVideo = {
        title: videoTitle,
        url: videoURL,
        genero: videoGenero,
        views: '0', // Exemplo de views, ajuste conforme necessário
        uploaded: new Date().toLocaleDateString() // Data de upload, ajuste conforme necessário
    };

    // Adiciona o novo vídeo ao array de todos os vídeos
    todosOsVideos.push(novoVideo);

    // Exibe todos os vídeos atualizados
    exibirVideos(todosOsVideos);

    // Limpa os campos do formulário
    videoForm.reset();
    formularioContainer.style.display = 'none'; // Oculta o formulário após adicionar o vídeo
});

    
    

    // Função para filtrar vídeos por gênero
    function filtrarVideosPorGenero(genero) {
        const videosFiltrados = todosOsVideos.filter(video => video.genero === genero);
        exibirVideos(videosFiltrados);
    }

    // // Função para filtrar vídeos por artista
    // function filtrarVideosPorArtista(artista) {
    //     const videosFiltrados = todosOsVideos.filter(video => video.title.includes(artista));
    //     exibirVideos(videosFiltrados);
    // }

    // Função para filtrar vídeos por título de pesquisa
    function filtrarVideosPorPesquisa(query) {
        const videosFiltrados = todosOsVideos.filter(video => video.title.toLowerCase().includes(query.toLowerCase()));
        exibirVideos(videosFiltrados);
    }

    // Adicionar event listener para a pesquisa
    pesquisaInput.addEventListener('input', function() {
        const query = this.value; // Captura o valor do campo de pesquisa
        filtrarVideosPorPesquisa(query); // Filtra vídeos pelo título
    });

    // Adicionar event listeners para as tags de gênero na seção superior
    const generos = document.querySelectorAll('.superior__secao__container a');
    generos.forEach(genero => {
        genero.addEventListener('click', function(event) {
            event.preventDefault(); // Evita o comportamento padrão do link
            const generoSelecionado = this.getAttribute('data-genero');
            filtrarVideosPorGenero(generoSelecionado); // Filtrar vídeos pelo gênero
        });
    });

    // Adicionar event listeners para as tags de gênero na seção do rodapé
    const generosRodape = document.querySelectorAll('.rodape__container a');
    generosRodape.forEach(genero => {
        genero.addEventListener('click', function(event) {
            event.preventDefault(); // Evita o comportamento padrão do link
            const generoSelecionado = this.getAttribute('data-genero');
            filtrarVideosPorGenero(generoSelecionado); // Filtrar vídeos pelo gênero
        });
    });

    // Adicionar event listeners para os itens do menu de artistas
    // const artistas = document.querySelectorAll('.menu__lista a');
    // artistas.forEach(artista => {
    //     artista.addEventListener('click', function(event) {
    //         event.preventDefault(); // Evita o comportamento padrão do link
    //         const artistaSelecionado = this.querySelector('span').textContent; // Pega o nome do artista
    //         filtrarVideosPorArtista(artistaSelecionado); // Filtra vídeos pelo nome do artista
    //     });
    // });

    // Chamar a função para carregar os vídeos quando a página carregar
    carregarVideos();
});
