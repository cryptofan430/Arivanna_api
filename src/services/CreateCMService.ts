import { getCustomRepository } from 'typeorm';

import CompanyMasterRepositories from '../repositories/CompanyMasterRepository';

import ICMRequest from '../interfaces/ICMRequest';

class CreateCompanyMasterService {
    async execute({
        name
    }: ICMRequest) {
        const companyRepo = getCustomRepository(CompanyMasterRepositories);

        const company = await companyRepo.create({ name });
        
        await companyRepo.save(company);

        return company;
    }
};

export default CreateCompanyMasterService;
