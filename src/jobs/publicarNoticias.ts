// back-sas/src/jobs/publicarNoticias.ts
import cron from "node-cron";
import { NoticiaService } from "../services/NoticiaService";

const noticiaService = new NoticiaService();

// roda a cada minuto
cron.schedule("* * * * *", async () => {
  await noticiaService.publicarProgramadas();
  console.log("⏰ Notícias programadas publicadas (se houver).");
});
