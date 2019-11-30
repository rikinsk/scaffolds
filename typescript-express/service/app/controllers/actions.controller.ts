import { Router, Request, Response } from 'express';

const router: Router = Router();
export const ActionsController: Router = router;

router.get('/', (req: Request, res: Response) => {
    res.send(`Hello world`);
});


