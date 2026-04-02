## 🐛 Interrompendo Tarefas e o "Bug do React Confuso"

Sabe aquele momento em que você jura que o código está perfeitamente certo, mas
ao testar acontece um comportamento bizarro e inexplicável? Foi exatamente o que
rolou nesta aula!

Vamos primeiro criar a lógica para interromper a tarefa e, em seguida, entender
como resolver o bug do formulário enviando sozinho.

## 🛑 1. Criando a Função `handleInterruptTask`

Quando o usuário clica no botão vermelho de parar, precisamos zerar a tarefa
ativa e os cronômetros, mas **não** vamos zerar o ciclo (`currentCycle`), pois o
usuário continua na jornada dele, apenas interrompeu uma etapa.

Lá no seu `MainForm.tsx`, adicione essa função (pode ser logo abaixo do
`handleCreateNewTask`):

```jsx
function handleInterruptTask() {
  setState(prevState => {
    return {
      ...prevState,
      activeTask: null, // Remove a tarefa ativa
      secondsRemaining: 0, // Zera os segundos totais
      formattedSecondsRemaining: '00:00', // Zera o texto do relógio
    };
  });
}
```

E, claro, precisamos conectar essa função ao `onClick` do nosso botão vermelho
de interrupção no JSX.

## 🤯 2. O Bug: Por que o Formulário Envia Sozinho?

Se você apenas adicionar o `onClick` e usar o **operador ternário**
(`condição ? botao1 : botao2`) como fizemos na aula anterior, vai notar um bug
crítico: ao clicar em "Parar", a tarefa para, mas **imediatamente o formulário é
enviado de novo**, iniciando a próxima tarefa.

**O que está acontecendo por baixo dos panos?** O React tenta ser o mais rápido
e otimizado possível. Quando usamos um ternário para alternar entre dois
elementos muito parecidos (dois `<DefaultButton />`), o React entra em um
processo de Reconciliação.

Ele pensa: "_Hum, saiu um botão e entrou outro botão no exato mesmo lugar. Em
vez de destruir o primeiro no HTML e criar um novo do zero, vou apenas
reaproveitar o botão antigo e trocar a cor e o ícone_". O problema é que, ao
fazer essa reciclagem super rápida, ele acaba carregando o comportamento de
`submit` do botão anterior, disparando o formulário novamente!

## 🛠️ 3. A Solução: Separando os Componentes

Existem várias formas de resolver isso (como usar `e.preventDefault()`), mas a
forma mais robusta e "limpa" para o React entender que são dois botões
completamente diferentes é:

1. **Remover o operador ternário** e usar a checagem lógica independente (&&).
2. **Adicionar uma propriedade** `key` única no botão de interromper, forçando o
   React a reconhecê-lo como um elemento totalmente novo.

Vamos atualizar o final do nosso formulário:

**Arquivo:** `src/components/MainForm/index.tsx`

```tsx
// ... (resto do formulário)

      <div className='formRow'>
        {/* Renderiza apenas se NÃO houver tarefa ativa */}
        {!state.activeTask && (
          <DefaultButton
            aria-label='Iniciar nova tarefa'
            title='Iniciar nova tarefa'
            type='submit'
            icon={<PlayCircleIcon />}
          />
        )}

        {/* Renderiza apenas se HOUVER tarefa ativa */}
        {!!state.activeTask && (
          <DefaultButton
            aria-label='Interromper tarefa atual'
            title='Interromper tarefa atual'
            type='button'
            color='red'
            icon={<StopCircleIcon />}
            onClick={handleInterruptTask}
            key='botao_button' // A chave mágica que evita a confusão do React!
          />
        )}
      </div>
    </form>
```

Pronto! Agora o React vai destruir o botão de Submit da tela e criar um botão
Type Button totalmente novo na DOM, eliminando o comportamento fantasma. Você já
pode testar criando uma tarefa e a interrompendo: você verá apenas uma
renderização no seu `console.log` e o input voltará a ficar liberado para
digitação.
