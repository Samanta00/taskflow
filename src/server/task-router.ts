import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { nextTaskId, taskStore } from "./task-store";

const tituloSchema = z
  .string()
  .trim()
  .min(1, "O título é obrigatório.")
  .refine(
    (value) => /\p{L}/u.test(value),
    "O título deve conter pelo menos uma letra.",
  );

const taskSchema = z.object({
  titulo: tituloSchema,
  descricao: z.string().optional(),
});

export const taskRouter = router({
  list: publicProcedure
    .input(
        z.object({
        limit: z.number().min(1).max(20).default(5),
        cursor: z.number().nullish(),
        }),
    )
    .query(({ input }) => {
        const tasks = [...taskStore].sort(
        (a, b) =>
            new Date(b.dataCriacao).getTime() -
            new Date(a.dataCriacao).getTime(),
        );

        const startIndex = input.cursor ?? 0;
        const items = tasks.slice(startIndex, startIndex + input.limit);

        const nextCursor =
        startIndex + input.limit < tasks.length
            ? startIndex + input.limit
            : null;

        return {
        items,
        nextCursor,
        };
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