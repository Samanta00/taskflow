import { TaskManager } from "@/components/TaskManager";
import { taskRouter } from "@/server/task-router";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialPage = await taskRouter.createCaller({}).list({
    limit: 5,
    cursor: null,
  });

  return <TaskManager initialPage={initialPage} />;
}