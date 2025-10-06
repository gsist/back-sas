// src/services/PessoaService.ts
import { Pessoa } from '../models/Pessoa';
import { Endereco } from '../models/Endereco';
import { GrupoFamiliar } from '../models/GrupoFamiliar';
import { Familia } from '../models/Familia';

export class PessoaService {
  // Função auxiliar para buscar dados relacionados (endereços e família)
  private async getDadosRelacionados(pessoa: any) {
    try {
      // Buscar endereços
      const enderecos = await Endereco.findAll({
        where: { id_pessoa: pessoa.id_pessoa },
        attributes: [
          'id_endereco',
          'logradouro',
          'numero',
          'complemento',
          'bairro',
          'cidade',
          'estado',
          'cep',
          'atual',
        ],
      });

      // Buscar grupo familiar e família
      let familias: Familia[] = [];
      const grupoFamiliar = await GrupoFamiliar.findOne({
        where: { id_chefe_familia: pessoa.id_pessoa },
      });

      if (grupoFamiliar) {
        familias = await Familia.findAll({
          where: { id_chefe_familia: grupoFamiliar.id_grupo_familiar },
        });
      }

      return {
        ...pessoa.toJSON(),
        enderecos,
        familias,
      };
    } catch (error) {
      console.error('Erro ao buscar dados relacionados:', error);
      // Retorna pelo menos os dados básicos da pessoa em caso de erro
      return {
        ...pessoa.toJSON(),
        enderecos: [],
        familias: [],
      };
    }
  }

  // Configuração padrão de attributes e includes para busca de pessoas
  private readonly pessoaAttributes = [
    'id_pessoa',
    'cpf',
    'nis',
    'rg',
    'nome_completo',
    'data_nascimento',
    'ativo',
    'status',
  ];

  private readonly pessoaIncludes = [
    'genero',
    'racaCor',
    'escolaridade',
    'programa',
    'contatos',
    'rendas',
    'condicoesSaude',
  ];

  // Lista todas as pessoas
  async getAll(): Promise<any[]> {
    try {
      const pessoas = await Pessoa.findAll({
        attributes: this.pessoaAttributes,
        include: this.pessoaIncludes,
      });

      const pessoasComDados = await Promise.all(
        pessoas.map(pessoa => this.getDadosRelacionados(pessoa))
      );

      return pessoasComDados;
    } catch (error) {
      console.error('Erro ao listar pessoas:', error);
      throw error;
    }
  }

  // Busca uma pessoa por ID
  async getById(id: number): Promise<any | null> {
    try {
      const pessoa = await Pessoa.findByPk(id, {
        attributes: this.pessoaAttributes,
        include: this.pessoaIncludes,
      });

      if (!pessoa) return null;

      return await this.getDadosRelacionados(pessoa);
    } catch (error) {
      console.error('Erro ao buscar pessoa por ID:', error);
      throw error;
    }
  }

  // Busca pessoa por CPF
  async getByCpf(cpf: string): Promise<any | null> {
    try {
      const pessoa = await Pessoa.findOne({
        where: { cpf },
        attributes: this.pessoaAttributes,
        include: this.pessoaIncludes,
      });

      if (!pessoa) return null;

      return await this.getDadosRelacionados(pessoa);
    } catch (error) {
      console.error('Erro ao buscar pessoa por CPF:', error);
      throw error;
    }
  }

  // Busca pessoa por NIS
  async getByNis(nis: string): Promise<any | null> {
    try {
      const pessoa = await Pessoa.findOne({
        where: { nis },
        attributes: this.pessoaAttributes,
        include: this.pessoaIncludes,
      });

      if (!pessoa) return null;

      return await this.getDadosRelacionados(pessoa);
    } catch (error) {
      console.error('Erro ao buscar pessoa por NIS:', error);
      throw error;
    }
  }

  // Atualiza status da pessoa
  async updateStatus(id: number, status: 'aprovado' | 'rejeitado' | 'pendente'): Promise<any | null> {
    try {
      await Pessoa.update({ status }, { where: { id_pessoa: id } });
      return this.getById(id);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }

  // Ativa/desativa pessoa
  async updateAtivo(id: number, ativo: boolean): Promise<any | null> {
    try {
      await Pessoa.update({ ativo }, { where: { id_pessoa: id } });
      return this.getById(id);
    } catch (error) {
      console.error('Erro ao atualizar status ativo:', error);
      throw error;
    }
  }

  // Lista pessoas por status
  async getByStatus(status: 'aprovado' | 'rejeitado' | 'pendente'): Promise<any[]> {
    try {
      const pessoas = await Pessoa.findAll({
        where: { status },
        attributes: this.pessoaAttributes,
        include: this.pessoaIncludes,
      });

      const pessoasComDados = await Promise.all(
        pessoas.map(pessoa => this.getDadosRelacionados(pessoa))
      );

      return pessoasComDados;
    } catch (error) {
      console.error('Erro ao listar pessoas por status:', error);
      throw error;
    }
  }

  // Lista pessoas ativas
  async getAtivas(): Promise<any[]> {
    try {
      const pessoas = await Pessoa.findAll({
        where: { ativo: true },
        attributes: this.pessoaAttributes,
        include: this.pessoaIncludes,
      });

      const pessoasComDados = await Promise.all(
        pessoas.map(pessoa => this.getDadosRelacionados(pessoa))
      );

      return pessoasComDados;
    } catch (error) {
      console.error('Erro ao listar pessoas ativas:', error);
      throw error;
    }
  }
}