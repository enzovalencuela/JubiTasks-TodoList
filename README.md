# 💻 MegaJR - Front-End

Repositório do projeto Front-End do Grupo 3 da Mega, desenvolvido com **React**, **Next.js (App Router)** e **Tailwind CSS**.

🔗 **Deploy:** [https://megajr-back-end.onrender.com/](https://megajr-back-end.onrender.com)

---

## 🚀 Tecnologias utilizadas

- [React](https://reactjs.org/)
- [Next.js 13+ (App Router)](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/)
- [npm](https://www.npmjs.com/)

---

## ⚙️ Pré-requisitos

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [npm](https://www.npmjs.com/)

---

## 📥 Como clonar o projeto

Abra o terminal e execute os comandos abaixo:

```bash
# Clone o repositório
git clone https://github.com/MEGA-JR-Grupo-3/megajr-front-end.git

# Acesse a pasta do projeto
cd megajr-front-end
```

---

## 📦 Instalando as dependências

```bash
npm install
```

---

## 🧪 Executando o projeto localmente

```bash
npm run dev
```

Depois disso, abra o navegador e acesse:

```
http://localhost:3000
```

---

## 📁 Estrutura do projeto

```
megajr-front-end/
├── public/                 → arquivos públicos (imagens, ícones, etc.)
├── src/
│   └── app/                → estrutura de rotas e layout (App Router)
│       ├── favicon.ico
│       ├── globals.css     → estilos globais com Tailwind
│       ├── layout.js       → layout principal da aplicação
│       └── page.js         → página inicial
├── .gitignore
├── eslint.config.mjs      → configuração do ESLint
├── jsconfig.json          → configurações de importações
├── next.config.mjs        → configurações do Next.js
├── postcss.config.mjs     → configurações do PostCSS (Tailwind)
├── package.json
├── package-lock.json
└── README.md
```

---

## 🧑‍💻 Boas práticas da equipe

- Crie uma branch com o nome da feature ou correção: `git checkout -b nome-da-feature`
- Após finalizar, faça commit com mensagem clara: `git commit -m "feat: nome da feature"`
- Suba a branch: `git push origin nome-da-feature`
- Abra um Pull Request para revisão

---

## ✅ Checklist para novos colaboradores

- [ ] Clonou o repositório?
- [ ] Instalou as dependências com `npm install`?
- [ ] Executou `npm run dev` e o projeto abriu normalmente?
- [ ] Está usando uma branch separada para suas alterações?
- [ ] Seguiu o padrão do App Router (`src/app`)?

---

Pronto! Agora você pode começar a codar 🎯
