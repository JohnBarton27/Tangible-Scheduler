'use strict';

(function() {
	// Event requests Controller Spec
	describe('Event requests Controller Tests', function() {
		// Initialize global variables
		var EventRequestsController,
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

			// Initialize the Event requests controller.
			EventRequestsController = $controller('EventRequestsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Event request object fetched from XHR', inject(function(EventRequests) {
			// Create sample Event request using the Event requests service
			var sampleEventRequest = new EventRequests({
				name: 'New Event request'
			});

			// Create a sample Event requests array that includes the new Event request
			var sampleEventRequests = [sampleEventRequest];

			// Set GET response
			$httpBackend.expectGET('event-requests').respond(sampleEventRequests);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.eventRequests).toEqualData(sampleEventRequests);
		}));

		it('$scope.findOne() should create an array with one Event request object fetched from XHR using a eventRequestId URL parameter', inject(function(EventRequests) {
			// Define a sample Event request object
			var sampleEventRequest = new EventRequests({
				name: 'New Event request'
			});

			// Set the URL parameter
			$stateParams.eventRequestId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/event-requests\/([0-9a-fA-F]{24})$/).respond(sampleEventRequest);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.eventRequest).toEqualData(sampleEventRequest);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(EventRequests) {
			// Create a sample Event request object
			var sampleEventRequestPostData = new EventRequests({
				name: 'New Event request'
			});

			// Create a sample Event request response
			var sampleEventRequestResponse = new EventRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Event request'
			});

			// Fixture mock form input values
			scope.name = 'New Event request';

			// Set POST response
			$httpBackend.expectPOST('event-requests', sampleEventRequestPostData).respond(sampleEventRequestResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Event request was created
			expect($location.path()).toBe('/event-requests/' + sampleEventRequestResponse._id);
		}));

		it('$scope.update() should update a valid Event request', inject(function(EventRequests) {
			// Define a sample Event request put data
			var sampleEventRequestPutData = new EventRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Event request'
			});

			// Mock Event request in scope
			scope.eventRequest = sampleEventRequestPutData;

			// Set PUT response
			$httpBackend.expectPUT(/event-requests\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/event-requests/' + sampleEventRequestPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid eventRequestId and remove the Event request from the scope', inject(function(EventRequests) {
			// Create new Event request object
			var sampleEventRequest = new EventRequests({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Event requests array and include the Event request
			scope.eventRequests = [sampleEventRequest];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/event-requests\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEventRequest);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.eventRequests.length).toBe(0);
		}));
	});
}());