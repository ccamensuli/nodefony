const users = require("./users.js");

class usersFixture extends nodefony.Fixture {

  constructor(container) {
    super("users", container);
    this.usersService = this.get("users");
    this.entity = this.orm.getEntity("user");
  }

  async initialize(random = 0) {
    switch (this.ormName) {
    case 'sequelize':
      if (random) {
        return await this.randomSequelize(random);
      }
      return await this.runSequelize();
    case "mongoose":
      if (random) {
        return await this.randomMongoose(random);
      }
      return await this.runMongoose();
    }
  }

  async randomSequelize(nb) {
    try {
      let tab = [];
      const random = new users.random();
      let fixs = random.randomUser(nb);
      for await (let user of fixs) {
        tab.push(await this.loadSequelizeFixtures(user));
      }
      return tab;
    } catch (e) {
      this.logger(e, "ERROR");
    }
  }

  async runSequelize() {
    try {
      let tab = [];
      for await (let user of users.default) {
        tab.push(await this.loadSequelizeFixtures(user));
      }
      return tab;
    } catch (e) {
      this.logger(e, "ERROR");
    }
  }

  loadSequelizeFixtures(obj) {
    return this.entity.findOrCreate({
        where: {
          username: obj.username
        },
        defaults: obj
      })
      .then((res) => {
        if (res[1]) {
          this.logger("ADD USER : " + res[0].username, "INFO");
        } else {
          this.logger("ALREADY EXIST USER : " + res[0].username, "INFO");
        }
        return res[1];
      });
  }

  async randomMongoose(nb) {
    try {
      let tab = [];
      const random = new users.random();
      let fixs = random.randomUser(nb);
      for await (let user of fixs) {
        tab.push(await this.loadMongooseFixtures(user));
      }
      return tab;
    } catch (e) {
      this.logger(e, "ERROR");
    }
  }

  async runMongoose() {
    try {
      let tab = [];
      for await (let user of users.default) {
        tab.push(await this.loadMongooseFixtures(user));
      }
      return tab;
    } catch (e) {
      this.logger(e, "ERROR");
    }
  }

  loadMongooseFixtures(obj) {
    return new Promise(async (resolve, reject) => {
      try {
        let document = await this.entity.findOne({
          username: obj.username
        });
        if (document) {
          this.logger("ALREADY EXIST USER : " + obj.username, "INFO");
        } else {
          document = await new this.entity(obj).save();
          this.logger("ADD DOCUMENT USER : " + obj.username, "INFO");
        }
        return resolve(document);
      } catch (e) {
        return reject(e);
      }
    });
  }
}

module.exports = usersFixture;
