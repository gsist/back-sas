import { Escolaridade } from "../models/Escolaridade";

export async function seedEscolaridade() {
  await Escolaridade.bulkCreate([
    { id_instrucao: 1, nome: "Sem instrução" },
    { id_instrucao: 2, nome: "Fundamental incompleto" },
    { id_instrucao: 3, nome: "Fundamental completo" },
    { id_instrucao: 4, nome: "Ensino médio incompleto" },
    { id_instrucao: 5, nome: "Ensino médio completo" },
    { id_instrucao: 6, nome: "Superior incompleto" },
    { id_instrucao: 7, nome: "Superior completo" },
    { id_instrucao: 8, nome: "Pós-graduação incompleta" },
    { id_instrucao: 9, nome: "Pós-graduação completa" },
  ] as any[], { ignoreDuplicates: true });
}
