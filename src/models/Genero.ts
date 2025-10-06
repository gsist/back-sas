// models/Genero.ts
import { Table, Column, Model, PrimaryKey, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'tbl_genero',
  timestamps: false,
})
export class Genero extends Model<Genero> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id_genero!: number;

  @Column({ type: DataType.STRING(30), allowNull: false })
  nome!: string;
}
