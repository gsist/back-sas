import { Genero } from "../models/Genero";

export async function seedGeneros() {
  await Genero.bulkCreate([
    { id_genero: 1, nome: "Mulher Cis" },
    { id_genero: 2, nome: "Homem Cis" },
    { id_genero: 3, nome: "Mulher Trans" },
    { id_genero: 4, nome: "Homem Trans" },
    { id_genero: 5, nome: "Não Binário" },
    { id_genero: 6, nome: "Gênero Fluido" },
    { id_genero: 7, nome: "Prefiro não informar" }
  ] as any[], { ignoreDuplicates: true });
}