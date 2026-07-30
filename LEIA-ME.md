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

**Não vai neste pacote, de propósito.** O que está no servidor fica como está
até a reescrita da Fase A2.2 estar pronta e revista. Subir um `sw.js` novo sem
isso muda a forma da cache do mapa offline sem ninguém ter verificado.

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

**Treze ficheiros, nenhuma subpasta.** É tudo o que a app carrega hoje.

**O mapa ainda é o Leaflet com tiles da CARTO.** A primeira metade da Fase A2.2
está feita — toda a app deixou de falar com o Leaflet e passa por uma camada
fina escrita em termos do MapLibre — mas **o motor ainda não foi trocado, e não
há interruptor**: o objeto que implementa o MapLibre ainda não existe.

Por isso o `maplibre-gl.js`, os estilos, os glifos e o sprite **não vão neste
pacote**: são cerca de 1,9 MB que nada carrega, e eram eles que traziam as
subpastas `glifos/` e `sprite/` que o upload pela interface achata. Voltam
quando a segunda metade estiver escrita, e nessa altura com nomes de raiz — o
MapLibre exige um `{fontstack}` no molde dos glifos, mas aceita-o no nome do
ficheiro em vez de numa pasta.

⚠️ **O problema de licenciamento da CARTO continua vivo em produção** até essa
segunda metade. É para isso que a A2.2 existe.

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
Nominatim/OpenStreetMap (pesquisa), Overpass (radares fixos), CARTO (fundo do
mapa), cdnjs e jsDelivr (Leaflet, até à troca de motor). O tipo de letra vem
connosco, não do Google.

A lista completa e o que cada um recebe está na **página de privacidade**, que é
a versão que conta — esta é um resumo.
