
"use client";

import { useEffect, useRef, useState } from "react";
import type { Task } from "@/server/task-store";
import { trpc } from "@/lib/trpc";

type InitialPage = {
  items: Task[];
  nextCursor: number | null;
};

function getErrorMessage(error: { message: string }) {
  try {
    const parsed = JSON.parse(error.message);

    if (Array.isArray(parsed) && parsed[0]?.message) {
      return parsed[0].message;
    }
  } catch {
    // A mensagem já está em formato de texto.
  }

  return error.message;
}

export function TaskManager({
  initialPage,
}: {
  initialPage: InitialPage;
}) {
  const utils = trpc.useUtils();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const tasks = trpc.tasks.list.useInfiniteQuery(
    { limit: 5 },
    {
      initialData: {
        pages: [initialPage],
        pageParams: [null],
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const allTasks = tasks.data?.pages.flatMap((page) => page.items) ?? [];

  const createTask = trpc.tasks.create.useMutation({
    onSuccess: async () => {
      await utils.tasks.list.invalidate();
      resetForm();
      setFeedback("Tarefa criada com sucesso!");
    },
    onError: (error) => setFeedback(getErrorMessage(error)),
  });

  const updateTask = trpc.tasks.update.useMutation({
    onSuccess: async () => {
      await utils.tasks.list.invalidate();
      resetForm();
      setFeedback("Tarefa atualizada com sucesso!");
    },
    onError: (error) => setFeedback(getErrorMessage(error)),
  });

  const deleteTask = trpc.tasks.delete.useMutation({
    onSuccess: async () => {
      await utils.tasks.list.invalidate();
      setFeedback("Tarefa excluída com sucesso!");
    },
    onError: (error) => setFeedback(getErrorMessage(error)),
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

  useEffect(() => {
    const element = sentinelRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          tasks.hasNextPage &&
          !tasks.isFetchingNextPage
        ) {
          void tasks.fetchNextPage();
        }
      },
      {
        rootMargin: "200px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [
    tasks.hasNextPage,
    tasks.isFetchingNextPage,
    tasks.fetchNextPage,
  ]);

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
              <button
                type="button"
                className="secondary"
                onClick={resetForm}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {feedback && (
          <p role="status" className="feedback">
            {feedback}
          </p>
        )}
      </section>

      <section className="taskSection">
        <div className="sectionHeader">
          <h2>Minhas tarefas</h2>
          <span>{allTasks.length} tarefas carregadas</span>
        </div>

        {tasks.isLoading && <p>Carregando tarefas...</p>}

        {tasks.isError && (
          <p role="alert">Não foi possível carregar as tarefas.</p>
        )}

        {allTasks.length === 0 && !tasks.isLoading && (
          <p className="empty">
            Nenhuma tarefa cadastrada. Comece adicionando uma!
          </p>
        )}

        <div className="taskList">
          {allTasks.map((task) => (
            <article className="taskCard" key={task.id}>
              <div>
                <h3>{task.titulo}</h3>

                {task.descricao && <p>{task.descricao}</p>}

                <time dateTime={task.dataCriacao}>
                  Criada em{" "}
                  {new Date(task.dataCriacao).toLocaleString("pt-BR")}
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

        <div ref={sentinelRef} aria-hidden="true" />

        {tasks.isFetchingNextPage && (
          <p className="empty">Carregando mais tarefas...</p>
        )}

        {tasks.isFetchNextPageError && (
          <p role="alert">
            Não foi possível carregar mais tarefas.
            <button
              type="button"
              className="secondary"
              onClick={() => void tasks.fetchNextPage()}
            >
              Tentar novamente
            </button>
          </p>
        )}

        {!tasks.hasNextPage && allTasks.length > 0 && (
          <p className="empty">Você chegou ao final da lista.</p>
        )}
      </section>
    </main>
  );
}
