import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
    ManyToOne,
    OneToMany,
    JoinColumn
} from 'typeorm';

import { Exclude } from 'class-transformer';

import CompanyMaster from './CompanyMaster';
import DepartmentMaster from './DepartmentMaster';
import LeaveSetting from './LeaveSetting';
import RoleMaster from './RoleMaster';
import DesignationMaster from './DesignationMaster';


@Entity('employee', { synchronize: false })
@Unique(["employee_id"])
class Employee {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column({ length: 150 })
    employee_id: string;

    @Column({ length: 150 })
    first_name: string;

    @Column({ length: 150 })
    last_name: string;

    @Column({ length: 150 })
    user_name: string;

    @Column({ length: 50 })
    email: string;

    @Exclude()
    @Column({ length: 20 })
    password: string;

    @Column('datetime')
    joining_date: string;

    @Column({ length: 12 })
    phone: string;

    @Column()
    company_id: number
    @ManyToOne(() => CompanyMaster, (company: any) => company.employees)
    @JoinColumn({ name: 'company_id' })
    company: CompanyMaster;

    @Column()
    department_id: number
    @ManyToOne(() => DepartmentMaster, (department: any) => department.employees)
    @JoinColumn({ name: 'department_id' })
    department: DepartmentMaster;

    @Column()
    designation_id: number
    @ManyToOne(() => DesignationMaster, (designation: any) => designation.employees)
    @JoinColumn({ name: 'designation_id' })
    designation: DesignationMaster;

    // TODO(UMAR): Check on later
    // @Column()
    // leave_setting_id: number;
    // @ManyToOne(() => LeaveSetting, (leave_setting: any) => leave_setting.employees)
    // @JoinColumn({ name: 'leave_setting_id' })
    // leave_setting: LeaveSetting;

    @Column()
    is_active: boolean;

    @Column()
    roll_id: number
    @ManyToOne(() => RoleMaster, (roll: any) => roll.employees)
    @JoinColumn({ name: 'roll_id' })
    roll: RoleMaster;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    created_by: number;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    updated_by: number;

    @OneToMany(() => LeaveSetting, (leave_setting: any) => leave_setting.employee)
    leave_settings: LeaveSetting[];
}

export default Employee
