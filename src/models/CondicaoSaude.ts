// models/CondicaoSaude.ts
import { Table, Column, Model, PrimaryKey, AutoIncrement, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import { Pessoa } from './Pessoa';

@Table({
  tableName: 'tbl_condicoes_saude',
  timestamps: false,
})
export class CondicaoSaude extends Model<CondicaoSaude> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_condicao!: number;

  @ForeignKey(() => Pessoa)
  @Column({ type: DataType.INTEGER, allowNull: false })
  id_pessoa!: number;

  @Column({ type: DataType.STRING(10), allowNull: true })
  cid?: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  pcd?: boolean;

  @Column({ type: DataType.STRING(255), allowNull: true })
  observacao?: string;

  @BelongsTo(() => Pessoa)
  pessoa!: Pessoa;
}
