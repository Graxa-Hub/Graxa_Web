# language: pt
Funcionalidade: API de Gerenciamento de Tasks

  Contexto:
    Dado que a API de tasks está disponível

  @criar-task
  Cenário: Criar uma task com sucesso
    Quando crio uma task com título "Fix bug" descrição "Auth token issue" prazo "2025-12-01" status "TODO"
    Então o status da resposta deve ser 201
    E a resposta deve conter o título "Fix bug"
    E o status da task na resposta deve ser "TODO"

  @criar-task-doing
  Cenário: Criar uma task com status DOING
    Quando crio uma task com título "Write tests" descrição "Cobertura com JUnit 5" prazo "2025-11-15" status "DOING"
    Então o status da resposta deve ser 201
    E o status da task na resposta deve ser "DOING"

  @listar-tasks
  Cenário: Listar todas as tasks retorna um array
    Quando crio uma task com título "Task A" descrição "Primeira tarefa" prazo "2025-10-01" status "TODO"
    E crio uma task com título "Task B" descrição "Segunda tarefa" prazo "2025-10-02" status "DONE"
    E busco todas as tasks
    Então o status da resposta deve ser 200
    E a lista na resposta deve conter 2 tasks

  @listar-vazio
  Cenário: Listar tasks quando não existe nenhuma
    Quando busco todas as tasks
    Então o status da resposta deve ser 200
    E a lista na resposta deve conter 0 tasks

  @buscar-por-id
  Cenário: Buscar task existente por ID
    Quando crio uma task com título "Deploy" descrição "Ambiente de produção" prazo "2025-09-30" status "DOING"
    E busco a task pelo último id criado
    Então o status da resposta deve ser 200
    E a resposta deve conter o título "Deploy"

  @buscar-404
  Cenário: Buscar task inexistente retorna 404
    Quando busco a task pelo id 99999
    Então o status da resposta deve ser 404

  @filtrar-status
  Cenário: Filtrar tasks por status TODO
    Quando crio uma task com título "Backlog" descrição "Item de backlog" prazo "2025-08-01" status "TODO"
    E crio uma task com título "Active" descrição "Em desenvolvimento" prazo "2025-08-02" status "DOING"
    E busco tasks com status "TODO"
    Então o status da resposta deve ser 200
    E a lista na resposta deve conter 1 tasks

  @atualizar-task
  Cenário: Atualizar task completamente
    Quando crio uma task com título "Old title" descrição "Descrição antiga" prazo "2025-06-01" status "TODO"
    E atualizo a última task criada com título "New title" descrição "Updated" prazo "2025-12-31" status "DOING"
    Então o status da resposta deve ser 200
    E a resposta deve conter o título "New title"
    E o status da task na resposta deve ser "DOING"

  @atualizar-404
  Cenário: Atualizar task inexistente retorna 404
    Quando atualizo a task 99999 com título "Ghost" descrição "Tarefa fantasma" prazo "2025-01-01" status "TODO"
    Então o status da resposta deve ser 404

  @atualizar-status
  Cenário: Atualizar apenas o status da task
    Quando crio uma task com título "Almost done" descrição "Falta só o merge" prazo "2025-05-01" status "DOING"
    E atualizo o status da última task criada para "DONE"
    Então o status da resposta deve ser 200
    E o status da task na resposta deve ser "DONE"

  @atualizar-status-404
  Cenário: Atualizar status de task inexistente retorna 404
    Quando atualizo o status da task 99999 para "DONE"
    Então o status da resposta deve ser 404

  @excluir-task
  Cenário: Excluir task existente
    Quando crio uma task com título "To delete" descrição "Será excluída" prazo "2025-04-01" status "TODO"
    E excluo a última task criada
    Então o status da resposta deve ser 204

  @task-excluida-inacessivel
  Cenário: Task excluída não pode ser recuperada
    Quando crio uma task com título "Ephemeral" descrição "Tarefa temporária" prazo "2025-03-01" status "TODO"
    E excluo a última task criada
    E busco a task pelo último id criado
    Então o status da resposta deve ser 404

  @cadastro-titulo-duplicado
  Cenário: Criar task com título duplicado retorna 409
    Quando crio uma task com título "Titulo Duplicado" descrição "Primeira vez" prazo "2025-12-01" status "TODO"
    E crio uma task com título "Titulo Duplicado" descrição "Segunda vez" prazo "2025-11-01" status "DOING"
    Então o status da resposta deve ser 409

  @atualizar-titulo-duplicado
  Cenário: Atualizar task com título de outra task retorna 409
    Quando crio uma task com título "Task Original" descrição "Descrição A" prazo "2025-12-01" status "TODO"
    E crio uma task com título "Task Destino" descrição "Descrição B" prazo "2025-11-01" status "DOING"
    E atualizo a última task criada com título "Task Original" descrição "Tentativa" prazo "2025-12-31" status "DOING"
    Então o status da resposta deve ser 409

  @atualizar-mesmo-titulo
  Cenário: Atualizar task mantendo o mesmo título retorna 200
    Quando crio uma task com título "Minha Task" descrição "Descrição original" prazo "2025-12-01" status "TODO"
    E atualizo a última task criada com título "Minha Task" descrição "Descrição atualizada" prazo "2025-12-31" status "DOING"
    Então o status da resposta deve ser 200
