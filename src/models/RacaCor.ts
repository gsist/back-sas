import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'tbl_raca_cor',
  timestamps: false,
})
export class RacaCor extends Model<RacaCor> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id_raca_cor!: number;

  @Column({ type: DataType.STRING(40), allowNull: false })
  nome!: string;
}
