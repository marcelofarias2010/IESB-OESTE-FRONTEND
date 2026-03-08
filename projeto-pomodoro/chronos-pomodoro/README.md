# ♻️ Componentes Dinâmicos: Entendendo Props e Children

Nesta aula, vamos descobrir como deixar nossos componentes reutilizáveis.
Afinal, um componente que exibe sempre o mesmo texto estático ("Olá Mundo") não
é muito útil na prática! Aprenderemos a passar informações dinâmicas para dentro
deles usando **Props**.

---

## 🗿 1. O Problema: Componentes Estáticos

Até agora, nosso componente `<Heading />` tinha o texto "Olá Mundo!" escrito
diretamente (hardcoded) no JSX. Se o utilizarmos várias vezes no `App.jsx`,
veremos exatamente a mesma frase repetida na tela.

Para torná-lo útil, precisamos que o texto venha "de fora" (do arquivo pai) para
"dentro" do componente.

---

## 📦 2. O Objeto `props`

Todo componente React pode receber dados externos através de um parâmetro na sua
função principal. Por convenção, chamamos esse parâmetro de **`props`**
(abreviação de _properties_ ou propriedades).

Se você der um `console.log(props)` num componente recém-criado sem passar nada,
verá que ele é apenas um objeto JavaScript vazio `{}`.

```jsx
export function Heading(props) {
  console.log(props); // Retorna {} inicialmente
  return <h1>Olá Mundo!</h1>;
}
```

## 👶 3. A Propriedade Especial: children

No HTML, nós colocamos textos e outros elementos dentro das tags (ex:
`<p>Meu texto</p>`). Podemos fazer exatamente o mesmo com nossos componentes
React!

Quando passamos algo entre a tag de abertura e a tag de fechamento de um
componente, o React automaticamente pega esse conteúdo e o injeta dentro do
objeto props, numa propriedade especial chamada `children` (filhos).

No `App.jsx`:

```javascript
// Atenção: Agora usamos a tag de abertura e de fechamento!
<Heading>Olá Mundo 1</Heading>
<Heading>Olá Mundo 2</Heading>
```

## 🔑 4. Usando o JavaScript no JSX (As Chaves `{}`)

Para exibir esse conteúdo dinâmico na tela, precisamos avisar ao JSX que vamos
inserir um código JavaScript (no caso, acessar a variável `props.children`).
Fazemos isso utilizando as chaves `{}`.

No `Heading.jsx`:

```javascript
export function Heading(props) {
  return <h1>{props.children}</h1>;
}
```

Pronto! Agora o componente exibe exatamente o texto que foi passado para ele no
App.jsx. Ele se tornou 100% reutilizável!

## 🎛️ 5. Passando Outras Propriedades (Atributos Customizados)

Além do conteúdo `children`, você pode inventar e passar qualquer outro atributo
para o seu componente, de forma muito parecida com os atributos nativos do HTML
(como `id`, `src`, `href`).

No `App.jsx`:

```javascript
<Heading atr1='minha string' atr2={123}>
  Texto do Título
</Heading>
```

- **Strings estáticas:** Podem ser passadas entre aspas duplas "".
- **Números, Variáveis, Objetos ou Booleanos:** Devem ser passados dentro de
  chaves `{}`.

Se você inspecionar o `console.log(props)` no componente agora, verá o objeto
preenchido com todos esses valores:

```javascript
{
  atr1: "minha string",
  atr2: 123,
  children: "Texto do Título"
}
```

Você poderá usar esses valores extras para alterar cores, tamanhos, ou adicionar
lógicas de exibição dentro do seu componente.

## ⚠️ 6. O Aviso do TypeScript (Tipagem Implícita)

Se você estiver utilizando TypeScript (arquivos `.tsx`), notará que a palavra
`props` no parâmetro da função ficará sublinhada com um aviso de que ela possui
o tipo implícito `any`.

Isso ocorre porque o TypeScript ainda não sabe quais propriedades (e quais tipos
de dados) o seu componente espera receber de fora. Na próxima aula, aprenderemos
como "tipar" essas `props` para resolver esse aviso e garantir um código muito
mais seguro e à prova de bugs!
