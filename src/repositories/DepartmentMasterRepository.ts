import {EntityRepository, Repository} from 'typeorm';

import DepartmentMaster from '../entities/DepartmentMaster';

@EntityRepository(DepartmentMaster)
class DepartmentMasterRepositories extends Repository<DepartmentMaster> {}

export default DepartmentMasterRepositories;
