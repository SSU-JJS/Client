import { setupWorker } from "msw/browser";

import { handlers } from "@/lib/api/mocks/handlers";

export const worker = setupWorker(...handlers);
