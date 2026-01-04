# Repositori Frontend CrowdFUNding

## Design 🎨

[Figma Link](https://www.figma.com/design/cx6nfLRsgTNUVpFb3RwDoX/Crowdfunding?node-id=0-1&p=f&t=hnNTVo55Xz275bpw-0)

## How To Run 🏃🏻‍♂️

Install all dependencies and run the development server using this command

- **yarn** (recommended)

  ```
  yarn install
  yarn dev
  ```

- **npm**

  ```
  npm i
  npm run dev
  ```

- **pnpm**

  ```
  pnpm i
  pnpm run dev
  ```

## Pull & Push Schema 💪🏻

1. Checkout to develop branch
2. Pull origin develop
3. Create a new branch (Please read the rule below this section)
4. Checkout to the new branch
5. Code
6. Commit (Please follow the commit messages rule)
7. Pull origin develop
8. Push origin "your branch name"
9. Create a new pull request to develop branch and mention me (arya) :v
10. Done

## Branch Naming ✏️

`<type>/<short_description>.<nama_kamu>`

- `<type>` :
  - feature: saya menambahkan fitur baru
  - fixing: saya memperbaiki fitur

Contoh: feature/navbar.iam

## Commit message 📝

`<type>(<scope>): <short_summary>`

- `<type>` :
  - feat: saya menambahkan fitur baru
  - fix: saya memperbaiki fitur

- `<scope>` : ini opsional
- `<short_summary>` : buat sejelas mungkin

Contoh: feat[Homepage]: Creating about section

## Folder Structure 📁

```
- public: file public (including assets)
- app : Contain all pages
- src
    - components : all components (layouts, button, navbar, etc)
        - Contexts: custom context
        - Element : Element kecil - kecil
        - Layout  : Berisi Layout untuk website, default, error, dkk
    - utils : Folder berisi fungsi - fungsi
        - helpers : pembantu (fetch backend, etc)
        - hooks : custom hooks
    - modules: all views
        - [Page name]
            - page.ts
    - styles: kumpulan styling css
```

## Aturan Penulisan Variabel / File 📃

- Gunakan **PascalCase** untuk menulis nama komponen / file komponen website
  DefaultLayout.ts, Navbar.ts
- Gunakan **camelCase** untuk menulis nama variabel / file non komponen
  data.ts, dataFaq.ts, createdAt, dkk
- Selalu gunakan .ts file! Biar keliatan rapi + seragam aja reponya.

## Notes 📰

- kalo branch mu udah di merge, jangan lupa juga buat hapus branch mu dari github (biar rapi :>)

## Clean Code ✍🏻

- [Learn More](https://github.com/ryanmcdermott/clean-code-javascript)
- [Learn More 2](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29#:~:text=Code%20is%20clean%20if%20it,%2C%20changeability%2C%20extensibility%20and%20maintainability.)
