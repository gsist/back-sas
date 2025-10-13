// src/models/Notifica.ts
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull, Default } from "sequelize-typescript";

@Table({
  tableName: "notificas",
  timestamps: false
})
export class Noticia extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true
  })
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(150),
    field: "titulo"
  })
  titulo!: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    field: "conteudo"
  })
  conteudo!: string | null;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
    field: "url_img"
  })
  url_img!: string | null;

  @AllowNull(true)
  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: "created_at"
  })
  created_at!: Date;
}
