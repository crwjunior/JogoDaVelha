# Projeto Fullstack Jogo Da Velha: C# API + React/Next.js + PostgreSQL

## Descrição
Aplicação fullstack com backend em C# (.NET 8) usando Entity Framework e PostgreSQL local, e frontend em React com Next.js e TailwindCSS.

## Tecnologias
- **Backend:** C#, .NET 8, Entity Framework Core  
- **Banco de dados:** PostgreSQL (local)  
- **Frontend:** React, Next.js, TailwindCSS  

## Configuração do Backend

1. Clone o repositório:
```bash
git clone <URL_DO_REPO>
cd nome-do-projeto
```
2. Configure o appsettings.json com sua conexão PostgreSQL
```bash
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=nome_do_banco;Username=seu_usuario;Password=sua_senha"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```
3. Crie o banco de dados no PostgreSQL

4. Rode as migrations:
```bash
dotnet ef database update
```
5. Execute a API:
```bash
dotnet run --urls "http://localhost:7134"

```
## Configuração do Frontend
1. Instale as dependências
```bash
npm install
```

2. Rode o projeto
```bash
npm run dev
```

3. Acesse o navegador
```bash
http://localhost:3000
```





