// src/models/UsuarioAd.ts
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Default, AllowNull } from "sequelize-typescript";

@Table({
  tableName: "tbl_usuario",
  timestamps: false
})
export class LoginAdm extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true
  })
  id!: number;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(100),
    field: 'email'
  })
  email!: string | null;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(100),
    field: 'nome'
  })
  nome!: string | null;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
    field: 'password'
  })
  password!: string | null;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
    field: 'username'
  })
  username!: string | null;

  @AllowNull(true)
  @Default(1)
  @Column({
    type: DataType.TINYINT,
    field: 'ch_ativo'
  })
  ch_ativo!: number | null;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
    field: 'hash_2fa'
  })
  hash_2fa!: string | null;

  @AllowNull(true)
  @Default(0)
  @Column({
    type: DataType.TINYINT,
    field: 'ativo_2fa'
  })
  ativo_2fa!: number;

  @AllowNull(true)
  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: 'criado_em'
  })
  criado_em!: Date;
}