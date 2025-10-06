// models/Endereco.ts
import { Table, Column, Model, PrimaryKey, AutoIncrement, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import { Pessoa } from './Pessoa';

@Table({
  tableName: 'tbl_enderecos',
  timestamps: false,
})
export class Endereco extends Model<Endereco> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_endereco!: number;

  @ForeignKey(() => Pessoa)
  @Column({ type: DataType.INTEGER, allowNull: false })
  id_pessoa!: number;

  @Column({ type: DataType.STRING(255), allowNull: true })
  logradouro?: string;

  @Column({ type: DataType.STRING(20), allowNull: true })
  numero?: string;

  @Column({ type: DataType.STRING(60), allowNull: true })
  complemento?: string;

  @Column({ type: DataType.STRING(120), allowNull: true })
  bairro?: string;

  @Column({ type: DataType.STRING(120), allowNull: true })
  cidade?: string;

  @Column({ type: DataType.STRING(2), allowNull: true })
  estado?: string;

  @Column({ type: DataType.STRING(8), allowNull: true })
  cep?: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  atual!: boolean;

  @BelongsTo(() => Pessoa)
  pessoa!: Pessoa;
}
