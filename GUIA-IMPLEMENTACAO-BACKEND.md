# 📄 Guia de Implementação - PDF Backend

## 🎯 Objetivo

Criar endpoint REST para gerar PDF com informações completas do evento/show.

---

## 📦 Arquivos para Copiar

Os arquivos estão na pasta `backend-code-examples/` deste repositório:

1. **PdfController.java** → `src/main/java/com/graxa/backend/controller/`
2. **PdfService.java** → `src/main/java/com/graxa/backend/service/`
3. **PdfGeneratorService.java** → `src/main/java/com/graxa/backend/service/`
4. **template-pdf-evento.html** → `src/main/resources/templates/`
5. **generate-pdf.js** → `scripts/` (na raiz do projeto backend)

---

## 🔧 Dependências Maven

Adicione no `pom.xml`:

```xml
<!-- Mustache para templates HTML -->
<dependency>
    <groupId>com.github.spullara.mustache.java</groupId>
    <artifactId>compiler</artifactId>
    <version>0.9.10</version>
</dependency>
```

---

## 📋 Pré-requisitos

### Node.js e Puppeteer

1. Instalar Node.js (se ainda não tiver)
2. Na pasta `scripts/` do backend:

```bash
cd scripts
npm install puppeteer
```

---

## 🔌 Endpoint Criado

```
GET /shows/{showId}/pdf
```

**Resposta:** Arquivo PDF (application/pdf)

**Headers:**

- `Content-Disposition: attachment; filename="evento_{id}.pdf"`
- `Content-Type: application/pdf`

---

## 📊 Dados Incluídos no PDF

✅ Informações básicas do evento (nome, data, local)  
✅ Agenda completa com horários e status  
✅ Logística (hotéis, transportes, voos)  
✅ Colaboradores alocados  
✅ Bandas participantes  
✅ Barra de progresso

---

## 🧪 Como Testar

### 1. Via Swagger

```
http://localhost:8080/swagger-ui/index.html
GET /shows/{showId}/pdf
```

### 2. Via cURL

```bash
curl -X GET "http://localhost:8080/shows/1/pdf" \
  -H "Authorization: Bearer SEU_TOKEN" \
  --output evento.pdf
```

### 3. Via Frontend

- Acesse um evento no frontend
- Clique no botão "Baixar PDF" (botão verde)

---

## 🛠️ Métodos dos Repositórios Necessários

Verifique se seus repositórios têm estes métodos:

```java
// AgendaEventoRepository
List<AgendaEvento> findByShowIdOrderByOrdem(Long showId);

// HotelEventoRepository
List<HotelEvento> findByShowId(Long showId);

// TransporteEventoRepository
List<TransporteEvento> findByShowId(Long showId);

// AlocacaoRepository
List<Alocacao> findByShowId(Long showId);
```

Se não tiver, adicione aos respectivos repositórios.

---

## ⚙️ Configuração do application.properties

```properties
# Timeout aumentado para geração de PDF
server.connection-timeout=60000

# Tamanho máximo de resposta
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

---

## 🐛 Troubleshooting

### Erro: Template não encontrado

- Certifique-se que `template-pdf-evento.html` está em `src/main/resources/templates/`

### Erro: Node.js não encontrado

- Instale Node.js: https://nodejs.org/
- Ou use caminho absoluto no `PdfGeneratorService.java` (linha do ProcessBuilder)

### Erro: Puppeteer não instalado

```bash
cd scripts
npm install puppeteer
```

### PDF em branco

- Verifique se os dados do show estão sendo buscados corretamente
- Adicione logs em `PdfService.java` para debug

### Timeout

- Aumente o timeout em `application.properties`
- Ou no frontend: `pdfService.js` (linha do axios timeout)

---

## 📞 Suporte

Se precisar de ajuda:

1. Verifique os logs do Spring Boot
2. Teste o script Puppeteer isoladamente:
   ```bash
   cd scripts
   node generate-pdf.js test.html output.pdf
   ```
3. Verifique se todas as dependências Maven foram baixadas

---

## ✅ Checklist de Implementação

- [ ] Copiei os 3 arquivos Java para o backend
- [ ] Copiei o template HTML para resources/templates/
- [ ] Copiei o script Node.js para scripts/
- [ ] Adicionei a dependência Mustache no pom.xml
- [ ] Instalei o Puppeteer (npm install puppeteer)
- [ ] Reiniciei o Spring Boot
- [ ] Testei o endpoint no Swagger
- [ ] Testei o botão no frontend

---

**Frontend já está pronto! ✅**  
Basta implementar o backend seguindo este guia.
