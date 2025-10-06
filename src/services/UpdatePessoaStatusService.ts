// src/services/UpdatePessoaStatusService.ts
import { Pessoa } from '../models/Pessoa';

export class UpdatePessoaStatusService {
  async updateStatus(id: number, status: 'pendente' | 'aprovado' | 'rejeitado'): Promise<Pessoa> {
    const pessoa = await Pessoa.findByPk(id);
    if (!pessoa) throw new Error('Pessoa não encontrada');

    pessoa.status = status;
    await pessoa.save();

    return pessoa;
  }
}
