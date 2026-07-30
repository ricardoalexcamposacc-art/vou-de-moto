# Levante

Meteorologia para motociclistas: o tempo ao longo do teu trajeto **à hora a que
vais passar em cada ponto**. Não é o tempo agora no destino — é o tempo que vais
apanhar em cada troço, à hora a que lá chegares.

Dois separadores: **Agora** (devo ir de mota?) e **Rota** (o trajeto pintado com
o tempo previsto, mais paragens, perigos e radares fixos conhecidos).

---

## Publicar

O site vive em `ricardoalexcamposacc-art.github.io/vou-de-moto/`, servido pelo
repositório **`ricardoalexcamposacc-art/vou-de-moto`**, branch **`main`**, pasta
**`/ (root)`**.

1. No repositório: **Add file → Upload files**.
2. Arrasta os **treze ficheiros**. Não há subpastas nenhumas — foi de
   propósito: o arrasto de pastas no browser achata-as e deixa os ficheiros
   soltos na raiz.
3. **Commit changes** em `main`.
4. Espera 1–2 minutos e recarrega.

### Confirmar que chegou

Abre as **definições da app** ou o fim da **página de privacidade** e lê o
carimbo: `Versão 2026-…`. Se não mudou, a publicação não chegou. Foi para isto
que o carimbo existe — passámos um dia sem conseguir responder a esta pergunta.

Se no computador o carimbo já mudou e no telemóvel continuares a ver a versão
antiga, é o **service worker** a servir da cache: fecha a app por completo e
reabre.

### O `sw.js`

⚠️ **ESTE PACOTE INCLUI O `sw.js` — COM UMA ÚNICA LINHA MUDADA:
`V="levante-v9"`** (aprovado no do-diretor-16 §3). O bump descongela o
manifest, os ícones e o `paises.json` para quem já tem a app — sem ele, os
subrecursos ficavam presos na cache antiga. Antes de o subir, confirma no
browser que o que está no ar diz `V="levante-v8"`. O resto do ficheiro está
byte a byte igual ao que está no ar; a reescrita a sério do SW continua a
ser um bloco futuro, com o contrato do dd-07 §2 (e a atualização nunca
interrompe uma viagem, dd-09).

---

## O que está nesta pasta

| Ficheiro | O que é |
|---|---|
| `index.html` | a app inteira — um ficheiro só, sem framework nem passo de compilação |
| `privacidade.html` · `termos.html` | páginas legais, ligadas do rodapé |
| `manifest.webmanifest` | nome, ícones e `display: standalone` para instalar |
| `fundo.html` | ferramenta de medição: a Sentinela dispara mesmo em segundo plano? |
| `paises.json` | fronteiras (Natural Earth 1:50m) para saber o país sem rede e sem créditos |
| `inter-latin.woff2` · `inter-latin-ext.woff2` | o tipo de letra, alojado por nós |
| `icon.svg` · `icon-192.png` · `icon-512.png` · `apple-touch-icon.png` | ícones |

**O mapa é o MapLibre com estilo de casa e tiles do OpenFreeMap** (A2.2
segunda metade, 30/07). O `maplibre-gl.js`, os estilos claro/escuro, os
glifos e o sprite vêm **da nossa origem** — no arranque a app não fala com
terceiro nenhum. Os tiles vetoriais pedem-se ao OpenFreeMap quando abres o
mapa. O Leaflet, a CARTO, o cdnjs e o jsDelivr saíram.

⚠️ **Este pacote traz as subpastas `glifos/` e `sprite/`.** O upload por
arrasto na interface do GitHub achata pastas — se publicares por arrasto,
confirma que os caminhos `glifos/...` e `sprite/...` chegaram como pastas
(ou usa o clone/git, que os preserva sempre). Sem eles o mapa fica sem
letras nem símbolos.

---

## Instalar no telemóvel

**Android (Chrome):** abre o link → botão **📲 Instalar** no topo, ou menu ⋮ →
*Adicionar ao ecrã principal*.

**iPhone (Safari):** abre o link → **Partilhar** → **Adicionar ao ecrã
principal**. No iPhone isto não é opcional: sem instalar, o Safari apaga os
dados guardados ao fim de sete dias sem visitas.

Instalada, a app corre sem as barras do browser — o que torna possível o ecrã
cheio no Modo viagem.

---

## Avisos e limites

- **A Sentinela e o Modo viagem só funcionam com a app aberta e no ecrã.** Se
  minimizares o browser ou apagares o ecrã, o telemóvel suspende a página e nada
  corre. A app diz-te quanto tempo esteve suspensa quando voltares.
- **Radares:** só os **conhecidos**, vindos do OpenStreetMap, e a cobertura varia
  muito de país para país. Onde a lei não permite, não aparecem — na Suíça nunca,
  em França como zonas alargadas, na Alemanha só se ligares nas definições.
- **Sem contas, também não há cópia nossa.** Se apagares os dados do browser,
  desinstalares ou trocares de telemóvel, perdes o que está guardado.

## Serviços que a app usa

Open-Meteo (previsões), Geoapify (rotas, pesquisa de sítios e moradas), Photon e
Nominatim/OpenStreetMap (pesquisa), Overpass (radares fixos), OpenFreeMap
(tiles do fundo do mapa). O motor do mapa, o estilo, os tipos de letra e os
símbolos vêm connosco — nada de CDNs nem do Google.

A lista completa e o que cada um recebe está na **página de privacidade**, que é
a versão que conta — esta é um resumo.
