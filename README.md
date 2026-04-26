# 🎂 Doce Encanto API

API REST em Spring Boot para o Ateliê Doce Encanto — bolos artesanais sob encomenda.

## 🚀 Como rodar

### Opção 1: Docker Compose (recomendado)
```bash
docker-compose up -d
```
Acesse: http://localhost:8080/swagger-ui.html

### Opção 2: Local
1. Instale PostgreSQL e crie o banco `doce_encanto`
2. Ajuste `src/main/resources/application.properties`
3. Execute:
```bash
./mvnw spring-boot:run
```

## 🔑 Login admin padrão
- Email: `admin@doceencanto.com.br`
- Senha: `admin123`

## 📋 Endpoints

### Públicos (sem autenticação)
| Método | URL | Descrição |
|--------|-----|-----------|
| POST | `/auth/login` | Login |
| GET | `/api/produtos` | Listar produtos disponíveis |
| GET | `/api/produtos?categoria=BOLO_DECORADO` | Filtrar por categoria |
| GET | `/api/produtos/{id}` | Detalhe do produto |
| POST | `/api/pedidos` | Criar encomenda |
| GET | `/api/pedidos/consulta/{numeroPedido}` | Consultar status |
| POST | `/api/contato` | Enviar mensagem |

### Admin (requer Bearer Token)
| Método | URL | Descrição |
|--------|-----|-----------|
| GET | `/admin/dashboard` | Resumo estatísticas |
| GET | `/admin/produtos` | Todos os produtos |
| POST | `/admin/produtos` | Criar produto |
| PUT | `/admin/produtos/{id}` | Editar produto |
| DELETE | `/admin/produtos/{id}` | Deletar produto |
| GET | `/admin/pedidos` | Listar pedidos |
| GET | `/admin/pedidos?status=PENDENTE` | Filtrar por status |
| GET | `/admin/pedidos?data=2025-12-25` | Filtrar por data |
| PATCH | `/admin/pedidos/{id}/status` | Atualizar status |
| GET | `/admin/contatos` | Ver mensagens |
| GET | `/admin/contatos?naoLidas=true` | Mensagens não lidas |
| PATCH | `/admin/contatos/{id}/lido` | Marcar como lida |

## 📦 Categorias de produto
`BOLO_DECORADO`, `BOLO_NO_POTE`, `CUPCAKE`, `BRIGADEIRO`, `TORTA`, `DOCINHOS`, `OUTROS`

## 💳 Formas de pagamento
`PIX`, `CARTAO_CREDITO`, `CARTAO_DEBITO`, `DINHEIRO`, `TRANSFERENCIA`

## 📊 Status do pedido
`PENDENTE` → `CONFIRMADO` → `EM_PRODUCAO` → `PRONTO` → `ENTREGUE` (ou `CANCELADO`)

## 🔒 Autenticação
```bash
# Login
POST /auth/login
{ "email": "admin@doceencanto.com.br", "senha": "admin123" }

# Usar token nas rotas admin
Authorization: Bearer <token>
```

## 📖 Documentação Swagger
Disponível em: `http://localhost:8080/swagger-ui.html`
