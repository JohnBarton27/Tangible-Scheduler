'use strict';

(function() {
	// Skillsets Controller Spec
	describe('Skillsets Controller Tests', function() {
		// Initialize global variables
		var SkillsetsController,
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

			// Initialize the Skillsets controller.
			SkillsetsController = $controller('SkillsetsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Skillset object fetched from XHR', inject(function(Skillsets) {
			// Create sample Skillset using the Skillsets service
			var sampleSkillset = new Skillsets({
				name: 'New Skillset'
			});

			// Create a sample Skillsets array that includes the new Skillset
			var sampleSkillsets = [sampleSkillset];

			// Set GET response
			$httpBackend.expectGET('skillsets').respond(sampleSkillsets);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.skillsets).toEqualData(sampleSkillsets);
		}));

		it('$scope.findOne() should create an array with one Skillset object fetched from XHR using a skillsetId URL parameter', inject(function(Skillsets) {
			// Define a sample Skillset object
			var sampleSkillset = new Skillsets({
				name: 'New Skillset'
			});

			// Set the URL parameter
			$stateParams.skillsetId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/skillsets\/([0-9a-fA-F]{24})$/).respond(sampleSkillset);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.skillset).toEqualData(sampleSkillset);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Skillsets) {
			// Create a sample Skillset object
			var sampleSkillsetPostData = new Skillsets({
				name: 'New Skillset'
			});

			// Create a sample Skillset response
			var sampleSkillsetResponse = new Skillsets({
				_id: '525cf20451979dea2c000001',
				name: 'New Skillset'
			});

			// Fixture mock form input values
			scope.name = 'New Skillset';

			// Set POST response
			$httpBackend.expectPOST('skillsets', sampleSkillsetPostData).respond(sampleSkillsetResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Skillset was created
			expect($location.path()).toBe('/skillsets/' + sampleSkillsetResponse._id);
		}));

		it('$scope.update() should update a valid Skillset', inject(function(Skillsets) {
			// Define a sample Skillset put data
			var sampleSkillsetPutData = new Skillsets({
				_id: '525cf20451979dea2c000001',
				name: 'New Skillset'
			});

			// Mock Skillset in scope
			scope.skillset = sampleSkillsetPutData;

			// Set PUT response
			$httpBackend.expectPUT(/skillsets\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/skillsets/' + sampleSkillsetPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid skillsetId and remove the Skillset from the scope', inject(function(Skillsets) {
			// Create new Skillset object
			var sampleSkillset = new Skillsets({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Skillsets array and include the Skillset
			scope.skillsets = [sampleSkillset];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/skillsets\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSkillset);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.skillsets.length).toBe(0);
		}));
	});
}());