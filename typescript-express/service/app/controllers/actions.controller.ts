import { Router, Request, Response } from 'express';

const router: Router = Router();

router.post('/', (req: Request, res: Response) => {
    res.json({hello: "world"});
});

router.get('/:name', (req: Request, res: Response) => {
    let { name } = req.params;

    res.send(`Hello, ${name}!`);
});


export const WelcomeController: Router = router;