# 🛒 MiniShop

A modern **mini e-commerce shop** built with:

- ⚡ **ASP.NET Core 9** (Clean Architecture: Domain, Application, Infrastructure, API)  
- 🐘 **PostgreSQL + EF Core** (with Testcontainers for integration tests)  
- 🎨 **Vite + React + Tailwind CSS** (frontend)  
- ✅ **xUnit + FluentAssertions** (testing)  

---

## 🚀 Features

- 🛍️ Product & Category management  
- 🛒 Shopping Cart & Checkout flow  
- 💳 Placeholder Checkout (ready for Stripe/PayPal integration)  
- 🎨 Tailwind-powered responsive UI  
- 🧪 Integration tests with isolated Postgres containers  
- 🧱 Clean architecture with clear separation of concerns  

---

## 📂 Project Structure

```bash
mini-shop/
│
├── src/Server/
│   ├── MiniShop.Api/             # ASP.NET Core API
│   ├── MiniShop.Application/     # Business logic & use cases
│   ├── MiniShop.Domain/          # Entities & core models
│   └── MiniShop.Infrastructure/  # EF Core, persistence & migrations
│
├── src/Web/mini-shop-web/        # Vite + React + Tailwind frontend
│
├── tests/                        # Automated tests
│   ├── MiniShop.Application.Tests
│   └── MiniShop.Api.IntegrationTests
│
└── README.md
````

---

## ⚙️ Prerequisites

* [.NET 9 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)
* [Node.js 20+](https://nodejs.org/) + [pnpm](https://pnpm.io/)
* [Docker](https://www.docker.com/) (for running tests with Testcontainers)
* PostgreSQL (local or Docker)

---

## 🛠️ Setup

### 1️⃣ Clone & Install

```bash
git clone https://github.com/your-username/mini-shop.git
cd mini-shop
```

### 2️⃣ Backend Setup

Create a `appsettings.Development.json` in `src/Server/MiniShop.Api/` with your Postgres connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=minishop;Username=postgres;Password=postgres"
  }
}
```

Run migrations:

```bash
cd src/Server/MiniShop.Api
dotnet ef database update
dotnet run
```

API will be available at 👉 **[http://localhost:5000](http://localhost:5000)**

### 3️⃣ Frontend Setup

```bash
cd src/Web/mini-shop-web
npm install
npm run dev
```

Frontend will be available at 👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🧪 Running Tests

The project uses **Testcontainers** to spin up PostgreSQL in Docker for integration tests.

```bash
dotnet test -v n
```

---
## 📌 Roadmap

* 🔐 Add authentication & roles
* 📦 Order history & invoices
* 🌐 Deployment with Docker Compose

---

## 📜 License

MIT © 2025 \Achraf bouhadou

```
