
# 💈 Agendador de Horários para Barbearias - THARK

Sistema completo para agendamento de horários, voltado para barbearias, clínicas estéticas e serviços similares. Com ele, clientes podem marcar atendimentos online e administradores têm controle total sobre sua agenda.

---

## 📂 Estrutura do Projeto

```
agendador-saas/
├── backend/        # Backend Django
│   ├── Django/     # Aplicações e configurações do Django
│   ├── requirements.txt
│   └── venv/       # Ambiente virtual (não incluído no versionamento)
├── frontend/       # Frontend React
│   ├── index.html
│   ├── src/        # Código-fonte do React
│   ├── package.json
│   └── ...
└── README.md       # Este arquivo
```

---

## 🚀 Funcionalidades Principais

- Login e cadastro de clientes e administradores
- Agendamento de horários online
- Dashboard administrativo com visualização de agendamentos
- Autenticação JWT
- Integração com Mercado Pago para pagamentos
- Interface moderna com React + TailwindCSS
- Backend robusto com Django Rest Framework
- API REST documentada (OpenAPI/Swagger)

---

## 🛠️ Tecnologias Utilizadas

**Backend:**
- Python 3.11+
- Django
- Django REST Framework
- SQLite3 (padrão) ou PostgreSQL
- Autenticação com JWT
- Mercado Pago SDK

**Frontend:**
- React
- Tailwind CSS
- React Router
- Axios
- Vite (se aplicável)

---

## ⚙️ Como Rodar Localmente

### 🔧 Requisitos
- Python 3.11+
- Node.js 18+
- Git
- Ambiente virtual (recomendado)

### 🔙 Backend (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou .\venv\Scripts\activate no Windows
pip install -r requirements.txt
cd Django
python manage.py migrate
python manage.py runserver
```

### 🖥️ Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` dentro do diretório `backend/Django/` com as seguintes variáveis:

```env
SECRET_KEY=suachavesecreta
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

# Mercado Pago
MP_PUBLIC_KEY=sua_public_key
MP_ACCESS_TOKEN=seu_access_token
```

---

## 📋 Documentação da API

Uma vez o backend rodando, acesse:

```
http://127.0.0.1:8000/api/docs/
```

---

## 📌 Roadmap Futuro

- [ ] Adicionar autenticação social (Google, Facebook)
- [ ] Enviar lembretes por WhatsApp ou e-mail
- [ ] Avaliação dos atendimentos pelos clientes
- [ ] Suporte multi-estabelecimento (barbearias/franquias)
- [ ] App mobile (React Native ou Flutter)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma *issue* ou enviar um *pull request* com melhorias ou correções.

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

## ✨ Autor

Desenvolvido por **THARK**