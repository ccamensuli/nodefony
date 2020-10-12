/*
 *   MODEFONY FRAMEWORK UNIT TEST
 *
 *   MOCHA STYLE
 *
 *   In the global context you can find :
 *
 *	nodefony : namespace to get library
 *	kernel :   instance of kernel who launch the test
 *
 */
const assert = require('assert');

describe("BUNDLE users", () => {

  before(() => {
    //for example
    assert.equal(typeof nodefony, "object");
    assert.equal(typeof kernel, "object");
    // check instance kernel
    assert.equal(kernel instanceof nodefony.kernel, true);
    // requests tools
    const Request = kernel.get("requestClient");
    const serviceHttps = kernel.get("httpsServer");
    const openssl = serviceHttps.getCertificats();
    // cookies container
    global.jar = Request.engine.jar();
    const requestOptions = {
      method: 'GET',
      timeout: 1500,
      "User-Agent": `${nodefony.projectName}@${nodefony.projectVersion}`,
      jar: global.jar,
      headers: [{
        name: 'Accept',
        value: 'application/json'
			}],
      agentOptions: {
        key: openssl.key,
        cert: openssl.cert,
        ca: openssl.ca,
      }
    };
    global.baseUrl = `https://${kernel.settings.system.domain}:${kernel.settings.system.httpsPort}/api/jwt`;
    const request = Request.create(global.baseUrl, requestOptions);
    global.http = request.http.bind(request);

  });

  describe('API LOGIN', () => {
    beforeEach(() => {});
    before(() => {});
    it("LOGIN JWT", async () => {
      const result = await global.http("/login", {
          method: 'POST',
          form: {
            username: 'admin',
            passwd: 'admin'
          }
        })
        .catch(e => {
          throw e;
        });
      assert.strictEqual(result.json.statusCode, 200);
      const body = JSON.parse(result.json.body);
      assert(body.result);
      assert(body.result.token);
      global.token = body.result.token;
      assert(body.result.refreshToken);
      global.refreshToken = body.result.refreshToken;
      assert(body.result.decodedToken.data);
      assert.strictEqual(body.result.decodedToken.data.authenticated, true);
      assert(body.result.decodedToken.iat);
      assert(body.result.decodedToken.exp);
      assert.strictEqual(body.api, "login-api");
      assert.strictEqual(body.code, 200);
      assert.strictEqual(body.message, 'OK');
      assert.strictEqual(body.messageId, null);
      //assert.strictEqual(body.error, undefined);
      //assert.strictEqual(body.errorCode, undefined);
      assert.strictEqual(body.url, `${global.baseUrl}/login`);
      assert.strictEqual(body.method, 'POST');
      assert.strictEqual(body.scheme, 'https');
      assert.strictEqual(body.severity, 'INFO');
      assert.strictEqual(body.code, 200);
    });

    it("BAD PASSWD LOGIN  JWT ", async () => {
      const result = await global.http("/login", {
          method: 'POST',
          form: {
            username: 'admin',
            passwd: 'testfalse'
          }
        })
        .catch(e => {
          throw e;
        });
      assert.strictEqual(result.json.statusCode, 401);
      //const body = JSON.parse(result.json.body);
    });
    it("BAD NAME LOGIN JWT ", async () => {
      const result = await global.http("/login", {
          method: 'POST',
          form: {
            username: 'badname',
            passwd: 'admin'
          }
        })
        .catch(e => {
          throw e;
        });
      assert.strictEqual(result.json.statusCode, 404);
      const body = JSON.parse(result.json.body);
      assert.strictEqual(body.message, "User : badname not Found");
    });

    it("BAD LOGIN NO credentials ", async () => {
      const result = await global.http("/login", {
          method: 'POST',
          form: {}
        })
        .catch(e => {
          throw e;
        });
      assert.strictEqual(result.json.statusCode, 400);
      const body = JSON.parse(result.json.body);
      assert.strictEqual(body.message, "Missing credentials");
    });

  });

});
