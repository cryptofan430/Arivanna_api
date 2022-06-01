import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import Employee from "./employee";

@Entity("leave_setting", { synchronize: false })
class LeaveSetting {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    employee_id: number;
    @ManyToOne(() => Employee, (employee: any) => employee.leave_settings)
    @JoinColumn({ name: 'employee_id' })
    employee: Employee;

    @Column({ length: 255 })
    name: string;

    @Column()
    days: number
    
    @Column()
    is_on: boolean

    @Column()
    is_active: boolean

    @CreateDateColumn()
    created_at: Date;

    @Column()
    created_by: string;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    updated_by: string;

    @OneToMany(() => Employee, (employee: any) => employee.leave_setting)
    employees: Employee[];
}

export default LeaveSetting;