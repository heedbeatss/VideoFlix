document.addEventListener("DOMContentLoaded", function() {
    const videosContainer = document.querySelector('.videos__container');

    // Função para carregar o JSON externo
    function carregarVideos() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/videos', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                const videos = JSON.parse(xhr.responseText);
                exibirVideos(videos);
            }
        };
        xhr.send();
    }

    // Função para exibir os vídeos na página
    function exibirVideos(videos) {
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

    // Chamar a função para carregar os vídeos quando a página carregar
    carregarVideos();
});