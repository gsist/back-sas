// src/models/Noticia.ts

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
} from "sequelize-typescript";

@Table({
  tableName: "noticias",
  timestamps: false,
})
export class Noticia extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(150))
  titulo!: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  conteudo!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  url_img!: string | null;

  @AllowNull(false)
  @Default("postado")
  @Column({
    type: DataType.ENUM("arquivado", "programado", "postado"),
  })
  status!: "arquivado" | "programado" | "postado";

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    field: "dataAgendada",
  })
  dataAgendada!: Date | null;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: "data_criacao",
  })
  dataCriacao!: Date;
}
