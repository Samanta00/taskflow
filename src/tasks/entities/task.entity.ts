import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Tags } from '../../tags/entities/tags.entity';

@Table({ tableName: 'tasks' })
export class Task extends Model<Task> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column
  title: string;

  @Column
  status: string;

  @Column
  description: string;

  @Column
  priority: number;

  @HasMany(() => Tags)
  tags?: Tags[];
}
