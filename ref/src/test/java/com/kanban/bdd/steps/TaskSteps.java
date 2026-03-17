package com.kanban.bdd.steps;

import com.kanban.KanbanApplication;
import com.kanban.infrastructure.persistence.TaskRepository;
import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.cucumber.spring.CucumberContextConfiguration;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@CucumberContextConfiguration
@SpringBootTest(classes = KanbanApplication.class, webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
public class TaskSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private TaskRepository taskRepository;

    private Response lastResponse;
    private Long lastCreatedId;

    @Before
    public void setUp() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = 8080;
        taskRepository.deleteAll();
    }

    @Given("que a API de tasks está disponível")
    public void theTaskApiIsAvailable() {
        given().get("/api/tasks").then().statusCode(200);
    }

    @When("crio uma task com título {string} descrição {string} prazo {string} status {string}")
    public void createTask(String title, String description, String dueDate, String status) {
        String body = String.format(
                "{\"title\":\"%s\",\"description\":\"%s\",\"dueDate\":\"%s\",\"status\":\"%s\"}",
                title, description, dueDate, status
        );
        lastResponse = given()
                .contentType(ContentType.JSON)
                .body(body)
                .post("/api/tasks");

        if (lastResponse.statusCode() == 201) {
            lastCreatedId = lastResponse.jsonPath().getLong("id");
        }
    }

    @And("busco todas as tasks")
    public void requestAllTasks() {
        lastResponse = given().get("/api/tasks");
    }

    @And("busco a task pelo último id criado")
    public void requestTaskByLastCreatedId() {
        lastResponse = given().get("/api/tasks/" + lastCreatedId);
    }

    @When("busco a task pelo id {long}")
    public void requestTaskById(long id) {
        lastResponse = given().get("/api/tasks/" + id);
    }

    @And("busco tasks com status {string}")
    public void requestTasksByStatus(String status) {
        lastResponse = given().get("/api/tasks/status/" + status);
    }

    @And("atualizo a última task criada com título {string} descrição {string} prazo {string} status {string}")
    public void updateLastCreatedTask(String title, String description, String dueDate, String status) {
        String body = String.format(
                "{\"title\":\"%s\",\"description\":\"%s\",\"dueDate\":\"%s\",\"status\":\"%s\"}",
                title, description, dueDate, status
        );
        lastResponse = given()
                .contentType(ContentType.JSON)
                .body(body)
                .put("/api/tasks/" + lastCreatedId);
    }

    @When("atualizo a task {long} com título {string} descrição {string} prazo {string} status {string}")
    public void updateTask(long id, String title, String description, String dueDate, String status) {
        String body = String.format(
                "{\"title\":\"%s\",\"description\":\"%s\",\"dueDate\":\"%s\",\"status\":\"%s\"}",
                title, description, dueDate, status
        );
        lastResponse = given()
                .contentType(ContentType.JSON)
                .body(body)
                .put("/api/tasks/" + id);
    }

    @And("atualizo o status da última task criada para {string}")
    public void updateStatusOfLastCreatedTask(String status) {
        String body = String.format("{\"status\":\"%s\"}", status);
        lastResponse = given()
                .contentType(ContentType.JSON)
                .body(body)
                .patch("/api/tasks/" + lastCreatedId + "/status");
    }

    @When("atualizo o status da task {long} para {string}")
    public void updateStatusOfTask(long id, String status) {
        String body = String.format("{\"status\":\"%s\"}", status);
        lastResponse = given()
                .contentType(ContentType.JSON)
                .body(body)
                .patch("/api/tasks/" + id + "/status");
    }

    @And("excluo a última task criada")
    public void deleteLastCreatedTask() {
        lastResponse = given().delete("/api/tasks/" + lastCreatedId);
    }

    @Then("o status da resposta deve ser {int}")
    public void theResponseStatusShouldBe(int expectedStatus) {
        assertEquals(expectedStatus, lastResponse.statusCode());
    }

    @And("a resposta deve conter o título {string}")
    public void theResponseShouldContainTitle(String expectedTitle) {
        lastResponse.then().body("title", equalTo(expectedTitle));
    }

    @And("o status da task na resposta deve ser {string}")
    public void theResponseTaskStatusShouldBe(String expectedStatus) {
        lastResponse.then().body("status", equalTo(expectedStatus));
    }

    @And("a lista na resposta deve conter {int} tasks")
    public void theResponseListShouldContain(int count) {
        lastResponse.then().body("$", hasSize(count));
    }
}
