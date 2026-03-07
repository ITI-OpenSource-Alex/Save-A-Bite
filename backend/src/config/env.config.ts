import dotenv from "dotenv";
import Joi from "joi";

dotenv.config({ quiet: true });

const processEnvSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
  PORT: Joi.number().default(3000),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRE: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRE: Joi.string().required(),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PORT: Joi.number().required(),
  EMAIL_USER: Joi.string().required(),
  EMAIL_PASS: Joi.string().required(),
  APP_URL: Joi.string().required(),
})
  .unknown()
  .required();

const { value: envVars, error: envError } = processEnvSchema.validate(process.env);

if (envError) {
  throw new Error(`Environment variables validation error: ${envError.message}`);
}

export const envSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  APP: Joi.object({
    PORT: Joi.number().required(),
    URL: Joi.string().required(),
  }).required(),
  MONGO: Joi.object({
    URI: Joi.string().required(),
  }).required(),
  JWT: Joi.object({
    SECRET: Joi.string().required(),
    EXPIRE: Joi.string().required(),
    REFRESH_SECRET: Joi.string().required(),
    REFRESH_EXPIRE: Joi.string().required(),
  }).required(),
  EMAIL: Joi.object({
    HOST: Joi.string().required(),
    PORT: Joi.number().required(),
    USER: Joi.string().required(),
    PASS: Joi.string().required(),
  }).required(),
});

const env = {
  NODE_ENV: envVars.NODE_ENV,
  APP: {
    PORT: envVars.PORT,
    URL: envVars.APP_URL,
  },
  MONGO: {
    URI: envVars.MONGO_URI,
  },
  JWT: {
    SECRET: envVars.JWT_SECRET,
    EXPIRE: envVars.JWT_EXPIRE,
    REFRESH_SECRET: envVars.JWT_REFRESH_SECRET,
    REFRESH_EXPIRE: envVars.JWT_REFRESH_EXPIRE,
  },
  EMAIL: {
    HOST: envVars.EMAIL_HOST,
    PORT: envVars.EMAIL_PORT,
    USER: envVars.EMAIL_USER,
    PASS: envVars.EMAIL_PASS,
  },
};

export default env;
