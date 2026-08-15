/* Levante — service worker
   - app: rede primeiro (atualiza sempre que há net), cache como rede de segurança
   - MAPA: tiles guardados em cache (cache-first) para a viagem não ficar às escuras
     quando falha a rede — inclui pré-descarga do corredor da rota
   - REGRA (dd-55): sempre que uma publicação muda o index, o V muda TAMBÉM —
     um sw byte-igual não dispara ciclo de atualização nenhum, e as janelas
     abertas ficam sem qualquer sinal de que há versão nova. O portão em
     tools/publicar.sh recusa publicar index novo com sw byte-igual. */
/* ═══ levante-v34 — 15/08/2026 ══════════════════════════════
   NOTA DE RELEASE (dd-55: o V sobe SEMPRE que o index muda)

   · OS TEUS SÍTIOS SAEM DAS DEFINIÇÕES. O separador «Sítios» passa a ser a
     casa deles: a tua casa, os guardados, as viagens planeadas e os
     recentes, tudo no mesmo ecrã. Nas Definições fica a linha da casa com o
     «Não é esta? Mudar» — e esse toque leva-te lá com o menu já aberto.
   · OS BOTÕES DA CASA PASSAM A DIZER O QUE FAZEM. Em vez de «Escolher» sem
     objecto: «Mudar a casa ▾» abre 🔍 Procurar uma morada · 📍 Usar onde
     estou agora · 🗺️ Escolher no mapa.
   · AS VIAGENS PLANEADAS APARECEM NOS SÍTIOS, com o dia e a hora — e um
     toque repõe a rota planeada.
   · O «⭐ undefined» MORREU. Um favorito antigo sem nome mostrava
     «undefined» no ecrã, no renomear e no apagar. Agora a app mostra a
     morada; sem morada, a coordenada; sem nada, «Sítio sem nome».
   ══════════════════════════════════════════════════════════ */
/* ═══ levante-v33 — 15/08/2026 ══════════════════════════════
   (arquivo)

   · OS SÍTIOS RECENTES GANHAM A FORMA DA IDA. Cada linha passa a mostrar o
     TRAÇADO da própria rota — um desenho do caminho, sem mapa por baixo, como
     a lombada de um livro numa prateleira. O texto diz qual é; a forma
     encontra-o de relance. Pesa menos de 2 KB, não gasta créditos nenhuns e
     funciona sem rede.
   · E QUEM NUNCA FOI LÁ FICA COM UM PINO. Um sítio que nunca foi destino não
     tem traçado nenhum para mostrar, e a app não inventa um: mostra um pino e
     diz que é um sítio, não uma ida. Os recentes antigos ficam todos assim —
     a partir de agora, cada rota que sai guarda o seu desenho.
   · E TOCAR NUM RECENTE PASSA A LEVAR-TE LÁ. Um sítio recente não é um sítio
     que consultaste — é um sítio onde estiveste, e o gesto óbvio é «leva-me
     lá outra vez». O toque calcula a rota até lá (a partir de casa quando não
     sei onde estás, e digo-o no cartão). Ver só o tempo naquele sítio passa a
     toque longo, e a linha explica os dois.
   ══════════════════════════════════════════════════════════ */
/* ═══ levante-v32 — 14/08/2026 ══════════════════════════════
   NOTA DE RELEASE (dd-55: o V sobe SEMPRE que o index muda)

   · O ANEL PASSA A DIZER QUANTO VIU. Quando falta uma hora de previsão a
     frase já dizia «Provavelmente bom» — mas o número ao lado dizia 100, e
     100 é o que sai quando não há nada de mau para descontar. Dois
     instrumentos, duas respostas, e o leitor a ver uma contradição com
     razão. Agora a calha do anel — o círculo de trás, que é literalmente o
     que falta preencher — fica TRACEJADA enquanto a janela estiver
     incompleta, e volta a contínua quando estiver completa. O arco não se
     toca: continua proporcional ao índice.
   · E SEM DADO NENHUM NÃO HÁ NÚMERO. No caso extremo — nenhuma das horas
     chegou — a app mostrava 100 sem ter olhado para coisa nenhuma. Passa a
     mostrar «—», o anel fica só com a calha, e o ecrã diz por palavras que
     não sabemos dizer. Cinco línguas.
   · O VENTO DE TRAVÉS DEIXA DE TER DUAS RESPOSTAS NO MESMO ECRÃ. A pastilha
     do resumo da rota dizia «vento lateral até ~60 km/h perto do km 0» e a
     linha de perigo, dois blocos abaixo, dizia «km 0–30 · 19:00–19:45» — do
     mesmo vento. Eram duas contas diferentes com dois limiares diferentes.
     Passa a haver uma só: a pastilha diz o mesmo troço e ganha a hora
     («km 0–30 · ~19:00»).
   · E O AGORA PASSA A DIZER O TRAVÉS. Um chip novo, ao lado da humidade e da
     visibilidade, quando as rajadas chegam ao mesmo limiar. Como aqui não há
     rota, não há rumo — o chip diz «lateral até», que é o limite numa estrada
     atravessada ao vento, e a frase inteira está no rótulo. Sem direção de
     vento não aparece.
   · A ROTA DEIXA DE FALHAR CALADA. Escolhias uma morada na pesquisa, a app
     dizia «a calcular rota para X…» — e não desenhava nada. Eram três coisas
     ao mesmo tempo: a origem só se preenchia por GPS (com a localização
     recusada ficava vazia, embora a app conheça a tua casa), a razão da
     falha era escrita dentro do cartão de planeamento, que está fechado para
     quem chega pela pesquisa, e a promessa não tinha par nenhum no fracasso.
     Agora parte de casa quando não sabe onde estás, o cartão abre-se com a
     razão à vista quando alguma coisa falha, e a promessa tem resposta nos
     dois sentidos.
   · E QUANDO FUI EU A ESCOLHER A ORIGEM, DIGO-O. O cartão passa a trazer
     «🏠 De: casa · <sítio> · mudar» sempre que a origem foi suposta e não
     escolhida — uma origem adivinhada em silêncio dá uma rota errada a quem
     não está em casa. Toca-se na linha para a mudar. Cinco línguas.
   · «INTERNET DE VOLTA — A ATUALIZAR A METEOROLOGIA» PASSA A ATUALIZAR MESMO.
     A frase aparecia quando a rede voltava e não atualizava coisa nenhuma —
     era uma promessa sem nada por trás. Agora pede a previsão outra vez, e se
     ela não vier diz-o pelo mesmo sítio por onde prometeu.
   · E MAIS DUAS PROMESSAS GANHAM RESPOSTA. O botão «Mostrar outros…» da
     pesquisa dizia «A procurar…» e, se a busca falhasse, deixava a lista na
     mesma sem uma palavra. E «A obter a tua posição…» respondia noutro canto
     do ecrã. As duas passam a responder onde perguntaram.
   · A LINHA DA ROTA PASSA A ACOMPANHAR O ZOOM. Era uma largura fixa — 5 px em
     qualquer zoom. Longe tapava a região; em cima da rua quase não se via.
     Agora cresce com o zoom, e o critério é o chão: aos zooms de rua vale a
     largura de uma estrada (5,2 a 7 m em todos os mercados, do sul de França
     ao norte da Alemanha) e ao zoom de região é um traço de ~66 m, que é o
     que ali serve. O contorno passa a ser uma moldura a sério em vez de uma
     linha empilhada por baixo, e os trajetos alternativos ficam sempre mais
     finos do que o escolhido.
   ══════════════════════════════════════════════════════════ */
/* ═══ levante-v31 — 14/08/2026 ══════════════════════════════
   NOTA DE RELEASE (dd-55: o V sobe SEMPRE que o index muda)

   · NA ROTUNDA, A VOZ CONTA SAÍDAS EM VEZ DE LER PLACAS. Lá dentro dizia o
     nome da rua — e um nome de rua não se lê a inclinar, de capacete. Agora
     a aproximação diz «na rotunda, 3ª saída para X» e, já lá dentro, «3ª
     saída». Cinco línguas.
   · E O AVISO DE CALOR DEIXA DE SE REPETIR. Sempre que a app recalculava a
     rota esquecia tudo o que já tinha dito, e voltava a anunciar os mesmos
     perigos — a temperatura máxima incluída. Um facto que não mudou passa a
     ser dito uma vez só. As indicações de condução continuam a ser
     recalculadas, que essas mudam mesmo.
   ══════════════════════════════════════════════════════════ */
/* ═══ levante-v30 — 13/08/2026 ══════════════════════════════
   NOTA DE RELEASE (dd-55: o V sobe SEMPRE que o index muda)

   · OS SETE DIAS VOLTAM A DIZER O QUE SÃO. A faixa mostrava verde, amarelo,
     laranja e vermelho e mais nada — três cores e nenhuma palavra. Cada dia
     volta a trazer o veredicto escrito ao lado do ponto: «Bom · Aviso ·
     Risco · Mau», nas cinco línguas, com a frase inteira no rótulo para quem
     ouve o ecrã. O 🥵 e o número do calor ficam ao lado da palavra, não no
     lugar dela.
   · OS SÍTIOS DIZEM O QUE FAZEM. «Redefinir por pesquisa» não queria dizer
     nada — não se redefine nada, escolhe-se a casa. As três acções passam a
     «Escolher pesquisando · Usar a minha posição · Tocar no mapa», nas cinco
     línguas.
   · E OS RECENTES PASSAM A RESPONDER AO DEDO. Eram uma lista onde o único
     gesto possível era apagar: tocar na linha passa a usar aquele sítio, e o
     ⭐ guarda-o nos Guardados com o nome que quiseres. A tua CASA não se
     mexe com isso — para a mudar continua a ser preciso dizê-lo.
   ══════════════════════════════════════════════════════════ */
/* ═══ levante-v29 — 13/08/2026 ═══════════════════════════════════════════
   NOTA DE RELEASE (dd-55: o V sobe SEMPRE que o index muda)

   · A VOZ DIZ A SAÍDA CERTA DA ROTUNDA. Dizia «primeira saída» onde era a
     terceira — o pior defeito que esta app teve, porque manda fazer a coisa
     errada em movimento. A app lia o número da PLACA de uma saída de
     autoestrada onde devia ler a contagem de saídas da rotunda.
   · E QUANDO O NÚMERO NÃO EXISTE, DEIXA DE O INVENTAR. Sem número, a voz diz
     que há uma rotunda e para onde se sai — e cala o que não sabe.
   · NAVEGAÇÃO EM NEERLANDÊS. Quem tinha a app em NL ouvia as indicações de
     condução em PORTUGUÊS, ditas por uma voz neerlandesa. Faltava a língua
     inteira na navegação.
   · A ROTA DE RESERVA DIZ QUE É DE RESERVA. Sem chave de rotas, o trajeto vem
     de um serviço com perfil de CARRO — e as horas de cada troço podem estar
     deslocadas. Passa a estar escrito no ecrã, só quando acontece.
   · A HORA DE PASSAGEM DEIXA DE ASSUMIR EXCESSO DE VELOCIDADE. O motor de
     rotas era interrogado em perfil de MOTA, que devolve tempos mais baixos do
     que o de carro — e numa mota o limite de velocidade é o mesmo. Passa a
     perguntar em perfil de carro.
   · O AVISO DAS NOTIFICAÇÕES DEIXA DE INVENTAR UMA MUDANÇA DE CASA que nunca
     houve, sai de cima do veredicto, e passa a poder dispensar-se — deixando a
     marca junto à Sentinela, para dispensar não ser esquecer.
   ═══════════════════════════════════════════════════════════════════════════ */
/* ═══ levante-v27 — 12/08/2026 ═══════════════════════════════════════════
   NOTA DE RELEASE (dd-55: o V sobe SEMPRE que o index muda)

   · **A RESPOSTA PASSA A ESTAR NO TOPO.** Os separadores saíram do cimo do
     ecrã e passaram a uma barra fixa em baixo, onde o polegar já está. Com o
     espaço que libertaram, o logótipo e a pesquisa juntaram-se numa linha só.
     A altura até à frase que decide — «Vai de moto!» — caiu de 250 px para
     91, e o que se vê sem rolar passou de duas peças para seis.
   · **DUAS SECÇÕES NOVAS, que estavam escondidas.** Os 7 DIAS deixam de viver
     no fundo do Agora e passam a ter aba própria — e agora cabem os sete no
     ecrã, em linhas com barra de mínima e máxima, em vez de quatro cartões e
     rolar. Os SÍTIOS deixam de estar atrás de uma gaveta: casa, guardados e
     recentes ficam a um toque.
   · **O CAMPO DE PESQUISA DIZ ONDE ESTÁS.** Em vez de «Pesquisar cidade ou
     sítio», mostra o sítio para que a app está a prever. A lupa à esquerda
     diz que se toca ali.
   · **O QUE VESTIR SOBE, o contexto desce.** Logo abaixo do veredicto vêm a
     que horas melhora e o equipamento. Humidade, visibilidade, UV, sol,
     perfil e proveniência continuam todos — juntos, num cartão de contexto no
     fim. Nada se perdeu; mudou de sítio.
   · **CORREÇÕES DE TEXTO.** Os veredictos dos dias deixam de ser cortados a
     meio da palavra («Mau p/ mo»); em francês, os sinais « ! ? : ; » deixam
     de saltar sozinhos para a linha seguinte; e uma data desconhecida deixa de
     aparecer como «01/01/1970».
   ═══════════════════════════════════════════════════════════════════════════ */
/* ═══ levante-v26 — 11/08/2026 (publicada) ═══════════════════════════════════════════
   NOTA DE RELEASE (dd-55: o V sobe SEMPRE que o index muda)

   · A PESQUISA DEIXA DE MISTURAR DUAS BUSCAS NUMA LISTA. Quando escreves uma
     marca, a lista é só dessa marca — acabaram os «McDonald's» a 151 km que
     eram sítios com nome parecido.
   · UMA PERGUNTA SÓ, ATÉ AOS 50 km. A escada parava no primeiro anel e
     escondia o que estava a seguir: quem está no campo passa a ver a loja a
     40 km, que antes nunca aparecia. E é mais rápido, não mais lento.
   · CADA LINHA DIZ O QUE É, EM TODAS AS BUSCAS. A etiqueta («fast food»,
     «pensão», «lugar») aparecia só nos resultados de perto. Agora um lugar
     chamado como uma loja aparece etiquetado LUGAR, e vê-se num relance.
   ═══════════════════════════════════════════════════════════════════════════ */
/* ═══ levante-v25 — 10/08/2026 (publicada) ═══════════════════════════════════════════
   NOTA DE RELEASE (dd-55: o V sobe SEMPRE que o index muda)

   · O MICROFONE VOLTA A ESTAR DENTRO DO CAMPO de pesquisa. Tinha saído para
     cima do botão do GPS, meio fora do cartão, e a culpa foi da obra da
     versão anterior: para a lista de resultados ocupar a barra inteira, o
     campo perdeu a âncora que segurava o 🎤. Agora a lista é irmã do campo em
     vez de filha, e cada um tem a sua âncora — as duas coisas cabem.
   · O TEXTO DO CAMPO DEIXA DE CORTAR A MEIO DE UMA PALAVRA. Dizia «Pesquisar
     cid…». A app passa a medir o próprio texto contra o próprio campo e a
     ficar com a frase mais informativa que lá cabe, em cada língua e em cada
     largura — em vez de um limiar adivinhado.
   · Quando o ajuste do texto falhar, a app queixa-se uma vez na consola em
     vez de ficar calada.
   ═══════════════════════════════════════════════════════════════════════════ */
/* ═══ levante-v24 — 10/08/2026 (publicada) ═══════════════════════════════════════════
   NOTA DE RELEASE (dd-55: o V sobe SEMPRE que o index muda)

   · dd-204 §2 — as moradas dos resultados deixam de ser cortadas: a lista de
     pesquisa passou de 167 px para 294 num ecrã de 320, e a morada tem duas
     linhas. E a app **deixou de deslizar de lado** em português e francês.
   · dd-204 §2 — a pastilha do calor na faixa dos 7 dias diz «🥵 37°»; a frase
     inteira continua a ser lida por quem usa leitor de ecrã.
   · dd-207 §1 — orçamento de tempo declarado (900 ms): passado ele, a caixa
     diz que ainda está a procurar, sem apagar o que já mostrou.
   · dd-210 §1 — os LUGARES: escrever «Portugal» devolve o país, não uma rua
     com o mesmo nome.
   · 36 frases que apareciam em português a quem tem a app em neerlandês —
     incluindo o veredicto do ecrã principal — passaram a estar traduzidas.
   ═══════════════════════════════════════════════════════════════════════════ */
/* ═══ levante-v29 — 12/08/2026 ═══════════════════════════════════════════════
   NOTA DE RELEASE (dd-55: o V sobe SEMPRE que o index muda)

   · **A Sentinela deixou de avisar com precisão que não existe.** Ela dizia
     «chuva daqui a 12 minutos» a partir do campo de quartos de hora da
     Open-Meteo — e esse campo só é medido onde correm modelos de alta
     resolução (Europa Central e América do Norte). Fora daí é **interpolado
     da previsão horária**, e a resposta não distingue um do outro. Em
     Portugal e em Espanha, a voz que interrompe alguém na estrada estava a
     falar de uma reta traçada entre dois valores. Agora a Sentinela decide
     pela previsão **horária** e diz a hora: «chuva a chegar por volta das
     15h». Menos precisão aparente, e a que fica é observada.
   · Os alvos de toque do 📍 e do 🎤 dentro do campo de pesquisa passaram de
     30 e 31 px para **44** — o mínimo publicado da Apple. O desenho não
     mudou de tamanho nem de sítio: cresceu a caixa que recebe o dedo.
   · O anel do índice dizia **MOTORIND / EX** em neerlandês. Passou a partir
     o composto onde ele se parte: MOTOR- / INDEX.
   · O cartão do equipamento diz agora a que janela se refere no próprio
     título — «🧤 Equipamento · próximas 6 h» — em vez de num subtítulo.
   ═══════════════════════════════════════════════════════════════════════════ */
const V = "levante-v34";
const TILES = "levante-tiles-v1";
/* a cache de tiles do nome antigo continua a ser lida — quem já tinha o mapa
   descarregado não fica sem ele por causa de uma mudança de nome */
const TILES_ANTIGO = "vdm-tiles-v1";
const TILE_MAX = 2600;          // ~40 MB; acima disto apagam-se os mais antigos
/* dd-78/dd-74 (b): saíram os dois ficheiros do Leaflet no cdnjs. O Leaflet
   morreu na A2.2 e o mapa é MapLibre há muito — mas o mal não era só guardar
   uma biblioteca a mais: o `cache.addAll` **falha inteiro** se UM dos pedidos
   não responder, e estes dois eram os únicos que saíam de casa. Um cdnjs lento
   ou bloqueado e o service worker **não instalava** — a app ficava sem cache,
   sem mapa offline e sem sinal de versão nova, por causa de uma biblioteca que
   já não usamos. */
const SHELL = [
  "./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./privacidade.html", "./termos.html",
  /* dd-82: a página de créditos entra no shell, autorizada no mesmo pacote.
     Era o item aberto do rel-58 §5: sem isto, o ⓘ do mapa levava a uma página
     que só existia depois de aberta uma vez com rede — e a atribuição é
     condição de licença, não um extra. O sítio dela é ao lado das outras duas
     legais, que já cá estavam. */
  "./creditos.html",
  "./paises.json",
  /* ⚠️ dd-228: O MOTOR DO MAPA ENTRA NO SHELL PORQUE SAIU DO `index.html`.
     Ele deixou de ser pedido por uma etiqueta no arranque — passou a ser
     carregado ao entrar na Rota — e sem esta linha deixava de ser guardado
     por acaso na primeira visita. Quem instalasse a app e ficasse sem rede
     antes de abrir a Rota ficava sem mapa.
     Aqui é descarregado no `install`, em segundo plano, **fora do caminho
     crítico da primeira pintura**: o utilizador vê a app enquanto isto vai
     acontecendo. Guardado de propósito em vez de por acaso. */
  "./maplibre-gl.js",
  "./maplibre-gl.css",
];
/* dd-78/dd-74 (c): só o OpenFreeMap serve tiles nesta app. O CARTO saiu no
   dd-16 §2 e o tile.openstreetmap.org e o stadiamaps nunca chegaram a entrar —
   ficaram aqui da era raster. Um host a mais nesta lista não é inofensivo:
   manda qualquer resposta desses domínios pelo caminho dos tiles, com a cache
   de 2600 entradas e o tile-de-falta em vez do caminho normal. */
const TILE_HOSTS = /(^|\.)(tiles?\.openfreemap\.org)$/;
const isTile = (u) => TILE_HOSTS.test(u.host);
/* ═══ dd-78/dd-74 (a) — O TILE QUE FALTA, NO FORMATO QUE O MOTOR LÊ ════════
   ISTO ERA O MAPA BRANCO. Aqui devolvia-se um **SVG 256×256** — a grelha
   cinzenta da era raster — a um pedido de tile **VETORIAL**. O MapLibre pede
   um protobuf, recebe SVG, não consegue interpretar e **não desenha nada**.
   Sem rede, ou fora do corredor que estava descarregado, cada tile em falta
   apagava o mapa: foi o que o Ricardo viu a meio de uma viagem (dd-78), e foi
   o que ficou previsto por escrito no relatório 57 §2.

   O que se devolve agora é o tile vetorial sintético de **42 bytes** — um
   polígono que cobre o tile todo, numa camada `levante_falta` que só nós
   conhecemos e que os dois estilos publicados pintam com um tom e uma
   hachura. É o mecanismo que existe desde a A2.2 e que nunca chegou a
   funcionar no ar por causa desta linha.
   A diferença que isto faz para quem vai a conduzir: um tile que não temos
   deixa de ser o vazio, e passa a dizer **"isto não está descarregado"** — que
   é outra informação, e a certa. */
const FALTA_MVT = "Gih4AgoNbGV2YW50ZV9mYWx0YRISGAMiDgkfHxrAQAAAwEC/QAAPKIAg";
const FALTA_TIPO = "application/vnd.mapbox-vector-tile";
function faltaResposta() {
  const bin = atob(FALTA_MVT);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return new Response(buf, { headers: { "Content-Type": FALTA_TIPO } });
}

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks
        .filter((k) => k !== V && k !== TILES && k !== TILES_ANTIGO)
        .map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* apaga os tiles mais antigos quando a cache cresce demais */
async function trimTiles() {
  const c = await caches.open(TILES);
  const keys = await c.keys();
  if (keys.length <= TILE_MAX) return;
  const drop = keys.length - Math.floor(TILE_MAX * 0.8);
  for (let i = 0; i < drop; i++) await c.delete(keys[i]);
}

async function tileResponse(req) {
  const c = await caches.open(TILES);
  let hit = await c.match(req, { ignoreVary: true });
  if (!hit) {                                // cai para a cache do nome antigo
    const velha = await caches.open(TILES_ANTIGO);
    hit = await velha.match(req, { ignoreVary: true });
  }
  if (hit) return hit;                       // offline-first: o que já viste, vês sempre
  try {
    const res = await fetch(req);
    if (res && (res.ok || res.type === "opaque")) {
      c.put(req, res.clone()).then(trimTiles).catch(() => {});
    }
    return res;
  } catch (err) {
    return faltaResposta();
  }
}

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (isTile(u)) { e.respondWith(tileResponse(e.request)); return; }

  const sameOrigin = u.origin === self.location.origin;
  /* dd-78/dd-74 (b), a segunda metade: o cdnjs saiu do SHELL e sai também
     daqui. Era o par da mesma coisa — este ramo existia para servir e guardar
     o Leaflet, e sem ele qualquer resposta do cdnjs passava a ser guardada na
     cache do shell sem ninguém a pedir. Nada nosso vem de um CDN: o motor do
     mapa, o estilo, os glifos, o sprite e a letra vêm todos de casa. */
  if (!sameOrigin) return;                   // APIs meteo/rotas/radar: sempre rede (dados frescos)
  if (sameOrigin && /\/versao\.json$/.test(u.pathname)) return;  // frescura: sempre rede, NUNCA desta cache — em cache, diria para sempre "estás atualizado"
  const putCache = (res) => {
    const copy = res.clone();
    caches.open(V).then((c) => c.put(e.request, copy)).catch(() => {});
    return res;
  };
  if (e.request.mode === "navigate" || (sameOrigin && /index\.html$/.test(u.pathname))) {
    e.respondWith(
      fetch(e.request).then(putCache)
        .catch(() => caches.match(e.request, { ignoreSearch: true })
          .then((h) => h || caches.match("./index.html")))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: sameOrigin })
      .then((hit) => hit || fetch(e.request).then(putCache))
  );
});

/* pré-descarga do corredor da rota (pedida pela app quando calculas um trajeto) */
async function precache(urls, client) {
  const c = await caches.open(TILES);
  let done = 0, saved = 0;
  const queue = urls.slice(0, 2200);
  const worker = async () => {
    while (queue.length) {
      const url = queue.shift();
      try {
        const req = new Request(url, { mode: "cors" });
        const hit = await c.match(req, { ignoreVary: true });
        if (!hit) {
          const res = await fetch(req);
          if (res && (res.ok || res.type === "opaque")) { await c.put(req, res.clone()); saved++; }
        }
      } catch (err) { /* segue: sem rede, guarda o que der */ }
      done++;
      if (client && done % 25 === 0)
        client.postMessage({ type: "PRECACHE_PROGRESS", done, total: urls.length });
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);  // 4 em paralelo
  await trimTiles();
  if (client) client.postMessage({ type: "PRECACHE_DONE", done, saved, total: urls.length });
}

self.addEventListener("message", (e) => {
  const d = e.data || {};
  if (d.type === "PRECACHE_TILES" && Array.isArray(d.urls)) {
    e.waitUntil(precache(d.urls, e.source));
  } else if (d.type === "TILES_INFO") {
    e.waitUntil(caches.open(TILES).then((c) => c.keys()).then((k) => {
      e.source && e.source.postMessage({ type: "TILES_INFO", count: k.length });
    }));
  } else if (d.type === "TILES_CLEAR") {
    e.waitUntil(caches.delete(TILES).then(() => {
      e.source && e.source.postMessage({ type: "TILES_INFO", count: 0 });
    }));
  }
});
