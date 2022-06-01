import {EntityRepository, Repository} from 'typeorm';

import DesignationMaster from '../entities/DesignationMaster';

@EntityRepository(DesignationMaster)
class DesignationMasterRepositories extends Repository<DesignationMaster> {}

export default DesignationMasterRepositories;
