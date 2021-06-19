const Joi = require("joi");
const { Subscription } = require("../../../helpers/constans");
const subscriptions = Object.values(Subscription);

const schemaCreateUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "mail"] },
    })
    .required(),
  password: Joi.string().min(3).max(15).required(),
});

const schemaLoginUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "mail"] },
    })
    .required(),
  password: Joi.string().min(3).max(15).required(),
});

const schemaUpdateSubscription = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptions)
    .required(),
});

const schemaRepearSendEmail = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "mail"] },
    })
    .required(),
});

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    next({
      status: 400,
      message: err.message.replace(/"/g, ""),
    });
  }
};

module.exports = {
  validationCreateUser: (req, res, next) => {
    return validate(schemaCreateUser, req.body, next);
  },
  validationLoginUser: (req, res, next) => {
    return validate(schemaLoginUser, req.body, next);
  },

  validationSubscriptionUpdate: (req, res, next) => {
    return validate(schemaUpdateSubscription, req.body, next);
  },

  validationRepearSendEmail: (req, res, next) => {
    return validate(schemaRepearSendEmail, req.body, next);
  },
};
