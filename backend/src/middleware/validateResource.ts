import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

interface ValidatedData {
  body?: any;
  query?: any;
  params?: any;
}

const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as ValidatedData;
      
      // Replace request data with validated and sanitized data
      req.body = validatedData.body || req.body;
      req.query = validatedData.query || req.query;
      req.params = validatedData.params || req.params;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors
        });
      }
      
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Validation error occurred'
      });
    }
  };

export default validate;