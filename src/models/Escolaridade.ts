// models/Escolaridade.ts
import { Table, Column, Model, PrimaryKey, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'tbl_escolaridade',
  timestamps: false,
})
export class Escolaridade extends Model<Escolaridade> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id_instrucao!: number;

  @Column({ type: DataType.STRING(80), allowNull: false })
  nome!: string;
}
