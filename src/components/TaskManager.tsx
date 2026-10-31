"use client";

import { useState } from "react";
import type { Task } from "@/server/task-store";
import { trpc } from "@/lib/trpc";

export function TaskManager({ initialTasks }: { initialTasks: Task[] }) {
  const utils = trpc.useUtils();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const tasks = trpc.tasks.list.useQuery(undefined, {
    initialData: initialTasks,
  });

  const createTask = trpc.tasks.create.useMutation({
    onSuccess: async () => {
      await utils.tasks.list.invalidate();
      resetForm();
      setFeedback("Tarefa criada com sucesso!");
    },
    onError: (error) => setFeedback(error.message),
  });

  const updateTask = trpc.tasks.update.useMutation({
    onSuccess: async () => {
      await utils.tasks.list.invalidate();
      resetForm();
      setFeedback("Tarefa atualizada com sucesso!");
    },
    onError: (error) => setFeedback(error.message),
  });

  const deleteTask = trpc.tasks.delete.useMutation({
    onSuccess: async () => {
      await utils.tasks.list.invalidate();
      setFeedback("Tarefa excluída com sucesso!");
    },
    onError: (error) => setFeedback(error.message),
  });

  function resetForm() {
    setTitulo("");
    setDescricao("");
    setEditingId(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");

    if (!titulo.trim()) {
      setFeedback("O título é obrigatório.");
      return;
    }

    if (editingId !== null) {
      updateTask.mutate({
        id: editingId,
        titulo: titulo.trim(),
        descricao,
      });
    } else {
      createTask.mutate({
        titulo: titulo.trim(),
        descricao,
      });
    }
  }

  function handleEdit(task: Task) {
    setEditingId(task.id);
    setTitulo(task.titulo);
    setDescricao(task.descricao ?? "");
    setFeedback("");
  }

  const isSaving = createTask.isPending || updateTask.isPending;

  return (
    <main className="container">
      <header className="header">
        <span className="eyebrow">ORGANIZAÇÃO PESSOAL</span>
        <h1>TaskFlow</h1>
        <p>Organize suas tarefas e acompanhe seu progresso.</p>
      </header>

      <section className="panel">
        <h2>{editingId !== null ? "Editar tarefa" : "Nova tarefa"}</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="titulo">Título *</label>
          <input
            id="titulo"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            placeholder="Ex.: Finalizar atividade"
            maxLength={120}
            required
          />

          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            placeholder="Adicione detalhes (opcional)"
            rows={3}
          />

          <div className="formActions">
            <button type="submit" disabled={isSaving}>
              {isSaving
                ? "Salvando..."
                : editingId !== null
                  ? "Salvar alterações"
                  : "Adicionar tarefa"}
            </button>

            {editingId !== null && (
              <button type="button" className="secondary" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        {feedback && <p role="status" className="feedback">{feedback}</p>}
      </section>

      <section className="taskSection">
        <div className="sectionHeader">
          <h2>Minhas tarefas</h2>
          <span>{tasks.data?.length ?? 0} tarefas</span>
        </div>

        {tasks.isLoading && <p>Carregando tarefas...</p>}

        {tasks.isError && (
          <p role="alert">Não foi possível carregar as tarefas.</p>
        )}

        {tasks.data?.length === 0 && (
          <p className="empty">Nenhuma tarefa cadastrada. Comece adicionando uma!</p>
        )}

        <div className="taskList">
          {tasks.data?.map((task) => (
            <article className="taskCard" key={task.id}>
              <div>
                <h3>{task.titulo}</h3>
                {task.descricao && <p>{task.descricao}</p>}
                <time dateTime={task.dataCriacao}>
                  Criada em {new Date(task.dataCriacao).toLocaleString("pt-BR")}
                </time>
              </div>

              <div className="taskActions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => handleEdit(task)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  className="danger"
                  disabled={deleteTask.isPending}
                  onClick={() => {
                    if (window.confirm("Deseja excluir esta tarefa?")) {
                      deleteTask.mutate({ id: task.id });
                    }
                  }}
                >
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}