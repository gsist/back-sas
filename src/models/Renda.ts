// models/Renda.ts
import { Table, Column, Model, PrimaryKey, AutoIncrement, ForeignKey, DataType } from 'sequelize-typescript';
import { Pessoa } from './Pessoa';

@Table({
  tableName: 'tbl_rendas',
  timestamps: false,
})
export class Renda extends Model<Renda> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_renda!: number;

  @ForeignKey(() => Pessoa)
  @Column({ type: DataType.INTEGER, allowNull: false })
  id_pessoa!: number;

  @Column({ type: DataType.DECIMAL(12,2), allowNull: false })
  valor!: number;

  @Column({ type: DataType.STRING(120), allowNull: true })
  fonte?: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  referencia_mes!: Date;
}
