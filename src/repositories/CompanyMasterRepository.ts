import {EntityRepository, Repository} from 'typeorm';

import CompanyMaster from '../entities/CompanyMaster';

@EntityRepository(CompanyMaster)
class CompanyMasterRepositories extends Repository<CompanyMaster> {}

export default CompanyMasterRepositories;
