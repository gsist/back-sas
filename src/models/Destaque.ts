// src/models/Destaque.ts
import { 
  Table, Column, Model, DataType, PrimaryKey, 
  AutoIncrement, AllowNull, Default 
} from "sequelize-typescript";

@Table({
  tableName: "destaques",
  timestamps: false
})
export class Destaque extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(150), field: "titulo" })
  titulo!: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(255), field: "url_img" })
  url_img!: string | null;

  @Default(1)
  @Column({
    type: DataType.BOOLEAN,
  })
  ativo!: boolean;


  @AllowNull(false)
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: "data_criacao" })
  dataCriacao!: Date;
}
