import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Task } from '../../tasks/entities/task.entity';

@Table({ tableName: 'tags' })
export class Tags extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column
  name: string;

  @Column
  cor: string;

  @ForeignKey(() => Task)
  @Column({ field: 'task_id' })
  taskId: number;
}
