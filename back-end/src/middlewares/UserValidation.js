import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: err.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message
        }))
      });
    }

    next(err);
  }
};
