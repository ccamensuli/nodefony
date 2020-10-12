const localFramework = kernel.app.settings.locale;
let Faker = null ;
try {
  Faker = require(`faker`);
} catch (e) {}
//const local = localFramework.slice(0, 2);
//const Faker = require(`faker/locale/${local}`);
//Faker.locale = local;

//let uuid = Faker.random.uuid();
//let ele = `/${uuid.split('-').slice(1, 4).join('\/')}/${uuid}.jpg `;


const rolesArray = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_TEST', 'ROLE_AUDIO', 'ROLE_VIDEO'];

const defaultFixtures = [{
  username: "anonymous",
  name: "anonymous",
  surname: "anonymous",
  password: "anonymous",
  email: "anonymous@nodefony.com",
  "2fa": false,
  lang: "en_en",
  roles: ["ROLE_ANONYMOUS"]
}, {
  username: "admin",
  name: "administrator",
  surname: "nodefony",
  password: "admin",
  "2fa": false,
  email: "administrator@nodefony.com",
  roles: ["ROLE_ADMIN"]
}, {
  username: "1000",
  name: "Michael",
  surname: "Corleone",
  password: "1234",
  "2fa": false,
  lang: "fr_fr",
  email: "michael@nodefony.com",
  gender: "male",
  roles: ["ROLE_ADMIN", "ROLE_USER"]
}, {
  username: "2000",
  name: "Vito",
  surname: "Corleone",
  password: "1234",
  "2fa": false,
  lang: "fr_fr",
  email: "vito@nodefony.com",
  gender: "male",
  roles: ["ROLE_USER"]
}, {
  username: "3000",
  name: "Connie",
  surname: "Corleone",
  password: "1234",
  "2fa": false,
  email: "connie@nodefony.com",
  gender: "female",
  lang: "fr_fr",
  roles: ["ROLE_USER"]
}];

class randomFixture {
  constructor() {
    this.matrice = {
      username: "",
      name: "",
      surname: "",
      password: "1234",
      "2fa": false,
      email: "",
      gender: "",
      lang: "",
      roles: ["ROLE_USER"]
    };
  }

  randomUser(nb = 100) {
    let tab = [];
    for (let i = 0; i < nb; i++) {
      let gender = "male";
      let lang = "fr-FR";
      if (i % 2) {
        gender = "female";
        lang = "en_EN";
      }
      tab.push(
        nodefony.extend({}, this.matrice, {
          username: Faker.internet.userName(),
          name: Faker.name.lastName(),
          surname: Faker.name.firstName(),
          email: Faker.internet.email(),
          gender: gender,
          lang: Faker.random.locale(),
          image: Faker.image.avatar(),
          url: Faker.internet.url(),
          roles: [Faker.random.arrayElement(rolesArray)]
        }));
    }
    return tab;
  }

  faker(option) {
    return Faker.fake(option);
  }

  randomFloat(modulo = 0, min = 0, max = 100) {
    if (modulo % 2) {
      return -(Math.random() * (max - min) + min).toFixed(2);
    }
    return (Math.random() * (max - min) + min).toFixed(2);
  }

}

module.exports.default = defaultFixtures;
module.exports.random = randomFixture;
