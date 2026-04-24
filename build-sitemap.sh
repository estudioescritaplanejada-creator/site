#!/bin/bash

# Configurações
URL_BASE="https://estudioescritaplanejada-creator.github.io/site"
ARQUIVO_SITEMAP="sitemap.xml"

echo "Gerando sitemap na raiz..."
echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" > $ARQUIVO_SITEMAP
echo "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">" >> $ARQUIVO_SITEMAP

# Procura todos os .html na PASTA ATUAL (raiz), ignorando subpastas
find . -maxdepth 1 -name "*.html" | sed 's|^\./||' | while read -r linha; do
    echo "  <url><loc>$URL_BASE/$linha</loc></url>" >> $ARQUIVO_SITEMAP
done

echo "</urlset>" >> $ARQUIVO_SITEMAP
echo "Sitemap.xml atualizado com sucesso!"
