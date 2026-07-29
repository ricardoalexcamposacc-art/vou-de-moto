# Levante — como pôr no teu telemóvel (grátis)

Esta pasta é a **app completa, pronta a publicar**. Só precisas de a pôr online
(2 minutos, grátis) e instalar a partir do browser. Fica com ícone próprio,
ecrã completo, GPS, voz e funciona mesmo offline (a interface; os dados meteo
precisam de internet).

## Passo 1 — Publicar grátis no GitHub Pages (recomendado, grátis para sempre)

1. Cria uma conta gratuita em https://github.com (se ainda não tiveres).
2. Canto superior direito → **+** → **New repository**.
   - Nome: `levante` · visibilidade: **Public** → **Create repository**.
3. Na página do repositório: **uploading an existing file** (ou Add file → Upload files).
4. Arrasta para lá **todos os ficheiros desta pasta** (index.html, sw.js,
   manifest.webmanifest e os 3 PNG) → **Commit changes**.
5. **Settings** → **Pages** (menu lateral) → em "Branch" escolhe `main` e
   pasta `/ (root)` → **Save**.
6. Espera ~1 minuto. O teu link fica:
   `https://O-TEU-UTILIZADOR.github.io/levante/`

### Alternativas igualmente grátis
- **Cloudflare Pages** (pages.cloudflare.com): arrasta a pasta, sem cartão.
- **Netlify** (app.netlify.com/drop): arrasta a pasta.

## Passo 2 — Instalar no telemóvel

**Android (Chrome):** abre o teu link → aparece o botão **📲 Instalar** no topo
da app (ou menu ⋮ → *Adicionar ao ecrã principal* / *Instalar aplicação*).
A app fica no teu launcher como qualquer outra.

**iPhone (Safari):** abre o link → botão **Partilhar** (quadrado com seta) →
**Adicionar ao ecrã principal**.

## Dicas
- **Sentinela** e **Modo viagem** avisam com voz/vibração/notificação — **mantém
  a app aberta e visível** (o Modo viagem segura o ecrã aceso sozinho). Com o
  browser minimizado ou o ecrã apagado, o telemóvel congela a página e os avisos
  não chegam.
- A Sentinela fica ligada entre sessões: se a deixaste ligada, volta ligada, e
  diz no cartão que continuou.
- O link funciona também no browser do PC.
- Atualizações: substitui os ficheiros no GitHub e recarrega a app duas vezes.

## Sem chaves, sem custos
A app usa serviços gratuitos: Open-Meteo (previsões), OSRM e Geoapify (rotas),
Photon/Nominatim + OpenStreetMap (pesquisa de sítios), Overpass (radares fixos)
e mapas CARTO. O tipo de letra vem connosco, não do Google. Uso pessoal está
dentro das regras de todos eles. Se um dia a publicares nas lojas para muita
gente, convém pôr as chaves atrás de um servidor teu — está explicado no
pacote Capacitor.
