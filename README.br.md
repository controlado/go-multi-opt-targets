# go-multi-opt-targets

[English](README.md)

Um catálogo pronto de entradas selecionáveis do `Custom Multi-Optimization Target` do Genshin Optimizer.

Use quando precisar de caminhos de targets para ferramentas, scripts ou imports sem abrir o seletor de cada personagem. O workflow de atualização lê o código-fonte do Genshin Optimizer, monta os mesmos dados de personagem usados pelo app e publica arquivos JSON para consumo direto.

## Arquivos

- `data/multi-opt-targets.json`: catálogo legível para inspeção.
- `data/multi-opt-targets.min.json`: catálogo compacto para apps e scripts.
- `data/metadata.json`: commit do Genshin Optimizer, versão, data de geração e totais.
- `data/schema.json`: JSON Schema do catálogo.
- `checksums.txt`: checksums SHA256 dos arquivos publicados.

Cada personagem inclui `characterKey`, `sheetKey`, `genderVariant` quando aplicável, e `targets`.

Cada target inclui o `path` importável, `section`, `key`, flags básicas como `multi`, `variant`, `unit` e `isEmpty`, além de uma label em inglês quando o Genshin Optimizer expõe uma.

## Atualização Local

```sh
npm ci
npm run update:data
npm run ci
```

`update:data` sincroniza `work/genshin-optimizer`, instala as dependências do Genshin Optimizer com download do binário do Cypress desativado e atualiza os arquivos publicados.

## Filtros

O catálogo publicado segue o comportamento do seletor de multi-target customizado:

- `showEmptyTargets: true`
- `flatOnly: true`
- `excludeHeal: true`
- seções excluídas: `basic`, `bonusStats`, `custom`, `character`, `teamBuff`

## Licença

MIT
