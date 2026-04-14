## Prática — Formatação de datas com `date-fns`

### Objetivo

Exibir na coluna **Data** da página **History** uma string legível (dia/mês/ano e hora:minuto) a partir do **timestamp** numérico salvo em cada tarefa (`task.startDate`), em vez de mostrar o número bruto ou um formato difícil de ler.

### Por que `date-fns`

Dá para formatar com JavaScript puro (`Date`, `toLocaleString`, etc.), mas a biblioteca **[date-fns](https://date-fns.org/)** é leve, focada em funções puras e muito usada em produção para formatar datas, somar/subtrair intervalos e outras operações. Aqui usamos só **`format`**.

### 1. Instalar a dependência

Instale como dependência de **produção** (não `dev`):

```bash
npm install date-fns
```

No `package.json`, deve aparecer algo como `"date-fns": "^4.x.x"` em `dependencies`.

### 2. Utilitário `formatDate`

Crie o arquivo `src/utils/formatDate.ts` com uma função que:

1. Recebe um **`number`**: o timestamp em milissegundos (como o armazenado em `task.startDate`).
2. Converte para `Date` com `new Date(timestamp)`.
3. Retorna uma string formatada com `format` importado de `date-fns`.

**Padrão de formatação usado no projeto:** `dd/MM/yyyy HH:mm`

- `dd` — dia com dois dígitos  
- `MM` — **mês** (M maiúsculo no padrão do `date-fns`)  
- `yyyy` — ano com quatro dígitos  
- `HH` — hora em 24h  
- `mm` — **minutos** (m minúsculo)

Cuidado na documentação do `date-fns`: **M maiúsculo = mês**, **m minúsculo = minuto**. Confira os tokens em [Format · date-fns](https://date-fns.org/docs/format).

Código de referência (alinhado ao repositório atual):

```ts
import { format } from 'date-fns';

export function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  return format(date, 'dd/MM/yyyy HH:mm');
}
```

### 3. Usar na página History

Em `src/pages/History/index.tsx`:

1. Importe o utilitário: `import { formatDate } from '../../utils/formatDate';`
2. Na célula da coluna **Data**, troque qualquer exibição direta do timestamp por:

```tsx
<td>{formatDate(task.startDate)}</td>
```

Assim a tabela mostra datas no padrão brasileiro com hora, por exemplo `25/03/2025 08:09`.

### Checklist

- [ ] `date-fns` instalado e listado em `dependencies`.
- [ ] `src/utils/formatDate.ts` criado com `format` e padrão `dd/MM/yyyy HH:mm`.
- [ ] History importa `formatDate` e usa `formatDate(task.startDate)` na coluna Data.

### Referências

- [date-fns — documentação](https://date-fns.org/) (instalação, `format`, tokens de data/hora)
