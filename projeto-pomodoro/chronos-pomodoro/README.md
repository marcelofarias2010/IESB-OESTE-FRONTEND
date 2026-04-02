## 🛑 Alternando os Botões: Iniciar e Interromper Tarefa

Mais uma melhoria de usabilidade super simples, mas que faz toda a diferença
visualmente! Agora que o nosso input já fica bloqueado quando uma tarefa está
rolando, precisamos dar ao usuário um botão para parar essa tarefa.

Como não faz sentido ter dois botões na tela ao mesmo tempo (um de iniciar e um
de parar), vamos usar o nosso estado `activeTask` para **alternar** qual botão é
exibido.

## 🔄 1. A Lógica Condicional (O Operador Ternário)

Vamos usar um operador ternário (`condição ? verdadeiro : falso`) no JSX para
decidir qual botão renderizar:

- **Se NÃO houver tarefa ativa** (`!state.activeTask`): Exibimos o botão de
  "Iniciar". Esse botão precisa continuar com o `type='submit'` para disparar o
  envio do formulário.
- **Se houver tarefa ativa:** Exibimos o botão de "Interromper".

**⚠️ Atenção ao detalhe:** O botão de interromper **DEVE** ter o
`type='button'`. Se você deixar como `submit` (ou não declarar, já que o padrão
dentro de um form costuma ser submit), ao clicar nele, o navegador tentará
enviar o formulário novamente, causando um recarregamento indesejado ou bugs na
aplicação.

_Dica de Ouro:_ Repare que no código escrevemos `task` e `activeTask` (em
inglês), mas para o usuário (no `aria-label` e `title`) escrevemos "Interromper
tarefa atual" (em português). É uma ótima prática manter o código em inglês e a
interface no idioma do seu público!

## 💻 2. Aplicando no Código (`MainForm.tsx`)

Primeiro, não se esqueça de importar o ícone de "Stop" lá no topo do arquivo
junto com o ícone de "Play".

```tsx
// Adicione o StopCircleIcon na importação do lucide-react
import { PlayCircleIcon, StopCircleIcon } from 'lucide-react';
```

Agora, vamos substituir a renderização do botão no final do nosso formulário:

**Arquivo:** `src/components/MainForm/index.tsx`

```tsx
// ... (resto do código)

      <div className='formRow'>
        {!state.activeTask ? (
          <DefaultButton
            aria-label='Iniciar nova tarefa'
            title='Iniciar nova tarefa'
            type='submit'
            icon={<PlayCircleIcon />}
          />
        ) : (
          <DefaultButton
            aria-label='Interromper tarefa atual'
            title='Interromper tarefa atual'
            type='button'
            color='red'
            icon={<StopCircleIcon />}
          />
        )}
      </div>
    </form>
  );
}
```

## ✅ 3. Testando o Comportamento

1. Atualize a página. Você deve ver o botão verde com o ícone de Play (estado
   inicial sem tarefa).
2. Digite o nome de uma tarefa e clique em Iniciar (ou aperte Enter).
3. **Mágica!** O input será bloqueado e o botão verde se transformará
   instantaneamente em um botão vermelho com o ícone de Stop.
4. Se você passar o mouse por cima do botão vermelho, verá o tooltip:
   "Interromper tarefa atual".

Neste momento, se você clicar no botão vermelho, nada vai acontecer. Por
enquanto, a única forma de voltar ao botão verde é atualizando a página. Na
próxima aula, vamos criar exatamente a ação de clique desse botão para parar a
tarefa e zerar o nosso estado!
