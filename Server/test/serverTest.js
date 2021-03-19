const assert = require('chai').assert;
// const checkHist = require('../server').checkHist;
// const checkUsername = require('../server').checkUsername;
// const checkPassword = require('../server').checkPassword;
const app = require('../server');

checkHistResult = app.checkHist();
checkHist0Result = app.checkHist0();
checkHist1Result = app.checkHist1();
checkHist2Result = app.checkHist2();

checkNameResult = app.checkName();
checkStreet1Result = app.checkStreet1();
checkStreet2Result = app.checkStreet2();
checkStateResult = app.checkState();
checkCityResult = app.checkCity();
checkZipResult = app.checkZip();

describe('Server',function(){
    it('checkHist should return type array', function(){
        assert.typeOf(checkHistResult, 'array');
    })

    it('checkHist[0] should return type object', function(){
        assert.typeOf(checkHist0Result, 'object');
    })
    it('checkHist[1] should return type object', function(){
        assert.typeOf(checkHist1Result, 'object');
    })
    it('checkHist[2] should return type object', function(){
        assert.typeOf(checkHist2Result, 'object');
    })

    // History - gallons requested
    it('checkHist[0].gallons should return 101', function(){
        assert.equal(checkHist0Result.gallons, 101);
    })
    it('checkHist[1].gallons should return 135', function(){
        assert.equal(checkHist1Result.gallons, 135);
    })
    it('checkHist[2].gallons should return 276', function(){
        assert.equal(checkHist2Result.gallons, 276);
    })

    it('checkHist[0].gallons should return number', function(){
        assert.isNumber(checkHist0Result.gallons);
    })
    it('checkHist[1].gallons should return number', function(){
        assert.isNumber(checkHist1Result.gallons);
    })
    it('checkHist[2].gallons should return number', function(){
        assert.isNumber(checkHist2Result.gallons);
    })


    // History - Delivery Address
    it('checkHist[0].d_address should return string', function(){
        assert.typeOf(checkHist0Result.d_address, 'string');
    })
    it('checkHist[1].d_address should return string', function(){
        assert.typeOf(checkHist1Result.d_address, 'string');
    })
    it('checkHist[2].d_address should return string', function(){
        assert.typeOf(checkHist2Result.d_address, 'string');
    })

    it('checkHist[0].d_address should return 4800 Calhoun Rd, Houston, TX 77204-2610', function(){
        assert.equal(checkHist0Result.d_address, '4800 Calhoun Rd, Houston, TX 77204-2610');
    })
    it('checkHist[1].d_address should return 6060 N Fry Rd, Katy, TX 77449', function(){
        assert.equal(checkHist1Result.d_address, '6060 N Fry Rd, Katy, TX 77449');
    })
    it('checkHist[2].d_address should return 1234 Dummy Values, Houston, TX 77123', function(){
        assert.equal(checkHist2Result.d_address, '1234 Dummy Values, Houston, TX 77123');
    })

    // History - Deiivery Date
    it('checkHist[0].d_date should return string', function(){
        assert.typeOf(checkHist0Result.d_date, 'string');
    })
    it('checkHist[1].d_date should return string', function(){
        assert.typeOf(checkHist1Result.d_date, 'string');
    })
    it('checkHist[2].d_date should return string', function(){
        assert.typeOf(checkHist2Result.d_date, 'string');
    })

    it('checkHist[0].d_date should return string with length == 10 (YYYY-MM-DD)', function(){
        assert.lengthOf(checkHist0Result.d_date, 10);
    })
    it('checkHist[1].d_date should return string with length == 10 (YYYY-MM-DD)', function(){
        assert.lengthOf(checkHist1Result.d_date, 10);
    })
    it('checkHist[2].d_date should return string with length == 10 (YYYY-MM-DD)', function(){
        assert.lengthOf(checkHist2Result.d_date, 10);
    })

    // History - Price per gallon
    it('checkHist[0].price_per should return number', function(){
        assert.isNumber(checkHist0Result.price_per);
    })
    it('checkHist[1].price_per should return number', function(){
        assert.isNumber(checkHist1Result.price_per);
    })
    it('checkHist[2].price_per should return number', function(){
        assert.isNumber(checkHist2Result.price_per);
    })

    it('checkHist[0].price_per should return 2.19', function(){
        assert.equal(checkHist0Result.price_per, 2.19);
    })
    it('checkHist[1].price_per should return 2.35', function(){
        assert.equal(checkHist1Result.price_per, 2.35);
    })
    it('checkHist[2].price_per should return 2.40', function(){
        assert.equal(checkHist2Result.price_per, 2.40);
    })

    // History - Total
    it('checkHist[0].total should return number', function(){
        assert.isNumber(checkHist0Result.total);
    })
    it('checkHist[1].total should return number', function(){
        assert.isNumber(checkHist1Result.total);
    })
    it('checkHist[2].total should return number', function(){
        assert.isNumber(checkHist2Result.total);
    })

    it('checkHist[0].total should return 221.19', function(){
        assert.equal(checkHist0Result.total, 221.19);
    })
    it('checkHist[1].total should return 317.25', function(){
        assert.equal(checkHist1Result.total, 317.25);
    })
    it('checkHist[2].total should return 662.40', function(){
        assert.equal(checkHist2Result.total, 662.40);
    })

    //check Username
    // it('checkUsername should return type string', function(){
    //     let result = app.checkUsername();
    //     assert.typeOf(result, 'string');
    // })

    // it('checkUsername should have length > 0', function(){
    //     let result = app.checkUsername();
    //     assert.lengthOf(result, 3);
    // })

    // it('checkPassword should return type string', function(){
    //     let result = app.checkPassword();
    //     assert.typeOf(result, 'array');
    // })

    //check Name
    it('checkName should return Raj Singh', function(){
        assert.equal(checkNameResult, 'Raj Singh');
    })

    it('checkName should return type string', function(){
        assert.typeOf(checkNameResult, 'string');
    })

    it('checkName should return length > 0', function(){
        assert.isNotEmpty(checkNameResult);
    })

    //check Address
    it('checkStreet1 should return 22400 Grand Cir Blvd Suite 206', function(){
        assert.equal(checkStreet1Result, '22400 Grand Cir Blvd Suite 206');
    })

    it('checkStreet1 should return type string', function(){
        assert.typeOf(checkStreet1Result, 'string');
    })

    it('checkStreet1 should return length > 0', function(){
        assert.isNotEmpty(checkStreet1Result);
    })

    it('checkStreet2 should return N/A', function(){
        assert.equal(checkStreet2Result, 'N/A');
    })

    it('checkStreet2 should return type string', function(){
        assert.typeOf(checkStreet2Result, 'string');
    })

    it('checkStreet2 should return length > 0', function(){
        assert.isNotEmpty(checkStreet2Result);
    })

    // check State
    it('checkState should return TX', function(){
        assert.equal(checkStateResult, 'TX');
    })

    it('checkState should return type string', function(){
        assert.typeOf(checkStateResult, 'string');
    })

    it('checkState should return length == 2', function(){
        assert.lengthOf(checkStateResult, 2);
    })

    it('checkState should return length > 0', function(){
        assert.isNotEmpty(checkStateResult);
    })

    //check city
    it('checkCity should return Katy', function(){
        assert.equal(checkCityResult, 'Katy');
    })

    it('checkCity should return type string', function(){
        assert.typeOf(checkCityResult, 'string');
    })

    it('checkCity should return length > 0', function(){
        assert.isNotEmpty(checkCityResult);
    })

    //check ZIP
    it('checkZip should return 77082', function(){
        assert.equal(checkZipResult, '77082');
    })

    it('checkZip should return type string', function(){
        assert.typeOf(checkZipResult, 'string');
    })

    it('checkZip should return length > 0', function(){
        assert.isNotEmpty(checkZipResult);
    })

    it('checkState should return length == 5', function(){
        assert.lengthOf(checkZipResult, 5);
    })

    
    // let userInfo = {
    //     full_name: 'Raj Singh', 
    //     street1: '22400 Grand Cir Blvd Suite 206', 
    //     street2: 'N/A',
    //     state: 'TX',
    //     city: 'Katy', 
    //     zip: '77082'
    // };
});
