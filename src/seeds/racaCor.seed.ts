import { RacaCor } from "../models/RacaCor";

export async function seedRacaCor() {
  await RacaCor.bulkCreate([
    { id_raca_cor: 1, nome: "Branca" },
    { id_raca_cor: 2, nome: "Preta" },
    { id_raca_cor: 3, nome: "Parda" },
    { id_raca_cor: 4, nome: "Amarela" },
    { id_raca_cor: 5, nome: "Indígena" },
    { id_raca_cor: 6, nome: "Não Declarada" },
  ] as any[], { ignoreDuplicates: true });
}
