# Dependências Maven para o Backend

Adicione estas dependências ao seu `pom.xml`:

```xml
<!-- Mustache para templates -->
<dependency>
    <groupId>com.github.spullara.mustache.java</groupId>
    <artifactId>compiler</artifactId>
    <version>0.9.10</version>
</dependency>

<!-- ALTERNATIVA 1: Flying Saucer para gerar PDF diretamente em Java (sem Node.js) -->
<!-- Recomendado se você quer evitar dependências externas -->
<dependency>
    <groupId>org.xhtmlrenderer</groupId>
    <artifactId>flying-saucer-pdf</artifactId>
    <version>9.1.22</version>
</dependency>

<!-- ALTERNATIVA 2: OpenPDF (fork do iText) -->
<!-- Outra opção para gerar PDFs em Java puro -->
<dependency>
    <groupId>com.github.librepdf</groupId>
    <artifactId>openpdf</artifactId>
    <version>1.3.30</version>
</dependency>
```

---

## Estrutura do Projeto Backend

```
src/
├── main/
│   ├── java/
│   │   └── com/graxa/backend/
│   │       ├── controller/
│   │       │   └── PdfController.java
│   │       ├── service/
│   │       │   ├── PdfService.java
│   │       │   └── PdfGeneratorService.java
│   │       ├── model/
│   │       │   ├── Show.java
│   │       │   ├── AgendaEvento.java
│   │       │   ├── Alocacao.java
│   │       │   ├── HotelEvento.java
│   │       │   ├── TransporteEvento.java
│   │       │   └── ... (outras entidades)
│   │       └── repository/
│   │           ├── ShowRepository.java
│   │           ├── AgendaEventoRepository.java
│   │           └── ... (outros repositórios)
│   └── resources/
│       ├── templates/
│       │   └── template-pdf-evento.html
│       └── application.properties
└── scripts/
    └── generate-pdf.js (se usar Puppeteer)
```

---

## Configurações Necessárias

### application.properties

```properties
# Aumentar timeout para geração de PDF
server.connection-timeout=60000

# Configuração de tamanho máximo para upload/download
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

---

## Métodos dos Repositórios

Certifique-se de que seus repositórios têm estes métodos:

### AgendaEventoRepository.java

```java
List<AgendaEvento> findByShowIdOrderByOrdem(Long showId);
```

### HotelEventoRepository.java

```java
List<HotelEvento> findByShowId(Long showId);
```

### TransporteEventoRepository.java

```java
List<TransporteEvento> findByShowId(Long showId);
```

### AlocacaoRepository.java

```java
List<Alocacao> findByShowId(Long showId);
```

---

## Opções de Implementação

### OPÇÃO 1: Usando Puppeteer (Node.js) - Melhor qualidade visual

**Prós:**

- PDFs com design perfeito (CSS moderno)
- Suporte completo a HTML5/CSS3
- Melhor renderização de layouts complexos

**Contras:**

- Requer Node.js instalado no servidor
- Processo externo (pode ser mais lento)

**Setup:**

1. Instale Node.js no servidor
2. Crie pasta `scripts` na raiz do projeto
3. Coloque o arquivo `generate-pdf.js` lá
4. Execute: `npm install puppeteer`

---

### OPÇÃO 2: Flying Saucer (Java puro) - Mais simples

**Prós:**

- Tudo em Java, sem dependências externas
- Mais rápido (sem processos externos)
- Mais fácil de deployar

**Contras:**

- Suporte limitado a CSS (somente CSS 2.1)
- Layouts complexos podem não renderizar bem

**Implementação:**
No `PdfGeneratorService.java`, descomente o método alternativo e use:

```java
private byte[] converterHtmlParaPdf(String html) throws IOException {
    try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(html);
        renderer.layout();
        renderer.createPDF(outputStream);
        return outputStream.toByteArray();
    } catch (Exception e) {
        log.error("Erro ao converter HTML para PDF", e);
        throw new IOException("Erro ao gerar PDF", e);
    }
}
```

---

## Testando o Endpoint

```bash
# Gerar PDF de um show
curl -X GET "http://localhost:8080/shows/1/pdf" \
  -H "Authorization: Bearer SEU_TOKEN" \
  --output evento.pdf

# Ou no browser:
http://localhost:8080/shows/1/pdf
```

---

## Troubleshooting

### Erro: Template não encontrado

- Certifique-se que `template-pdf-evento.html` está em `src/main/resources/templates/`

### Erro: Node.js não encontrado

- Verifique se Node.js está no PATH
- Ou use caminho absoluto: `/usr/bin/node` ou `C:\\Program Files\\nodejs\\node.exe`

### PDF em branco

- Verifique se os dados estão sendo passados corretamente
- Adicione logs em `PdfService.java` para verificar os dados

### Timeout

- Aumente o timeout em `application.properties`
- Ou aumente o timeout no `pdfService.js` (frontend)

---

## Melhorias Futuras

1. **Cache**: Cachear PDFs gerados para evitar regeneração
2. **Fila**: Usar fila (RabbitMQ/Kafka) para geração assíncrona
3. **Storage**: Salvar PDFs em S3/Azure Blob Storage
4. **Webhook**: Notificar frontend quando PDF estiver pronto
5. **Personalização**: Permitir usuário escolher quais seções incluir
