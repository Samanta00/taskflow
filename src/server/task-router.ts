import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { nextTaskId, taskStore } from "./task-store";

const taskSchema = z.object({
  titulo: z.string().trim().min(1, "O título é obrigatório."),
  descricao: z.string().optional(),
});

export const taskRouter = router({
  list: publicProcedure.query(() => {
    return [...taskStore].sort(
      (a, b) =>
        new Date(b.dataCriacao).getTime() -
        new Date(a.dataCriacao).getTime(),
    );
  }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      return taskStore.find((task) => task.id === input.id) ?? null;
    }),

  create: publicProcedure.input(taskSchema).mutation(({ input }) => {
    const task = {
      id: nextTaskId(),
      ...input,
      dataCriacao: new Date().toISOString(),
    };

    taskStore.push(task);
    return task;
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        titulo: z.string().trim().min(1),
        descricao: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const index = taskStore.findIndex((task) => task.id === input.id);

      if (index === -1) {
        throw new Error("Tarefa não encontrada.");
      }

      taskStore[index] = {
        ...taskStore[index],
        titulo: input.titulo,
        descricao: input.descricao,
      };

      return taskStore[index];
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const index = taskStore.findIndex((task) => task.id === input.id);

      if (index === -1) {
        throw new Error("Tarefa não encontrada.");
      }

      taskStore.splice(index, 1);
      return { success: true };
    }),
});