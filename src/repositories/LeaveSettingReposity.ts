import {EntityRepository, Repository} from 'typeorm';

import LeaveSetting from '../entities/LeaveSetting';

@EntityRepository(LeaveSetting)
class LeaveSettingRepositories extends Repository<LeaveSetting> {}

export default LeaveSettingRepositories;
