import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, removeAdditional: 'failing' });
addFormats(ajv);

export function compileSchema<T = unknown>(schema: object) {
  const validate = ajv.compile<T>(schema);
  return (data: unknown) => ({ valid: validate(data as T), errors: validate.errors });
}
