const assert = require('chai').assert;
// const checkHist = require('../server').checkHist;
// const checkUsername = require('../server').checkUsername;
// const checkPassword = require('../server').checkPassword;
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server');
chai.should();
chai.use(chaiHttp);

checkHistResult = app.checkHist();
checkHist0Result = app.checkHist()[0];
checkHist1Result = app.checkHist()[1];
checkHist2Result = app.checkHist()[2];

checkNameResult = app.user().full_name;
checkStreet1Result = app.user().street1;
checkStreet2Result = app.user().street2;
checkStateResult = app.user().state;
checkCityResult = app.user().city;
checkZipResult = app.user().zip;
server = app.server;

describe('Server',function(){
    describe("GET /profile", () => {
        it("It should render the profile page with an OK status", (done) => {
            chai.request(server)
                .get("/profile")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
    })

    it("It should NOT render the profile page with an OK status", (done) => {
        chai.request(server)
            .get("/notprofile")
            .end((err, response) => {
                response.should.have.status(404);
            done();
            })
    })

    describe("POST /login", () => {
        it("It should authenticate login", (done) => {
          const user = {
            username: "Darwin",
            password: "123",
          };
          chai
            .request(server)
            .post("/login")
            .send(user)
            .end((err, response) => {
              response.should.have.status(200);
              done();
            });
        });
        it("It should not authenticate login", (done) => {
          const user = {
            username: "zz",
            password: "test",
          };
          chai
            .request(server)
            .post("/login")
            .send(user)
            .end((err, response) => {
              response.should.have.status(200);
              done();
            });
        });
      });

      describe("POST /login", () => {
        it("Password DOES exist", (done) => {
          const user = {
            password: "123"
          };
          chai
            .request(server)
            .post("/login")
            .send(user)
            .end((err, response) => {
              response.should.have.status(200);
              done();
            });
        });
        it("Password DOES NOT exist", (done) => {
          const user = {
            password: "1234"
          };
          chai
            .request(server)
            .post("/login")
            .send(user)
            .end((err, response) => {
              response.should.have.status(200);
              done();
            });
        });
      });


    describe("GET /editProfile", () => {
        it("It should render the fuel_quote page with an OK status", (done) => {
            chai.request(server)
                .get("/editProfile")
                .end((err, response) => {
                    response.body.should.be.a('object');
                    response.should.have.status(200);
                done();
                })
        })
    })
    
    describe("POST /editProfile", () => {
        it("It POST the user credentials to the server", (done) => {
            const user = {
                full_name: 'Darwin Morales', 
                street1: '24 Black Mamba Hwy', 
                street2: 'Ste 8',
                state: 'CA',
                city: 'Los Angeles', 
                zip: '12345'
            }
            chai.request(server)
                .post("/editProfile")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                done();
                })
        })
    })

    describe("GET /fuel_quote", () => {
        it("It should render the fuel_quote page with an OK status", (done) => {
            chai.request(server)
                .get("/fuel_quote")
                .end((err, response) => {
                    response.body.should.be.a('object');
                    response.should.have.status(200);
                done();
                })
        })
    })

    describe("POST /fuel_quote", () => {
        it("It should POST the fuel quote values to the server OK status", (done) => {
            chai.request(server)
                .post("/fuel_quote")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a('object');
                done();
                })
        })
    })

    describe("GET /", () => {
        it("Should get the home page with 200 status", (done) => {
            chai.request(server)
                .get("/")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
    })

    describe("GET /login", () => {
        it("Should get the login page with 200 status", (done) => {
            chai.request(server)
                .get("/login")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
    })

    describe("GET /register", () => {
        it("Should get the login page with 200 status", (done) => {
            chai.request(server)
                .get("/register")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
    })

    describe("GET /history", () => {
        it("Should get the login page with 200 status", (done) => {
            chai.request(server)
                .get("/history")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
    })

    describe("GET /api/history", () => {
        it("Should get the login page with 200 status", (done) => {
            chai.request(server)
                .get("/api/history")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
    })

    describe("POST /register", () => {
        it("Should Post registeration info with 200 status", (done) => {
            chai.request(server)
                .post("/register")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
    })

    describe("POST /login", () => {
        it("Should process the login credentials with 200 status", (done) => {
            chai.request(server)
                .post("/login")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
    })

    describe("/logout to delete ", () => {
        it("Should get the login page with 200 status", (done) => {
            chai.request(server)
                .delete("/logout")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
    })

    it('should return an object', () => {
        let obj = new app.fuel_quote();
        assert.ok(obj);
    })

    it('should return an object', () => {
        assert.ok(app.checkAuth);
    })

    //check Name
    it('checkName should return Darwin Morales', function(){
        assert.notEqual(checkNameResult, 'Morales');
    })

    it('checkName should return type string', function(){
        assert.typeOf(checkNameResult, 'string');
    })

     //check Address
     it('checkStreet1 should return 24 Black Mamba Hwy', function(){
        assert.notEqual(checkStreet1Result, 'Mamba');
    })

    it('checkStreet1 should return type string', function(){
        assert.typeOf(checkStreet1Result, 'string');
    })

    it('checkHist should return type array', function(){
        assert.typeOf(checkHistResult, 'array');
    })
    
    it('checkStreet2 should return N/A', function(){
        assert.equal(checkStreet2Result, 'N/A');
    })

    it('checkStreet2 should return type string', function(){
        assert.typeOf(checkStreet2Result, 'string');
    })

      // check State
      it('checkState should return TX', function(){
        assert.notEqual(checkStateResult, 'TX');
    })

    it('checkState should return type string', function(){
        assert.typeOf(checkStateResult, 'string');
    })

     //check city
     it('checkCity should return Katy', function(){
        assert.notEqual(checkCityResult, 'Katy');
    })

    it('checkCity should return type string', function(){
        assert.typeOf(checkCityResult, 'string');
    })

     //check ZIP
     it('checkZip should return 77654', function(){
        assert.notEqual(checkZipResult, '77654');
    })

    it('checkZip should return type string', function(){
        assert.typeOf(checkZipResult, 'string');
    })

});
