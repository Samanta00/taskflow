export type Task = {
  id: number;
  titulo: string;
  descricao?: string;
  dataCriacao: string;
};

const initialTasks: Task[] = [
  {
    id: 1,
    titulo: "Conhecer o TaskFlow",
    descricao: "Explorar o gerenciamento de tarefas.",
    dataCriacao: new Date().toISOString(),
  },
  {
    id: 2,
    titulo: "Criar minha primeira tarefa",
    descricao: "Testar a aplicação.",
    dataCriacao: new Date().toISOString(),
  },
];

declare global {
  var taskStore: Task[] | undefined;
  var taskNextId: number | undefined;
}

globalThis.taskStore ??= initialTasks;
globalThis.taskNextId ??= 3;

export const taskStore = globalThis.taskStore;

export function nextTaskId() {
  const id = globalThis.taskNextId!;
  globalThis.taskNextId = id + 1;
  return id;
}