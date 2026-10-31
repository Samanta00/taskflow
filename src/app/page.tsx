import { TaskManager } from "@/components/TaskManager";
import { taskRouter } from "@/server/task-router";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialTasks = await taskRouter.createCaller({}).list();

  return <TaskManager initialTasks={initialTasks} />;
}