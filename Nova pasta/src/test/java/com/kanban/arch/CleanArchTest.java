package com.kanban.arch;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.junit.AnalyzeClasses;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Testes de arquitetura — verificam se a refatoração para Clean Architecture foi feita corretamente.
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  O QUE VOCÊ PRECISA FAZER                                   │
 * │                                                             │
 * │  Reorganize o código nos seguintes pacotes:                 │
 * │                                                             │
 * │  com.kanban                                                 │
 * │  ├── domain/        → entidade Task + interface TaskGateway │
 * │  ├── usecase/       → lógica de negócio (sem Spring/JPA)   │
 * │  └── infrastructure/                                        │
 * │      ├── persistence/ → implementação JPA do gateway        │
 * │      └── web/         → controller REST                     │
 * │                                                             │
 * │  As dependências devem fluir de fora para dentro:           │
 * │  web → usecase → domain ← gateway ← persistence            │
 * └─────────────────────────────────────────────────────────────┘
 */
@AnalyzeClasses(packages = "com.kanban")
public class CleanArchTest {

    private static final JavaClasses CLASSES =
            new ClassFileImporter().importPackages("com.kanban");

    // ══════════════════════════════════════════════════════════════════
    // ESTRUTURA — verificam se os pacotes e tipos corretos existem
    // ══════════════════════════════════════════════════════════════════

    /**
     * A entidade Task deve estar no pacote com.kanban.domain.
     *
     * O que fazer: mova (ou recrie) a classe Task para o pacote com.kanban.domain.
     * Ela deve ser Java puro — sem anotações de @Entity, @Table, @Column.
     * Esses detalhes de persistência ficam em infrastructure.persistence.
     *
     * Exemplo: com.kanban.domain.Task
     */
    @Test
    @DisplayName("[17] Task deve estar no pacote com.kanban.domain (não em model)")
    void task_must_reside_in_domain_package() {
        classes().that().haveSimpleName("Task")
                .should().resideInAPackage("com.kanban.domain..")
                .because("a entidade de domínio Task não pode viver em com.kanban.model — " +
                         "mova-a para com.kanban.domain e remova todas as anotações de framework")
                .allowEmptyShould(false)
                .check(CLASSES);
    }

    /**
     * Deve existir uma interface chamada TaskGateway em com.kanban.domain.
     *
     * O que fazer: crie a interface TaskGateway dentro do pacote com.kanban.domain.
     * Ela define o contrato de persistência sem mencionar JPA, Spring Data ou qualquer framework.
     *
     * Exemplo:
     *   package com.kanban.domain;
     *   public interface TaskGateway {
     *       Task save(Task task);
     *       Optional<Task> findById(Long id);
     *       List<Task> findAll();
     *       // ... outros métodos necessários
     *   }
     */
    @Test
    @DisplayName("[18] Interface TaskGateway deve existir em com.kanban.domain")
    void task_gateway_interface_must_exist_in_domain() {
        classes().that().haveSimpleName("TaskGateway")
                .should().resideInAPackage("com.kanban.domain..")
                .andShould().beInterfaces()
                .because("TaskGateway é o contrato de persistência do domínio — " +
                         "deve ser uma interface em com.kanban.domain, sem depender de JPA ou Spring")
                .allowEmptyShould(false)
                .check(CLASSES);
    }

    /**
     * O pacote com.kanban.usecase deve existir e ter pelo menos uma classe.
     *
     * O que fazer: crie pelo menos uma classe de caso de uso em com.kanban.usecase.
     * Essa classe contém a lógica de negócio (o que antes estava no Service),
     * mas recebe um TaskGateway por injeção de dependência — nunca usa JPA diretamente.
     *
     * Exemplo: com.kanban.usecase.TaskUseCase
     */
    @Test
    @DisplayName("[19] Pacote com.kanban.usecase deve existir — crie seus casos de uso aqui")
    void usecase_package_must_have_at_least_one_class() {
        long count = CLASSES.stream()
                .filter(c -> c.getPackageName().startsWith("com.kanban.usecase"))
                .count();
        assertThat(count)
                .as("""
                    Nenhuma classe encontrada em com.kanban.usecase.

                    O que fazer:
                      1. Crie o pacote com.kanban.usecase
                      2. Mova a lógica de negócio do Service para uma ou mais classes nesse pacote
                      3. Injete um TaskGateway (interface do domínio) no construtor — nunca JPA diretamente

                    Exemplo: com.kanban.usecase.TaskUseCase
                    """)
                .isGreaterThan(0);
    }

    /**
     * O pacote com.kanban.infrastructure deve existir e ter pelo menos uma classe.
     *
     * O que fazer: crie pelo menos uma classe em com.kanban.infrastructure.
     * Esse pacote contém os adaptadores que conectam o domínio ao mundo externo:
     *   - infrastructure.persistence → implementação JPA do TaskGateway
     *   - infrastructure.web         → controller REST
     *
     * Exemplos:
     *   com.kanban.infrastructure.persistence.TaskJpaGateway  (implements TaskGateway)
     *   com.kanban.infrastructure.web.TaskController
     */
    @Test
    @DisplayName("[20] Pacote com.kanban.infrastructure deve existir — mova controllers e repositórios JPA aqui")
    void infrastructure_package_must_have_at_least_one_class() {
        long count = CLASSES.stream()
                .filter(c -> c.getPackageName().startsWith("com.kanban.infrastructure"))
                .count();
        assertThat(count)
                .as("""
                    Nenhuma classe encontrada em com.kanban.infrastructure.

                    O que fazer:
                      1. Crie os subpacotes:
                         - com.kanban.infrastructure.persistence  (entidade JPA + implementação de TaskGateway)
                         - com.kanban.infrastructure.web          (controller REST)
                      2. Mova o controller para infrastructure.web
                      3. Crie a implementação do TaskGateway usando Spring Data em infrastructure.persistence
                    """)
                .isGreaterThan(0);
    }

    // ══════════════════════════════════════════════════════════════════
    // REGRAS DE ISOLAMENTO — garantem que as dependências fluem corretamente
    // ══════════════════════════════════════════════════════════════════

    /**
     * Classes em com.kanban.domain não podem importar Spring nem JPA.
     *
     * O que fazer: remova qualquer anotação de framework da entidade Task e de TaskGateway.
     * O domínio deve ser Java puro — sem @Entity, @Table, @Column, @Repository,
     * sem nenhuma importação de org.springframework ou jakarta.persistence.
     *
     * Se precisar de uma entidade JPA, crie uma classe separada em infrastructure.persistence
     * (ex: TaskJpaEntity) com as anotações, e faça a conversão para/de Task do domínio.
     */
    @Test
    @DisplayName("[21] Domínio deve ser Java puro — sem imports de Spring ou JPA")
    void domain_must_be_framework_free() {
        noClasses().that().resideInAPackage("com.kanban.domain..")
                .should().dependOnClassesThat()
                .resideInAnyPackage("org.springframework..", "jakarta.persistence..")
                .because("o domínio deve ser Java puro — remova @Entity, @Table, @Column e " +
                         "qualquer import de Spring/JPA das classes em com.kanban.domain")
                .allowEmptyShould(true)
                .check(CLASSES);
    }

    /**
     * Classes em com.kanban.usecase não podem importar nada de com.kanban.infrastructure.
     *
     * O que fazer: o caso de uso deve depender apenas do domínio (interfaces).
     * Se o seu use case importa uma classe de infrastructure.persistence (ex: TaskJpaRepository),
     * substitua pela interface TaskGateway definida em com.kanban.domain.
     *
     * Regra: usecase → domain (interfaces) ← infrastructure (implementações)
     * O use case não sabe — e não precisa saber — que existe JPA ou Spring Data.
     */
    @Test
    @DisplayName("[22] Caso de uso não pode depender de infrastructure — use a interface TaskGateway")
    void usecase_must_not_depend_on_infrastructure() {
        noClasses().that().resideInAPackage("com.kanban.usecase..")
                .should().dependOnClassesThat()
                .resideInAPackage("com.kanban.infrastructure..")
                .because("use cases só podem depender do domínio — substitua imports de " +
                         "infrastructure por interfaces de com.kanban.domain (ex: TaskGateway)")
                .allowEmptyShould(true)
                .check(CLASSES);
    }

    /**
     * O controller (infrastructure.web) não pode acessar o repositório JPA diretamente.
     *
     * O que fazer: o controller deve chamar o caso de uso — nunca o repositório JPA.
     * Se o controller injeta algo de infrastructure.persistence (ex: TaskJpaRepository),
     * troque pela injeção do caso de uso (ex: TaskUseCase).
     *
     * Fluxo correto: Controller → UseCase → TaskGateway → JPA Repository
     * Fluxo errado:  Controller → JPA Repository  ← isso vai quebrar este teste
     */
    @Test
    @DisplayName("[23] Controller não pode acessar persistence diretamente — passe pelo caso de uso")
    void web_adapters_must_not_depend_on_persistence() {
        noClasses().that().resideInAPackage("com.kanban.infrastructure.web..")
                .should().dependOnClassesThat()
                .resideInAPackage("com.kanban.infrastructure.persistence..")
                .because("o controller não pode acessar o repositório JPA diretamente — " +
                         "injete o caso de uso (com.kanban.usecase) no controller e deixe " +
                         "o use case orquestrar o acesso aos dados via TaskGateway")
                .allowEmptyShould(true)
                .check(CLASSES);
    }
}
