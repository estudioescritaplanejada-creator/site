#!/bin/bash

# Configurações
URL_BASE="https://estudioescritaplanejada-creator.github.io/site"
ARQUIVO_SITEMAP="sitemap.xml"

echo "Gerando sitemap..."
echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" > $ARQUIVO_SITEMAP
echo "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">" >> $ARQUIVO_SITEMAP

# Adiciona o index da raiz
echo "  <url><loc>$URL_BASE/index.html</loc></url>" >> $ARQUIVO_SITEMAP

# Procura todos os .html dentro da pasta 'paginas' e subpastas
# Usei 'paginas' pois vi que é o nome da sua pasta no ls -la
find paginas -name "*.html" | while read -r linha; do
    echo "  <url><loc>$URL_BASE/$linha</loc></url>" >> $ARQUIVO_SITEMAP
done

echo "</urlset>" >> $ARQUIVO_SITEMAP
echo "Sitemap.xml atualizado com sucesso!"
