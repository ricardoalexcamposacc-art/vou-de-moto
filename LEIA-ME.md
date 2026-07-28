# Vou de Moto? — como pôr no teu telemóvel (grátis)

Esta pasta é a **app completa, pronta a publicar**. Só precisas de a pôr online
(2 minutos, grátis) e instalar a partir do browser. Fica com ícone próprio,
ecrã completo, GPS, voz e funciona mesmo offline (a interface; os dados meteo
precisam de internet).

## Passo 1 — Publicar grátis no GitHub Pages (recomendado, grátis para sempre)

1. Cria uma conta gratuita em https://github.com (se ainda não tiveres).
2. Canto superior direito → **+** → **New repository**.
   - Nome: `vou-de-moto` · visibilidade: **Public** → **Create repository**.
3. Na página do repositório: **uploading an existing file** (ou Add file → Upload files).
4. Arrasta para lá **todos os ficheiros desta pasta** (index.html, sw.js,
   manifest.webmanifest e os 3 PNG) → **Commit changes**.
5. **Settings** → **Pages** (menu lateral) → em "Branch" escolhe `main` e
   pasta `/ (root)` → **Save**.
6. Espera ~1 minuto. O teu link fica:
   `https://O-TEU-UTILIZADOR.github.io/vou-de-moto/`

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
- **Sentinela** e **Modo viagem** avisam com voz/vibração/notificação — mantém
  a app aberta (o Modo viagem segura o ecrã aceso sozinho).
- O link funciona também no browser do PC.
- Atualizações: substitui os ficheiros no GitHub e recarrega a app duas vezes.

## Sem chaves, sem custos
A app usa apenas serviços gratuitos e sem registo: Open-Meteo (previsões),
OSRM + OpenStreetMap/Nominatim (rotas e pesquisa de sítios), RainViewer (radar)
e mapas CARTO. Uso pessoal está dentro das regras de todos eles. Se um dia a
publicares nas lojas para muita gente, convém criar contas gratuitas próprias
(ex.: openrouteservice para rotas) — está explicado no pacote Capacitor.
