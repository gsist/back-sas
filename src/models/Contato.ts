// models/Contato.ts
import { Table, Column, Model, PrimaryKey, AutoIncrement, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import { Pessoa } from './Pessoa';

@Table({
  tableName: 'tbl_contatos',
  timestamps: false,
})
export class Contato extends Model<Contato> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_contato!: number;

  @ForeignKey(() => Pessoa)
  @Column({ type: DataType.INTEGER, allowNull: false })
  id_pessoa!: number;

  @Column({ type: DataType.ENUM('CELULAR','FIXO','EMAIL','OUTRO'), allowNull: false })
  tipo!: 'CELULAR' | 'FIXO' | 'EMAIL' | 'OUTRO';

  @Column({ type: DataType.STRING(255), allowNull: false })
  valor!: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  principal!: boolean;

  @BelongsTo(() => Pessoa)
  pessoa!: Pessoa;
}
