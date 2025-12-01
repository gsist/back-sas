// back-sas/src/models/UsuarioAd.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  AllowNull,
} from "sequelize-typescript";

@Table({
  tableName: "usuario",
  timestamps: false,
})
export class UsuarioAd extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(60),
  })
  username!: string;

  @AllowNull(false)
  @Default("administrador")
  @Column({
    type: DataType.ENUM("administrador", "superadmin"),
  })
  cargo!: "administrador" | "superadmin";

  @AllowNull(false)
  @Default(1)
  @Column({
    type: DataType.TINYINT,
  })
  ch_ativo!: number;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
  })
  hash_2fa!: string | null;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.TINYINT,
  })
  ativo_2fa!: number;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
  })
  criado_em!: Date | null;
}