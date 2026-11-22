# Ventáfera — O Coração das Ilhas
Uma aventura de plataforma para navegador. Na fase 1-1, Trilha das Conchas, Nira e Boro atravessam a Costa das Cascatas para despertar o farol.

## Jogar
Abra index.html em um navegador moderno. Para servir localmente, execute `python -m http.server 8000` nesta pasta e abra `http://localhost:8000`. Os caminhos são relativos e todos os recursos estão incluídos. A música começa após interação.

## GitHub Pages
Extraia o ZIP. Envie index.html, .nojekyll, css/, js/ e assets/ para a raiz do repositório. Em Settings → Pages selecione Deploy from a branch, a branch desejada e /(root). Salve. O endereço do jogo aparece na área Pages após a publicação.

## Controles
A/D ou setas movem. Espaço, W ou seta para cima pulam. Segure o salto para estender o pulo, planar com Nira ou subir nas correntes de vento. X ou Shift rolam ou investem. C troca o herói. E arremessa o parceiro uma vez por salto ou ativa um marco carregado. Esc ou P pausam. Na tela sensível ao toque, use os botões direcionais, ↑, ↻, ⇄ e ✧. A orientação horizontal amplia o campo de jogo.

## Objetivos e salvamento
Alcance o farol. Quatro glifos e dois selos recompensam a exploração. O marco da gruta grava o inventário e o tempo daquele ponto no navegador. Ao concluir, o jogo registra o melhor tempo. Uma janela privada ou a limpeza dos dados do site pode apagar o progresso.

## Organização
- index.html e css/style.css — telas, HUD, menus e layout responsivo
- js/level.js — mapa, trechos, superfícies, adversários e itens
- js/world.js — física a 60 Hz, dupla, combate, ressonância e coleta
- js/art.js — câmera, cenários, animação e composição Canvas 2D
- js/audio.js — trilha original e efeitos sintetizados com Web Audio
- js/main.js — entradas, telas, som, ciclo do jogo e persistência
- assets/ — ilustrações e sprites WebP criados para esta edição e emblema vetorial

Edição independente da primeira fase, com apresentação ilustrada em camadas. Não requer compilação ou serviços externos.

## Fase 1-2 • Cascata Escondida
Ao concluir a Trilha das Conchas, escolha **Próxima fase**. No menu, **Fases** permite entrar diretamente em qualquer uma das duas. Cada fase guarda seu próprio marco e melhor tempo. O marco da edição anterior da Trilha das Conchas é importado automaticamente.
Na Cascata Escondida, atravesse os tocos oscilantes e alcance a nascente. Depois do marco, os frutos sobem em direção a uma fenda seca. Segure o salto com Nira para planar por trás da cortina de água. O leito inferior oferece uma travessia alternativa para os dois heróis. O mapa e os efeitos de água da segunda fase estão em js/cascata.js.
