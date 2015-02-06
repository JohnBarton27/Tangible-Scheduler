describe('angularjs sign-up', function() {
  
    var firstName = element(by.model('credentials.firstName'));
    var lastName = element(by.model('credentials.lastName'));
    var email = element(by.id('email'));
    var phone = element(by.id('phone'));
    var password = element(by.id('password'));
    var signUpButton = element(by.id('sign-up-button'));
    var adminCheck = element(by.id('roles'));

    var userMenu = element(by.id("user-menu"));
    var signoutButton = element(by.id("signout"));
    
    beforeEach(function() {
        browser.get('http://localhost/#!/signup');
    });
    
    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Tangible Scheduler - Development Environment');
    });
    
    it('should allow sign-up (admin)', function() {
        firstName.sendKeys('John');
        lastName.sendKeys('Barton');
        email.sendKeys('johnrbarton27@gmail.com');
        phone.sendKeys('321-848-7537');
        password.sendKeys('password');
        
        adminCheck.click();
        
        signUpButton.click();
        browser.waitForAngular();
        browser.get('http://localhost/#!/roster');
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(1);
    });
    
});

describe('angularjs skillsets', function() {
    var skillName = element(by.id('skill'));
    var submit = element(by.id('skillset-submit'));
    
    beforeEach(function() {
        browser.get('http://localhost/#!/skillsets/create');
    });
    
    
    it('should allow admins to create the Actor skillset', function() {
        skillName.sendKeys('Actor');
        
        submit.click();
        
        browser.get('http://localhost/#!/skillsets');
        browser.waitForAngular();
        expect(element.all(by.repeater('skillset in skillsets')).count()).toEqual(1);
    });
    
    it('should allow admins to create the Director skillset', function() {
        skillName.sendKeys('Director');
        
        submit.click();
        
        browser.get('http://localhost/#!/skillsets');
        browser.waitForAngular();
        expect(element.all(by.repeater('skillset in skillsets')).count()).toEqual(2);
    });

    it('should allow admins to create the Editor skillset', function() {
        skillName.sendKeys('Editor');
        
        submit.click();
        
        browser.get('http://localhost/#!/skillsets');
        browser.waitForAngular();
        expect(element.all(by.repeater('skillset in skillsets')).count()).toEqual(3);
    });
    
    it('should allow admins to create the Writer skillset', function() {
        skillName.sendKeys('Writer');
        
        submit.click();
        
        browser.get('http://localhost/#!/skillsets');
        browser.waitForAngular();
        expect(element.all(by.repeater('skillset in skillsets')).count()).toEqual(4);
    });
});

describe('angularjs create-users', function() {
    var firstName = element(by.id('firstName'));
    var lastName = element(by.id('lastName'));
    var email = element(by.id('email'));
    var phone = element(by.id('phone'));
    var skills = element(by.model('credentials.skills'));
    var password = element(by.id('password'));
    var createUserButton = element(by.id('create-user-button'));
    var adminCheck = element(by.model('credentials.isAdmin'));
    
    beforeEach(function() {
        browser.get('http://localhost/#!/createuser');
    });
    
    it('should allow admin to create user (Ben) with skills', function() {
        firstName.sendKeys('Ben');
        lastName.sendKeys('Schwaller');
        email.sendKeys('bschwaller33@ufl.edu');
        phone.sendKeys('321-368-8676');
        password.sendKeys('password');
        
        ptor = protractor.getInstance();
        
        element(by.cssContainingText('option', 'Actor')).click();
        ptor.actions().keyDown(protractor.Key.SHIFT).perform();
        element(by.cssContainingText('option', 'Writer')).click();
        ptor.actions().keyUp(protractor.Key.SHIFT).perform();
        
        
        createUserButton.click();
        browser.waitForAngular();
        browser.get('http://localhost/#!/roster');
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(2);
    });
    
    it('should allow admin to create user (Katie) with skills', function() {
        firstName.sendKeys('Katie');
        lastName.sendKeys('Bonti');
        email.sendKeys('ktbonti3@gmail.com');
        phone.sendKeys('813-943-7577');
        password.sendKeys('password');
        
        ptor = protractor.getInstance();
        
        element(by.cssContainingText('option', 'Actor')).click();
        ptor.actions().keyDown(protractor.Key.SHIFT).perform();
        element(by.cssContainingText('option', 'Director')).click();
        ptor.actions().keyUp(protractor.Key.SHIFT).perform();
        
        
        createUserButton.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/roster');
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(3);
    });
    
    it('should allow admin to create admin (Michelle) with skills', function() {
        firstName.sendKeys('Michelle');
        lastName.sendKeys('Stone');
        email.sendKeys('mms.stone@gmail.com');
        phone.sendKeys('561-512-5094');
        password.sendKeys('password');
        
        ptor = protractor.getInstance();
        
        element(by.cssContainingText('option', 'Actor')).click();
        ptor.actions().keyDown(protractor.Key.SHIFT).perform();
        element(by.cssContainingText('option', 'Director')).click();
        element(by.cssContainingText('option', 'Editor')).click();
        ptor.actions().keyUp(protractor.Key.SHIFT).perform();
        
        adminCheck.click();
        
        createUserButton.click();
        browser.waitForAngular();
        browser.get('http://localhost/#!/roster');
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(4);
    });
});

describe('angularjs create-post', function() {
    var name = element(by.id('name'));
    var content = element(by.id('content'));
    var skills = element(by.id('skill'));
    var submitButton = element(by.id('create-posts-button'));
    
    beforeEach(function() {
        browser.get('http://localhost/#!/posts/create');
    });
    
    it('should be able to create a post', function() {
        name.sendKeys('Welcome to Tangible!');
        content.sendKeys('Welcome to the new Tangible Scheduler! This application will help us manage all the coordination, scheduling, and more for all of our            upcoming film sessions and events. You\'ll be notified by email or text when your help is requested at an upcoming film session!');
    
        submitButton.click();
        browser.waitForAngular();
        browser.get('http://localhost/#!/posts');
        browser.waitForAngular();
        expect(element.all(by.repeater('post in posts')).count()).toEqual(1);
    });
    
    it('should be able to create a second post', function() {
        name.sendKeys('New Sketch Starts Production');
        content.sendKeys('A new sketch - "Third Roommate" - will begin production shortly. If you are interested in joining the team, contact us ASAP!');
    
        submitButton.click();
        browser.waitForAngular();
        browser.get('http://localhost/#!/posts');
        browser.waitForAngular();
        expect(element.all(by.repeater('post in posts')).count()).toEqual(2);
    });
});

describe('angularjs create-project', function() {
    var name = element(by.id('name'));
    var type = element(by.id('type'));
    var description = element(by.id('description'));
    var submitButton = element(by.id('create-project-button'));
    
    beforeEach(function() {
        browser.get('http://localhost/#!/projects/create');
    });
    
    it('should be able to create a project', function() {
        name.sendKeys('Third Roommate');
        type.sendKeys('Sketch');
        description.sendKeys('\'Third Roomate\' is a sketch written for Tangible Productions by Tivoli Silas. Production is currently slated to start in early January 2015. Lead actors: John Barton, Lawson Nuland, and Kylie Widseth.')
    
        submitButton.click();
        browser.waitForAngular();
        browser.get('http://localhost/#!/projects');
        browser.waitForAngular();
        expect(element.all(by.repeater('project in projects')).count()).toEqual(1);
    });
    
    it('should be able to create a second project', function() {
        name.sendKeys('Nuzum Wedding');
        type.sendKeys('Commissioned Project');
        description.sendKeys('Commissioned project to shoot a wedding for the Nuzums. Production crew: John Barton, Michelle Stone, Ben Heuser, and Katie Wallace.')
    
        submitButton.click();
        browser.waitForAngular();
        browser.get('http://localhost/#!/projects');
        browser.waitForAngular();
        expect(element.all(by.repeater('project in projects')).count()).toEqual(2);
    });
});


describe('angularjs create-event', function() {
    var name = element(by.id('name'));
    var description = element(by.id('description'));
    var date = element(by.id('date'));
    //var time
    var location = element(by.id('location'));
    var project = element(by.id('project'));
    var skill = element(by.id('skill'));
    var requsers = element(by.id('requsers'));
    
    var submitButton = element(by.id('create-event-button'));
    
    ptor = protractor.getInstance();
    
    beforeEach(function() {
        browser.get('http://localhost/#!/events/create');
    });
    
    it('should be able to create an event', function() {
        name.sendKeys('Writing Meeting #1');
        description.sendKeys('We\'ll be meeting to begin writing \'Third Roommate\'. This is a mandatory meeting - all writers on the writers\' team must attend.');
        
        /*date.click();
        ptor.actions().sendKeys(protractor.Key.HOME).perform();
        ptor.actions().keyDown(protractor.Key.SHIFT).perform();
        ptor.actions().sendKeys(protractor.Key.END).perform();
        ptor.actions().keyUp(protractor.Key.SHIFT).perform();
        ptor.actions().sendKeys(protractor.Key.DELETE).perform();
        
        date.sendKeys('11/24/2014');*/
        
        location.sendKeys('Murphree Commons Area');
        
        /*project.click();
        project.sendKeys('T');*/
        
        element(by.cssContainingText('option', 'Third Roommate')).click();
        //element(by.cssContainingText('option', 'Writer')).click();
        //element(by.cssContainingText('option', 'John Barton')).click();        
        
        submitButton.click();
        browser.waitForAngular();
        browser.get('http://localhost/#!/events');
        browser.waitForAngular();
        expect(element.all(by.repeater('event in events')).count()).toEqual(1);
    });
});