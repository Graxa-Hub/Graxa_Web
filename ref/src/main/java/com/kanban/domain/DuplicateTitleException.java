package com.kanban.domain;

public class DuplicateTitleException extends RuntimeException {

    public DuplicateTitleException(String title) {
        super("Já existe uma task com o título: " + title);
    }
}