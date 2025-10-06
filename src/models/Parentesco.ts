// models/Parentesco.ts
import { Table, Column, Model, PrimaryKey, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'tbl_parentesco',
  timestamps: false,
})
export class Parentesco extends Model<Parentesco> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id_parentesco!: number;

  @Column({ type: DataType.STRING(40), allowNull: false })
  nome!: string;
}
