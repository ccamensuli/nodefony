 class users extends nodefony.Service {

   constructor(container) {
     super("users", container);
     this.orm = this.kernel.getORM();
     this.ormName = this.orm.name;
     if (this.orm.ready) {
       this.initialize();
     } else {
       this.orm.on("onOrmReady", () => {
         this.initialize();
       });
     }
   }

   initialize() {
     this.entity = this.orm.getEntity("user");
   }

   sanitizeSequelizeError(error) {
     if (nodefony.Error.isError(error) === "SequelizeError") {
       return new nodefony.Error(error);
     }
     return error;
   }

   getSchemaAttributes() {
     switch (this.ormName) {
     case "sequelize":
       return this.entity.rawAttributes;
     case "mongoose":
       return this.entity.schema.paths;
     }
   }

   checkSchema(query) {
     try {
       if (query) {
         const attr = this.getSchemaAttributes();
         for (let ele in query) {
           if (ele in attr) {
             continue;
           }
           throw new nodefony.Error(`${ele} not found in User Entity Schema`, 400);
         }
       }
     } catch (e) {
       throw e;
     }
   }

   find(query = {}, options = {}) {
     try {
       switch (this.ormName) {
       case "mongoose":
         if (options.limit || options.offset || options.page) {
           return this.entity.paginate(query, {
               page: options.page,
               limit: options.limit,
               offset: options.offset
             })
             .then((res) => {
               let tab = [];
               if (!res) {
                 return {
                   page: options.page,
                   limit: options.limit,
                   offset: options.offset,
                   total: tab.length,
                   rows: tab
                 };
               }
               return {
                 page: res.page,
                 limit: res.limit,
                 offset: res.offset,
                 total: res.totalDocs,
                 totalPages: res.totalPages,
                 pagingCounter: res.pagingCounter,
                 hasPrevPage: res.hasPrevPage,
                 hasNextPage: res.hasNextPage,
                 prevPage: res.prevPage,
                 nextPage: res.nextPage,
                 rows: res.docs
               };
             }).catch(e => {
               throw e;
             });
         }
         return this.entity.find(query, options)
           .then((res) => {
             let tab = [];
             if (!res) {
               return {
                 total: tab.length,
                 rows: tab
               };
             }
             return {
               total: res.length,
               rows: res
             };
           }).catch(e => {
             throw e;
           });
       case "sequelize":
         query = nodefony.extend(query, options);
         if (query.limit || query.offset) {
           return this.entity.findAndCountAll(query)
             .then((res) => {
               let tab = [];
               if (!res) {
                 return {
                   page: query.page,
                   limit: query.limit,
                   offset: query.offset,
                   total: tab.length,
                   rows: tab
                 };
               }
               res.rows.map((el) => {
                 tab.push(el.get({
                   plain: true
                 }));
               });
               return {
                 page: query.page,
                 limit: query.limit,
                 offset: query.offset,
                 total: res.count,
                 rows: tab
               };
             }).catch(e => {
               throw this.sanitizeSequelizeError(e);
             });
         }
         return this.entity.findAll(query)
           .then((res) => {
             let tab = [];
             if (!res) {
               return {
                 total: tab.length,
                 rows: tab
               };
             }
             res.map((el) => {
               tab.push(el.get({
                 plain: true
               }));
             });
             return {
               total: tab.length,
               rows: tab
             };
           })
           .catch(e => {
             throw this.sanitizeSequelizeError(e);
           });
       }
     } catch (e) {
       throw e;
     }
   }

   findOne(username) {
     try {
       switch (this.ormName) {
       case "mongoose":
         return this.entity.findOne({
           username: username
         });
       case "sequelize":
         return this.entity.findOne({
             where: {
               username: username
             }
           })
           .then((el) => {
             if (!el) {
               throw new nodefony.Error(`Username ${username} not found`, 404);
             }
             return el.get({
               plain: true
             });
           })
           .catch(e => {
             throw this.sanitizeSequelizeError(e);
           });
       }
     } catch (e) {
       throw this.sanitizeSequelizeError(e);
     }
   }

   async update(user, value) {
     switch (this.ormName) {
     case "mongoose":
       let session = null;
       try {
         session = await this.orm.startTransaction("user");
         return user.updateOne(value)
           .then((user) => {
             session.commitTransaction();
             return user;
           }).catch(e => {
             session.abortTransaction();
             throw e;
           });
       } catch (e) {
         if (session) {
           session.abortTransaction();
         }
         throw e;
       }
       break;
     case "sequelize":
       let transaction = null;
       try {
         transaction = await this.orm.startTransaction("user");
         const {
           username
         } = user;
         return this.entity.update(value, {
             where: {
               username: username
             }
           }, {
             transaction: transaction
           })
           .then((user) => {
             transaction.commit();
             return user;
           }).catch(e => {
             transaction.rollback();
             throw this.sanitizeSequelizeError(e);
           });
       } catch (e) {
         if (transaction) {
           transaction.rollback();
         }
         throw this.sanitizeSequelizeError(e);
       }
     }
   }

   async create(query) {
     switch (this.ormName) {
     case "sequelize":
       let transaction = null;
       try {
         transaction = await this.orm.startTransaction("user");
         return this.entity.create(query, {
             transaction: transaction
           })
           .then((user) => {
             transaction.commit();
             return user;
           }).catch(e => {
             transaction.rollback();
             throw this.sanitizeSequelizeError(e);
           });
       } catch (e) {
         if (transaction) {
           transaction.rollback();
         }
         throw this.sanitizeSequelizeError(e);
       }
       break;
     case "mongoose":
       let session = null;
       try {
         session = await this.orm.startTransaction("user");
         return this.entity.create(query)
           .then((user) => {
             session.commitTransaction();
             return user;
           }).catch(e => {
             session.abortTransaction();
             throw e;
           });
       } catch (e) {
         if (session) {
           session.abortTransaction();
         }
         throw e;
       }
     }
   }

   async delete(username) {
     switch (this.ormName) {
     case "mongoose":
       let session = null;
       try {
         return this.entity.findOne({
             username: username
           })
           .then(async (user) => {
             if (!user) {
               throw new nodefony.Error(`User ${username} not found`);
             }
             session = await this.orm.startTransaction("user");
             return user.remove({
                 force: true
               })
               .then((user) => {
                 session.commitTransaction();
                 return user;
               }).catch(e => {
                 session.abortTransaction();
                 throw e;
               });
           })
           .catch(e => {
             if (session) {
               session.abortTransaction();
             }
             throw e;
           });

       } catch (e) {
         if (session) {
           session.abortTransaction();
         }
         throw e;
       }
       break;
     case "sequelize":
       let transaction = null;
       try {
         return this.entity.findOne({
             where: {
               username: username
             }
           })
           .then(async (user) => {
             if (!user) {
               throw new nodefony.Error(`User ${username} not found`);
             }
             transaction = await this.orm.startTransaction("user");
             return user.destroy({
                 transaction: transaction
               })
               .then((user) => {
                 transaction.commit();
                 return user;
               }).catch(e => {
                 transaction.rollback();
                 throw this.sanitizeSequelizeError(e);
               });
           });
       } catch (e) {
         if (transaction) {
           transaction.rollback();
         }
         throw this.sanitizeSequelizeError(e);
       }
     }
   }
 }

 module.exports = users;
