import {EntityRepository, Repository} from 'typeorm';

import RoleMaster from '../entities/RoleMaster';

@EntityRepository(RoleMaster)
class RoleMasterRepositories extends Repository<RoleMaster> {}

export default RoleMasterRepositories;
