# 📄 Setup Geração de PDF - Opção Puppeteer

## 🎯 Passos para Configurar

### 1️⃣ Instalar Node.js (se ainda não tiver)

Baixe e instale o Node.js: https://nodejs.org/ (versão LTS recomendada)

Verifique a instalação:

```bash
node --version
npm --version
```

### 2️⃣ Instalar Puppeteer no projeto

No terminal, dentro da pasta do projeto:

```bash
cd scripts
npm install
```

Isso irá instalar o Puppeteer e suas dependências (pode demorar alguns minutos).

### 3️⃣ Testar o script localmente

Crie um arquivo HTML de teste:

```bash
echo "<html><body><h1>Teste PDF</h1><p>Funcionou!</p></body></html>" > test.html
node generate-pdf.js test.html output.pdf
```

Se tudo estiver correto, um arquivo `output.pdf` será criado! ✅

---

## 🔧 Configuração do Backend (Java/Spring Boot)

### Passo 1: Adicionar dependências no `pom.xml`

```xml
<!-- Mustache para templates HTML -->
<dependency>
    <groupId>com.github.spullara.mustache.java</groupId>
    <artifactId>compiler</artifactId>
    <version>0.9.10</version>
</dependency>
```

### Passo 2: Criar estrutura de pastas

```
src/
├── main/
│   ├── java/
│   │   └── com/graxa/backend/
│   │       ├── controller/
│   │       │   └── PdfController.java
│   │       └── service/
│   │           ├── PdfService.java
│   │           └── PdfGeneratorService.java
│   └── resources/
│       └── templates/
│           └── template-pdf-evento.html
```

### Passo 3: Copiar os arquivos Java

Copie os arquivos de `backend-code-examples/` para o seu projeto:

- `PdfController.java` → `src/main/java/com/graxa/backend/controller/`
- `PdfService.java` → `src/main/java/com/graxa/backend/service/`
- `PdfGeneratorService.java` → `src/main/java/com/graxa/backend/service/`

### Passo 4: Copiar o template HTML

Copie `public/template-pdf-evento.html` para `src/main/resources/templates/`

### Passo 5: Ajustar caminho do script no `PdfGeneratorService.java`

No método `converterHtmlParaPdf`, ajuste o caminho para o script:

**Windows:**

```java
String scriptPath = "C:\\caminho\\completo\\Graxa_Web\\scripts\\generate-pdf.js";
```

**Linux/Mac:**

```java
String scriptPath = "/caminho/completo/Graxa_Web/scripts/generate-pdf.js";
```

**OU use caminho relativo:**

```java
String projectRoot = System.getProperty("user.dir");
String scriptPath = projectRoot + "/scripts/generate-pdf.js";
```

### Passo 6: Configurar `application.properties`

```properties
# Timeout para geração de PDF
server.connection-timeout=60000
spring.mvc.async.request-timeout=60000

# Tamanho máximo de resposta
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### Passo 7: Adicionar métodos nos Repositórios

Certifique-se de que seus repositórios têm estes métodos:

**AgendaEventoRepository.java:**

```java
List<AgendaEvento> findByShowIdOrderByOrdem(Long showId);
```

**HotelEventoRepository.java:**

```java
List<HotelEvento> findByShowId(Long showId);
```

**TransporteEventoRepository.java:**

```java
List<TransporteEvento> findByShowId(Long showId);
```

**AlocacaoRepository.java:**

```java
List<Alocacao> findByShowId(Long showId);
```

---

## 🧪 Testando

### 1. Testar o endpoint do backend

Inicie o backend e teste:

```bash
curl -X GET "http://localhost:8080/shows/1/pdf" \
  -H "Authorization: Bearer SEU_TOKEN" \
  --output evento.pdf
```

Ou acesse no navegador:

```
http://localhost:8080/shows/1/pdf
```

### 2. Testar no frontend

1. Inicie o frontend: `npm run dev`
2. Navegue até a página de visualização de um evento (show)
3. Clique no botão **"Baixar PDF"** (verde)
4. O PDF deve ser baixado automaticamente! 🎉

---

## 🐛 Troubleshooting

### ❌ Erro: "node: command not found"

**Solução:** Instale o Node.js ou adicione ao PATH do sistema.

**Windows:** Adicione `C:\Program Files\nodejs` ao PATH
**Linux/Mac:** Execute `sudo apt install nodejs npm` ou `brew install node`

### ❌ Erro: "puppeteer: command not found"

**Solução:** Execute `npm install` na pasta `scripts/`

### ❌ Erro: "Cannot find module 'puppeteer'"

**Solução:**

```bash
cd scripts
npm install puppeteer
```

### ❌ Erro: "Template não encontrado"

**Solução:** Certifique-se que `template-pdf-evento.html` está em `src/main/resources/templates/`

### ❌ PDF gerado está em branco

**Solução:**

1. Verifique os logs do backend para ver se os dados estão corretos
2. Adicione `console.log` em `PdfService.java` para debugar
3. Teste o template HTML diretamente no navegador

### ❌ Erro: "Timeout" ou "Connection refused"

**Solução:**

1. Aumente o timeout em `application.properties`
2. Aumente o timeout no frontend (`pdfService.js`):

```javascript
timeout: 120000, // 2 minutos
```

### ❌ Erro no Windows: "Access denied" ou "Permission denied"

**Solução:**

1. Execute o comando como Administrador
2. Verifique permissões da pasta `scripts/`
3. Desabilite temporariamente o antivírus

---

## 🚀 Deploy em Produção

### Opção 1: Servidor com Node.js

1. Instale Node.js no servidor
2. Copie a pasta `scripts/` para o servidor
3. Execute `npm install` na pasta `scripts/`
4. Ajuste o caminho do script em `PdfGeneratorService.java`

### Opção 2: Docker

Crie um `Dockerfile` que inclui Node.js e Java:

```dockerfile
FROM openjdk:17-jdk-slim

# Instalar Node.js
RUN apt-get update && \
    apt-get install -y nodejs npm && \
    apt-get clean

# Instalar dependências do Puppeteer
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils

# Copiar aplicação
COPY . /app
WORKDIR /app

# Instalar Puppeteer
WORKDIR /app/scripts
RUN npm install

WORKDIR /app
# ... resto da configuração do Spring Boot
```

### Opção 3: Microsserviço Separado

Crie um microsserviço Node.js separado só para gerar PDFs e chame via HTTP.

---

## 📊 Monitoramento

Adicione logs para monitorar a geração de PDFs:

```java
log.info("Iniciando geração de PDF para show: {}", showId);
log.info("PDF gerado com sucesso. Tamanho: {} bytes", pdfBytes.length);
```

---

## ✅ Checklist Final

- [ ] Node.js instalado e funcionando
- [ ] Puppeteer instalado na pasta `scripts/`
- [ ] Script `generate-pdf.js` testado localmente
- [ ] Dependências Maven adicionadas ao `pom.xml`
- [ ] Arquivos Java copiados para o projeto
- [ ] Template HTML copiado para `resources/templates/`
- [ ] Caminho do script ajustado em `PdfGeneratorService.java`
- [ ] Métodos dos repositórios implementados
- [ ] Backend testado com sucesso
- [ ] Frontend testado com sucesso
- [ ] PDF gerado e baixado corretamente

---

## 🎉 Pronto!

Agora você tem um sistema completo de geração de PDFs! Se tiver alguma dúvida ou erro, consulte a seção de Troubleshooting ou me chame! 😊
