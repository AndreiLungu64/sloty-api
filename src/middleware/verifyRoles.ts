import { NextFunction, Request, Response } from "express";

/*this logic checks if the user has at least one of the allowed roles 
(the ones you passed in the verifyRoles when you set this middleware for a specific route)*/

function verifyRoles(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req?.role) {
      res.sendStatus(401); //unauthorised
      return;
    }

    const rolesArray = [...allowedRoles];
    const result = rolesArray.includes(req?.role);

    if (!result) {
      res.sendStatus(401); //unauthorised
      //   console.log('You dont have the necessary role to perform this action!');
      return;
    }

    next();
  };
}

export default verifyRoles;
