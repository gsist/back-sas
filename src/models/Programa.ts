// models/Programa.ts
import { Table, Column, Model, PrimaryKey, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'tbl_programa',
  timestamps: false,
})
export class Programa extends Model<Programa> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  cod_programa!: number;

  @Column({ type: DataType.STRING(120), allowNull: false })
  nome!: string;
}
