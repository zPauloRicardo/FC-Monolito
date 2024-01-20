import {Request, Response, Router} from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import Address from "../../../modules/@shared/domain/value-object/address";

export const clientRouter = Router();

clientRouter.post("/", (req: Request, res: Response) => {
    const facade = ClientAdmFacadeFactory.create();
    try {
        facade.add({
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            address: new Address({
                street: req.body.street,
                number: req.body.number,
                complement: req.body.complement,
                city: req.body.city,
                state: req.body.state,
                zipCode: req.body.zipCode
            })
        });
        res.status(201).send();
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({message: error.message});
        }
    }
});
