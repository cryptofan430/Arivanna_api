import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import DepartmentMaster from "./DepartmentMaster";
import Employee from "./employee";

@Entity('company_master', { synchronize: false })
class CompanyMaster {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column({ length: 256 })
    name: string;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    created_by: number;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    updated_by: number;

    @OneToMany(() => Employee, (employee: any) => employee.company)
    employees: Employee[];

    @OneToMany(() => DepartmentMaster, (department: any) => department.company)
    departments: DepartmentMaster[];
}

export default CompanyMaster;
