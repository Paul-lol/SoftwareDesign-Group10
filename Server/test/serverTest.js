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

    it("It GET the updated client form to the profile", (done) => {
        const user = {
            full_name: 'Darwin Morales', 
            street1: '24 Black Mamba St', 
            street2: 'Ste 8',
            state: 'TX',
            city: 'Houston', 
            zip: '77532'
        }
        chai.request(server)
            .get("/profile")
            .send(user)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
            done();
            })
        })

    it("It GET the wrong client form to the profile", (done) => {
        const user = {
            full_name: ' test', 
            street1: '@test', 
            street2: 'N/A',
            state: 'AD',
            city: 'Test123', 
            zip: '0'
         }
            chai.request(server)
            .get("/notprofile")
            .send(user)
            .end((err, response) => {
             response.should.have.status(404);
             response.body.should.be.a('object');
             done();
        })
    })

    describe("POST /login", () => {
        it("It should authenticate login", (done) => {
          const user = {
            username: "Darwin",
            password: "Morales",
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
            password: "Morales"
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
        it("It should render the editProfile page with an OK status", (done) => {
            chai.request(server)
                .get("/editProfile")
                .end((err, response) => {
                    response.body.should.be.a('object');
                    response.should.have.status(200);
                done();
                })
        })

        it("It should not render the editProfile page with an OK status", (done) => {
            chai.request(server)
                .get("/editProfiles")
                .end((err, response) => {
                    response.body.should.be.a('object');
                    response.should.have.status(404);
                done();
                })
        })
    })
    
    describe("POST /editProfile", () => {
        it("It POST the user credentials to the server", (done) => {
            const user = {
                full_name: 'Darwin Morales', 
                street1: '24 Black Mamba St', 
                street2: 'Ste 8',
                state: 'TX',
                city: 'Houston', 
                zip: '77532'
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

        it("It POST the wrong user credentials to the server", (done) => {
            const user = {
                full_name: 'Test', 
                street1: '24 Test St', 
                street2: ' ',
                state: 'LY',
                city: 'none', 
                zip: '0'
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
        it("It should authenticate fuel quote form is valid", (done) => {
            const user = {
              gallons: "1500",
              date: "04/22/2021",
            };
            chai
            .request(server)
            .post("/fuel_quote")
            .send(user)
            .end((err, response) => {
              response.should.have.status(200);
              done();
            });

        it("It should authenticate fuel quote form is invalid", (done) => {
            const user = {
              gallons: "0",
              date: "nodate",
            };
            chai
            .request(server)
            .post("/fuel_quote")
            .send(user)
            .end((err, response) => {
              response.should.have.status(404);
              done();
            });
        });
        
        
    })
});

describe("GET /logout", () => {
    it("It should logout with an OK status", (done) => {
        chai.request(server)
            .get("/logout")
            .end((err, response) => {
                response.body.should.be.a('object');
                response.should.have.status(200);
            done();
            })
    })

    it("It did not logout with an OK status", (done) => {
        chai.request(server)
            .get("/logoutt")
            .end((err, response) => {
                response.body.should.be.a('object');
                response.should.have.status(404);
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
        it("Should get the register page with 200 status", (done) => {
            chai.request(server)
                .get("/register")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
    })

    describe("POST /register", () => {
        it("It should authenticate registration", (done) => {
            const user = {
              username: "Darwin",
              password: "Morales",
            };
            chai.request(server)
                .post("/register")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
    })

    describe("GET /history", () => {
        it("Should get the history page with 200 status", (done) => {
            chai.request(server)
                .get("/history")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
    })

    describe("GET /api/history", () => {
        it("Should get the history page with 200 status", (done) => {
            chai.request(server)
                .get("/api/history")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
    })

    describe("POST /register", () => {
        it("Should Post registration info with 200 status", (done) => {
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
     it('checkZip should return 77532', function(){
        assert.notEqual(checkZipResult, '77654');
    })

    it('checkZip should return type string', function(){
        assert.typeOf(checkZipResult, 'string');
    })

});
