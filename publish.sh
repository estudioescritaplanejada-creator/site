#!/bin/bash

# 1. Verifica se você deu um nome para a alteração
if [ -z "$1" ]; then
    echo "Erro: Digite uma mensagem. Exemplo: ./publish.sh 'adicionei aula nova'"
    exit 1
fi

# 2. Cria o arquivo .nojekyll se ele não existir
touch .nojekyll

# 3. Roda o script do sitemap
bash build-sitemap.sh

# 4. Envia tudo para o GitHub
echo "Enviando atualizações para o GitHub..."
git add .
git commit -m "$1"
git push origin main

echo "---------------------------------------"
echo "✅ Site publicado com sucesso!"
