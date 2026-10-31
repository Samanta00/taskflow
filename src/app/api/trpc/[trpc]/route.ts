import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { taskRouter } from "@/server/task-router";
import { router } from "@/server/trpc";

const appRouter = router({
  tasks: taskRouter,
});

export type AppRouter = typeof appRouter;

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };