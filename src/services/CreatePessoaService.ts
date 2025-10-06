// src/services/CreatePessoaService.ts
import { Pessoa } from '../models/Pessoa';
import { Contato } from '../models/Contato';
import { Renda } from '../models/Renda';
import { CondicaoSaude } from '../models/CondicaoSaude';
import { Endereco } from '../models/Endereco';
import { Familia } from '../models/Familia';
import { GrupoFamiliar } from '../models/GrupoFamiliar';
import { sequelize } from '../config/database';
import { Attributes, CreationAttributes } from 'sequelize';

interface PessoaData {
  cpf?: string | undefined;
  nis?: string | undefined;
  rg?: string | undefined;
  nome_completo: string;
  data_nascimento: Date | string;
  id_genero: number;
  id_raca_cor: number;
  id_instrucao: number;
  id_programa?: number | undefined;
  ativo?: boolean;
  status?: 'aprovado' | 'rejeitado' | 'pendente'; 
  contatos?: Array<Attributes<Contato>>;
  rendas?: Array<Attributes<Renda>>;
  condicoesSaude?: Array<Attributes<CondicaoSaude>>;
  endereco?: Attributes<Endereco>;
  familias?: Array<Attributes<Familia>>;
}

export class CreatePessoaService {
  async create(data: PessoaData): Promise<Pessoa> {
    const transaction = await sequelize.transaction();
    try {
      // ✅ Valida CPF duplicado
      if (data.cpf) {
        const cpfExistente = await Pessoa.findOne({ where: { cpf: data.cpf } });
        if (cpfExistente) {
          throw new Error("CPF já cadastrado no sistema");
        }
      }

      // ✅ Valida e formata NIS
      let formattedNis: string | undefined;
      if (data.nis) {
        const cleanedNis = data.nis.replace(/\D/g, '');
        if (cleanedNis.length === 11 && /^\d{11}$/.test(cleanedNis)) {
          formattedNis = cleanedNis;

          // ✅ Valida NIS duplicado
          const nisExistente = await Pessoa.findOne({ where: { nis: formattedNis } });
          if (nisExistente) {
            throw new Error("NIS já cadastrado no sistema");
          }
        } else {
          formattedNis = undefined;
        }
      }

      // ✅ Converte data_nascimento para Date
      const pessoaData: CreationAttributes<Pessoa> = {
        cpf: data.cpf,
        nis: formattedNis,
        rg: data.rg,
        nome_completo: data.nome_completo,
        data_nascimento: typeof data.data_nascimento === 'string' ? new Date(data.data_nascimento) : data.data_nascimento,
        id_genero: data.id_genero,
        id_raca_cor: data.id_raca_cor,
        id_instrucao: data.id_instrucao,
        id_programa: data.id_programa,
        ativo: data.ativo ?? true,
        status: data.status ?? 'pendente', // ✅ define status
      };

      // ✅ Cria pessoa
      const pessoa = await Pessoa.create(pessoaData, { transaction });

      // ✅ Cria contatos
      if (data.contatos && data.contatos.length > 0) {
        const validContactTypes = ['CELULAR', 'FIXO', 'EMAIL', 'OUTRO'];
        await Contato.bulkCreate(
          data.contatos.map((contato) => {
            const tipo = contato.tipo?.toUpperCase() as 'CELULAR' | 'FIXO' | 'EMAIL' | 'OUTRO';
            if (!validContactTypes.includes(tipo)) {
              throw new Error(`Tipo de contato inválido: ${contato.tipo}. Tipos permitidos: ${validContactTypes.join(', ')}`);
            }
            return {
              id_pessoa: pessoa.id_pessoa,
              tipo,
              valor: contato.valor,
              principal: contato.principal,
            } as CreationAttributes<Contato>;
          }),
          { transaction }
        );
      }

      // ✅ Cria rendas
      if (data.rendas && data.rendas.length > 0) {
        await Renda.bulkCreate(
          data.rendas.map((renda) => ({
            id_pessoa: pessoa.id_pessoa,
            valor: renda.valor,
            fonte: renda.fonte,
            referencia_mes: typeof renda.referencia_mes === 'string' ? new Date(renda.referencia_mes) : renda.referencia_mes,
          }) as CreationAttributes<Renda>),
          { transaction }
        );
      }

      // ✅ Cria condições de saúde
      if (data.condicoesSaude && data.condicoesSaude.length > 0) {
        await CondicaoSaude.bulkCreate(
          data.condicoesSaude.map((condicao) => ({
            id_pessoa: pessoa.id_pessoa,
            cid: condicao.cid,
            pcd: condicao.pcd,
            observacao: condicao.observacao,
          }) as CreationAttributes<CondicaoSaude>),
          { transaction }
        );
      }

      // ✅ Cria endereço
      if (data.endereco) {
        await Endereco.create(
          {
            id_pessoa: pessoa.id_pessoa,
            logradouro: data.endereco.logradouro,
            numero: data.endereco.numero,
            complemento: data.endereco.complemento,
            bairro: data.endereco.bairro,
            cidade: data.endereco.cidade,
            estado: data.endereco.estado,
            cep: data.endereco.cep,
            atual: data.endereco.atual ?? true,
          } as CreationAttributes<Endereco>,
          { transaction }
        );
      }

      // ✅ Cria grupo familiar e famílias
      if (data.familias && data.familias.length > 0) {
        const grupoFamiliar = await GrupoFamiliar.create(
          { id_chefe_familia: pessoa.id_pessoa } as CreationAttributes<GrupoFamiliar>,
          { transaction }
        );

        await Familia.bulkCreate(
          data.familias.map((familia) => ({
            id_chefe_familia: grupoFamiliar.id_grupo_familiar,
            nome_parentesco: familia.nome_parentesco,
            cpf_parentesco: familia.cpf_parentesco,
            tipo_parentesco: familia.tipo_parentesco,
          }) as CreationAttributes<Familia>),
          { transaction }
        );
      }

      // ✅ Confirma transação
      await transaction.commit();

      // ✅ Retorna pessoa completa (com status também)
      const pessoaCompleta = await Pessoa.findByPk(pessoa.id_pessoa, {
        attributes: [
          'id_pessoa',
          'cpf',
          'nis',
          'rg',
          'nome_completo',
          'data_nascimento',
          'ativo',
          'status',
        ],
        include: ['genero', 'racaCor', 'escolaridade', 'programa', 'contatos', 'rendas', 'condicoesSaude'],
      });

      if (!pessoaCompleta) throw new Error('Erro ao recuperar a pessoa criada');

      return pessoaCompleta;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
