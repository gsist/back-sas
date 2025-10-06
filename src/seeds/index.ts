// src/seeds/index.ts
import { seedGeneros } from "./genero.seed";
import { seedEscolaridade } from "./escolaridade.seed";
import { seedParentescos } from "./parentesco.seed";
import { seedRacaCor } from "./racaCor.seed";
import { seedProgramas } from "./programa.seed";

export async function runSeeds() {
  await seedGeneros();
  await seedEscolaridade();
  await seedParentescos();
  await seedRacaCor();
  await seedProgramas();

  console.log("✅ Seeds executados com sucesso!");
}
