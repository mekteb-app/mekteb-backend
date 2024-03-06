import { Request, Response, NextFunction } from 'express';
import { ChildService } from '../services/child.service';
import { Result } from '../../../constants/result';
import { LogHelper } from '../../../utils/log-helper';
import { StatusCodes } from 'http-status-codes';
import { Status } from 'src/db/enums';

export class CreateChildHandler {
	public static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		const childService = new ChildService();

		const inserted = await childService.insertChild({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			birthdate: req.body.birthdate || null,
			community: req.body.communityId,
			nivo: req.body.nivo,
			status: Status.ACTIVE,
			parents: undefined,
			messages: undefined,
			created_at: new Date(),
			updated_at: new Date(),
		});

		if (inserted.type === Result.ERROR) {
			LogHelper.error(inserted.message, inserted.error);
			return next(inserted.error);
		}

		res.status(StatusCodes.ACCEPTED).json(inserted.data);
	}
}
