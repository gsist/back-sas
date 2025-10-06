import { Parentesco } from "../models/Parentesco";

export async function seedParentescos() {
  await Parentesco.bulkCreate([
    { id_parentesco: 1, nome: "Chefe" },
    { id_parentesco: 2, nome: "Cônjuge/Companheiro(a)" },
    { id_parentesco: 3, nome: "Filho(a)" },
    { id_parentesco: 4, nome: "Enteado(a)" },
    { id_parentesco: 5, nome: "Neto(a)" },
    { id_parentesco: 6, nome: "Pai/Mãe" },
    { id_parentesco: 7, nome: "Sogro(a)" },
    { id_parentesco: 8, nome: "Irmão(ã)" },
    { id_parentesco: 9, nome: "Outro Parente" },
    { id_parentesco: 10, nome: "Não Parente" },
  ] as any[], { ignoreDuplicates: true });
}
