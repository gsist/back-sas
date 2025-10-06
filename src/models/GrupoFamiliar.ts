// src/models/GrupoFamiliar.ts
import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Pessoa } from './Pessoa';

@Table({
  tableName: 'tbl_grupo_familiar',
  timestamps: false,
})
export class GrupoFamiliar extends Model<GrupoFamiliar> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id_grupo_familiar!: number;

  @ForeignKey(() => Pessoa)
  @Column({ type: DataType.BIGINT, allowNull: false })
  id_chefe_familia!: number;

  @BelongsTo(() => Pessoa)
  chefeFamilia!: Pessoa;
}