'use strict';

(function() {
	// Skill requests Controller Spec
	describe('Skill requests Controller Tests', function() {
		// Initialize global variables
		var SkillRequestsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Skill requests controller.
			SkillRequestsController = $controller('SkillRequestsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Skill request object fetched from XHR', inject(function(SkillRequests) {
			// Create sample Skill request using the Skill requests service
			var sampleSkillRequest = new SkillRequests({
				name: 'New Skill request'
			});

			// Create a sample Skill requests array that includes the new Skill request
			var sampleSkillRequests = [sampleSkillRequest];

			// Set GET response
			$httpBackend.expectGET('skill-requests').respond(sampleSkillRequests);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.skillRequests).toEqualData(sampleSkillRequests);
		}));

		it('$scope.findOne() should create an array with one Skill request object fetched from XHR using a skillRequestId URL parameter', inject(function(SkillRequests) {
			// Define a sample Skill request object
			var sampleSkillRequest = new SkillRequests({
				name: 'New Skill request'
			});

			// Set the URL parameter
			$stateParams.skillRequestId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/skill-requests\/([0-9a-fA-F]{24})$/).respond(sampleSkillRequest);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.skillRequest).toEqualData(sampleSkillRequest);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(SkillRequests) {
			// Create a sample Skill request object
			var sampleSkillRequestPostData = new SkillRequests({
				name: 'New Skill request'
			});

			// Create a sample Skill request response
			var sampleSkillRequestResponse = new SkillRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Skill request'
			});

			// Fixture mock form input values
			scope.name = 'New Skill request';

			// Set POST response
			$httpBackend.expectPOST('skill-requests', sampleSkillRequestPostData).respond(sampleSkillRequestResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Skill request was created
			expect($location.path()).toBe('/skill-requests/' + sampleSkillRequestResponse._id);
		}));

		it('$scope.update() should update a valid Skill request', inject(function(SkillRequests) {
			// Define a sample Skill request put data
			var sampleSkillRequestPutData = new SkillRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Skill request'
			});

			// Mock Skill request in scope
			scope.skillRequest = sampleSkillRequestPutData;

			// Set PUT response
			$httpBackend.expectPUT(/skill-requests\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/skill-requests/' + sampleSkillRequestPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid skillRequestId and remove the Skill request from the scope', inject(function(SkillRequests) {
			// Create new Skill request object
			var sampleSkillRequest = new SkillRequests({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Skill requests array and include the Skill request
			scope.skillRequests = [sampleSkillRequest];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/skill-requests\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSkillRequest);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.skillRequests.length).toBe(0);
		}));
	});
}());