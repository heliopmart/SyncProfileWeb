# 🌐 CloudSync Web - Plataforma de Armazenamento e Sincronização de Arquivos

🚀 **CloudSync Web** é uma plataforma moderna para gerenciamento e sincronização de arquivos na nuvem, construída com **Next.js** e **TypeScript**. O sistema utiliza **Firebase Firestore** para armazenamento de metadados e é integrado com diversas APIs, como **Azure**, **GitHub API** e **Firebase**. A infraestrutura do projeto é distribuída para garantir alta performance e escalabilidade:

- **Frontend** hospedado na **Vercel** 📡  
- **Backend** desenvolvido em **Next.js (API Routes)** e hospedado no **Railway** 🔧  
- **Sincronização e Armazenamento** conectados ao **Azure Blob Storage** e **Firebase** ☁  

## 🔧 Tecnologias Utilizadas

- **Next.js + TypeScript** – Framework moderno e escalável para desenvolvimento full-stack.
- **Firebase Firestore** – Banco de dados NoSQL para armazenar informações dos arquivos e sincronizações.
- **Vercel** – Hospedagem do frontend com deploy contínuo.
- **Railway** – Infraestrutura para o backend API (Next.js API Routes).
- **Azure Blob Storage** – Gerenciamento e armazenamento de arquivos.
- **GitHub API** – Integração para funcionalidades de versionamento e autenticação.
- **Firebase Authentication** – Controle de acesso seguro.
- **Box.com** – Armazenamento de arquivos em nuvem
- **SyncProfileApp** – Plataforma em C# para syncronização de arquivos em tempo de execução

## 📌 Funcionalidades

✅ **Upload e Download de Arquivos** – Sincronização eficiente utilizando APIs de armazenamento.  
✅ **Autenticação Segura** – Login via Firebase Authentication.  
✅ **Gerenciamento de Pastas e Permissões** – Controle de acesso para usuários.  
✅ **Sincronização Automática** – Backend otimizado para atualização em tempo real.  
✅ **Monitoramento e Logs** – Registro de alterações e histórico de arquivos.  

## 🚀 Deploy e Configuração

1. Clone o repositório:  
   ```bash
   git clone https://github.com/heliopmart/SyncProfileWeb.git
   cd SyncProfileWeb
   ```

2. Instale as dependências:  
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente `.env.local`:  
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING=...
   ```

4. Execute o ambiente de desenvolvimento:  
   ```bash
   npm run dev
   ```

5. Para rodar o backend localmente:  
   ```bash
   npm run start
   ```

## 📖 Documentação

- [Guia da API](https://developer.box.com/) 📜  
- [Autenticação Firebase](https://firebase.google.com/docs/auth/) 🔐  
- [Armazenamento Azure](https://learn.microsoft.com/en-us/azure/storage/) ☁  

---

📌 **Contribuições são bem-vindas!** Caso tenha sugestões ou encontre problemas, abra uma _issue_ ou envie um _pull request_. 🚀
