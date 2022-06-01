import { getCustomRepository } from 'typeorm';

import CompanyMasterRepositories from '../repositories/CompanyMasterRepository';
import DepartmentMasterRepositories from '../repositories/DepartmentMasterRepository';

import IDepartmentMasterRequest from "../interfaces/IDMRequest";


class CreateDepartmentMasterService {
    async execute({
        name,
        company_id
    }: IDepartmentMasterRequest) {
        const depRepo = getCustomRepository(DepartmentMasterRepositories);
        const companyRepo = getCustomRepository(CompanyMasterRepositories);

        const comExists = await companyRepo.findOne(company_id);
        if( !comExists ) throw new Error("Company/id doest not exists");

        const dep = await depRepo.create({ name, company_id });

        await depRepo.save(dep);

        return dep;
    }
};

export default CreateDepartmentMasterService;
