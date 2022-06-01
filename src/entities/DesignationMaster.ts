import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import DepartmentMaster from "./DepartmentMaster";
import Employee from "./employee";

@Entity("department_master", { synchronize: false })
class DesignationMaster {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column({ length: 255 })
    name: string;

    @Column()
    department_id: number;
    @ManyToOne(() => DepartmentMaster, (department: any) => department.designations)
    @JoinColumn({ name: 'department_id' })
    department: DepartmentMaster;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    created_by: number;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    updated_by: number;

    @OneToMany(() => Employee, (employee: any) => employee.designation)
    employees: Employee[];
}

export default DesignationMaster;