var utils = require('./init');
var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var CrowdTangleContentService = require('../../lib/fetching/content-services/crowd-tangle-content-service');
var ContentService = require('../../lib/fetching/content-service');
var contentServiceFactory = require('../../lib/fetching/content-service-factory');

// Stubs the _httpRequest method of the content service to return the data in the given fixture file.
// If service is null, creates an ElmoContentService
function stubWithFixture(fixtureFile, service) {
  // Create service if not provided.
  service = service || new CrowdTangleContentService({});

  // Make the stub function return the expected args (err, res, body).
  fixtureFile = path.join('test', 'backend', 'fixtures', fixtureFile);
  service._httpRequest = function(params, callback) {
    callback(null, { statusCode: 200 }, fs.readFileSync(fixtureFile).toString());
  };

  return service;
}

describe('CrowdTangle content service', function() {

  it('factory should instantiate correct CrowdTangle content service', function() {
    var service = new CrowdTangleContentService({});
    expect(service).to.be.instanceOf(ContentService);
    expect(service).to.be.instanceOf(CrowdTangleContentService);
  });

  it('should fetch empty content', function(done) {
    var service = stubWithFixture('ct-0.json');
    utils.expectToNotEmitReport(service, done);
    expect(service._lastReportDate).to.be.undefined;
    service.once('error', function(err) {
      done(err);
    });
    setTimeout(done, 500);
  });


  // TODO 1
  // it('should fetch mock content from CrowdTangle', function(done) {
  //   var service = stubWithFixture('elmo-1.json');

  //   service.once('error', function(err) { done(err); });

  //   var fetched = 0;
  //   service.on('report', function(reportData) {
  //     expect(reportData).to.have.property('fetchedAt');
  //     expect(reportData).to.have.property('authoredAt');
  //     expect(reportData).to.have.property('content');
  //     expect(reportData).to.have.property('author');
  //     expect(reportData).to.have.property('metadata');
  //     switch (++fetched) {
  //     case 1:
  //       expect(reportData.content).to.contain('[FOO: Certainly] [BAR: Nope] [BAZ: Perhaps]');
  //       expect(reportData.author).to.equal('Sue');
  //       break;
  //     case 2:
  //       expect(reportData.content).to.contain('[FOO2: Yes] [BAR2: No] [BAZ2: Maybe]');
  //       expect(reportData.author).to.equal('Joe');
  //       expect(service._lastReportDate.getTime()).to.equal((new Date('2014-06-17T11:00:00Z')).getTime());
  //       break;
  //     case 3:
  //       return done(new Error('Unexpected report'));
  //     }
  //   });

  //   // Give enough time for extra report to appear.
  //   setTimeout(function() { if (fetched == 2) done(); }, 100);

  //   // Run fetch
  //   service.fetch({ maxCount: 50 }, function() {});
  });

  describe('errors', function() {


    // TODO 2
    // it('should emit a missing parameter error', function(done) {
    //   var service = new ELMOContentService({});
    //   utils.expectToNotEmitReport(service, done);
    //   utils.expectToEmitError(service, 'Missing ELMO URL', done);
    //   service.fetch({ maxCount: 50 }, function() {});
    // });


    // test for bad data
    it('should emit json parse error', function(done) {
      var service = stubWithFixture('ct-03.json');
      utils.expectToNotEmitReport(service, done);
      utils.expectToEmitError(service, 'Parse error: Unexpected end of input', done);
      service.fetch({ maxCount: 50 }, function() {});
    });
  });

  after(utils.expectModelsEmpty);
});
