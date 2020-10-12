/*
 *
 *
 *    ENTITY USER
 *
 *
 */
//const Mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const validator = require('validator');

class userEntity extends nodefony.Entity {

  constructor(bundle) {
    /*
     *   @param bundle instance
     *   @param Entity name
     *   @param orm name
     *   @param connection name
     */
    super(bundle, "user", "mongoose", "nodefony");
    this.once("onConnect", (name, db) => {
      this.model = this.registerModel(db);
      this.orm.setEntity(this);
    });
  }

  getSchema() {
    //const encodePassword = this.encode.bind(this);
    return {
      username: {
        type: String,
        unique: true,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      "2fa": {
        type: Boolean,
        default: false
      },
      "2fa-token": {
        type: String
      },
      enabled: {
        type: Boolean,
        default: true
      },
      userNonExpired: {
        type: Boolean,
        default: true
      },
      credentialsNonExpired: {
        type: Boolean,
        default: true
      },
      accountNonLocked: {
        type: Boolean,
        default: true
      },
      email: {
        type: String,
        unique: true,
        required: true,
        validate: [validator.isEmail, 'invalid email {VALUE}'],
        createIndexes: {
          unique: true
        }
      },
      name: {
        type: String,
        validate: {
          validator: (value) => {
            // Check if value is empty then return true.
            if (value === "") {
              return true;
            }
            return validator.matches(value, /[^\w]|_|-|.|'/g);
          },
          message: "name allow alphanumeric characters {VALUE}"
        }
      },
      surname: {
        type: String,
        validate: {
          validator: (value) => {
            // Check if value is empty then return true.
            if (value === "") {
              return true;
            }
            return validator.matches(value, /[^\w]|_|-|.|'/g);
          },
          message: "surname allow alphanumeric characters {VALUE}"
        }
      },
      lang: {
        type: String,
        default: "en_en"
      },
      roles: {
        type: Array,
        default: ["ROLE_USER"]
      },
      gender: {
        type: String,
        default: "none"
      },
      url: {
        type: String
      },
      image: {
        type: String
      }
    };
  }

  validPassword(value) {
    let valid = validator.isLength(value, {
      min: 4,
      max: undefined
    });
    if (!valid) {
      throw new nodefony.Error("password must have 4 characters min");
    }
    return value;
  }

  registerModel(db) {
    let mySchema = new Schema(this.getSchema(), {
      timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
    });
    mySchema.plugin(mongoosePaginate);
    let entity = this;
    mySchema.pre('save', function (next) {
      if (!this.isModified('password')) {
        return next();
      }
      entity.logger("hash password ", "DEBUG");
      entity.validPassword(this.password);
      return entity.encode(this.password)
        .then(hash => {
          entity.logger(hash, "DEBUG");
          this.password = hash;
          return hash;
        })
        .catch(err => {
          entity.logger(err, "ERROR");
          throw err;
        });
    });
    mySchema.pre('updateOne', function (next) {
      //const data = this.getUpdate();
      let password = this.get("password");
      if (!password) {
        return next();
      }
      entity.logger("update password hash", "DEBUG");
      entity.validPassword(password);
      return entity.encode(password)
        .then(hash => {
          entity.logger(hash, "DEBUG");
          this._update.password = hash;
        })
        .catch(err => {
          entity.logger(err, "ERROR");
          throw err;
        });
    });
    return db.model(this.name, mySchema, this.name);
  }
}

module.exports = userEntity;