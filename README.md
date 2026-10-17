# Site PM3 2027 · protótipo alfa

Páginas-modelo do novo pm3.com.br para aprovação. HTML, CSS e JavaScript estáticos, sem build.

## Como abrir

Abra `index.html` (galeria com todas as páginas) por um servidor local. No Windows, sem Node nem Python:

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Depois acesse http://localhost:5173/. Em qualquer página, o botão **Por quê?** mostra as notas que ligam cada decisão de design ao diagnóstico do site atual. A revisão e as decisões pendentes estão em `decisoes.html`.

## Páginas

| Página | Arquivo | URL no site |
|---|---|---|
| Home | `home.html` | `/` |
| Membership | `membership.html` | `/membership/` |
| Formações | `formacoes.html` | `/formacoes/` |
| Catálogo | `cursos.html` | `/cursos/` |
| Sprints | `sprints.html` | `/sprints/` |
| Pós Tech | `pos-tech.html` | `/pos-tech/` |
| PM3 para empresas | `para-empresas.html` | `/pm3-para-empresas/` |
| Blog (capa) | `blog.html` | `/blog/` |
| FAQ | `faq.html` | `/faq/` |
| Formação Product Manager | `formacao-product-manager.html` | `/curso-product-manager/` |
| Sprint Fundamentos | `sprint-fundamentos-gestao-produtos.html` | `/sprints/gestao-produtos/curso-fundamentos-gestao-produtos/` |

## Estrutura

- `assets/css/tokens.css`: tokens do Design System PM3 v1.0
- `assets/css/base.css`: base, cabeçalho, mega menu, rodapé, banner de consentimento
- `assets/css/components.css`: números, aurora e chamada final
- `assets/css/*.css`: um arquivo por modelo (membership, home, course, showcase, pos, b2b, content)
- `assets/js/layout.js`: injeta cabeçalho, rodapé, consentimento e notas em todas as páginas
- `assets/js/catalogo.js`: fonte única de formações e sprints usada pelas vitrines e pelo catálogo

## Observações

- Protótipo com `noindex`. Preços, números e textos marcados nas notas ainda precisam de confirmação.
- O formulário de empresas não envia dados.
- Fotos e texturas vêm do Design System PM3 (imagens geradas por IA e de banco de imagens): confirmar direitos de uso antes de qualquer publicação externa.
