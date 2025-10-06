// src/seeds/programa.seed.ts
import { Programa } from "../models/Programa";

export async function seedProgramas() {
  await Programa.bulkCreate([
    { cod_programa: 1, nome: "Bolsa Família" },
    { cod_programa: 2, nome: "BPC - Benefício de Prestação Continuada" },
    { cod_programa: 3, nome: "Outros" },
  ] as any[], { ignoreDuplicates: true });
}
