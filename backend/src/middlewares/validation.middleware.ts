import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, RequestHandler, Response as ExpressResponse } from "express";
import BadRequestException from "../exceptions/bad-request.exception";

type RequestSource = 'body' | 'query' | 'params';

const ValidationMiddleware = (
  type: any,
  source: RequestSource = 'body' ,
  skipMissingProperties = false
): RequestHandler => {
  return (req: Request, res: ExpressResponse, next: NextFunction) => {
    const data = req[source];
    const transformedData = plainToInstance(type, data);

    validate(transformedData, { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const formatedErrors = getErrorsFormated(errors);
          return next(new BadRequestException("BAD_REQUEST", formatedErrors));
        } else {
          if (source === 'body') {
            req.body = transformedData;
          }
          next();
        }
      }
    );
  };
};

export const getErrorsFormated = (errors: ValidationError[]): any => {
  const formattedErrors: any = [];
  errors.forEach((e: ValidationError) => {
    formattedErrors.push({
      [e.property]: [...Object.values(e.constraints ?? {})],
    });
  });
  return formattedErrors;
};

export default ValidationMiddleware;
