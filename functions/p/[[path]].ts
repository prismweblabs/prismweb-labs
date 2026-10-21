import { handle, type Env } from "../_lib/handler";
export const onRequest = ({ request, env }: { request: Request; env: Env }) => handle(request, env);
