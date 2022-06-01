import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import Employee from "./employee";

@Entity("role_master", { synchronize: false })
class RoleMaster {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column({ length: 255 })
    roll_name: string;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    created_by: number;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    updated_by: number;

    @OneToMany(() => Employee, (employee: any) => employee.roll)
    employees: Employee[];
}

export default RoleMaster;