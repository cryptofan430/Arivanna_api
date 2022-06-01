import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import CompanyMaster from "./CompanyMaster";
import DesignationMaster from "./DesignationMaster";
import Employee from "./employee";

@Entity("department_master", { synchronize: false })
class DepartmentMaster {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column({ length: 255 })
    name: string;

    @Column()
    company_id: number;
    @ManyToOne(() => CompanyMaster, (company: any) => company.departments)
    @JoinColumn({ name: 'company_id' })
    company: CompanyMaster[];

    @CreateDateColumn()
    created_at: Date;

    @Column()
    created_by: number;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    updated_by: number;

    @OneToMany(() => Employee, (employee: any) => employee.department)
    employees: Employee[];

    @OneToMany(() => Employee, (designation: any) => designation.department)
    designations: DesignationMaster[];
}

export default DepartmentMaster;