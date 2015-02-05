describe('angularjs sign-up', function() {
  
    var firstName = element(by.model('credentials.firstName'));
    var lastName = element(by.model('credentials.lastName'));
    var email = element(by.id('email'));
    var phone1 = element(by.model('credentials.phone1'));
    var phone2 = element(by.model('credentials.phone2'));
    var phone3 = element(by.model('credentials.phone3'));
    var preferredComm = element(by.model('credentials.phoneProvider'));
    var password = element(by.id('password'));
    var adminCheck = element(by.model('credentials.isAdmin'));
    var signUpButton = element(by.id('sign-up-button'));

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
        phone1.sendKeys('321');
        phone2.sendKeys('848');
        phone3.sendKeys('7537');
        element(by.cssContainingText('option', 'Email')).click();
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
    
    
    it('should allow admins to create the Member skillset', function() {
        skillName.sendKeys('Member');
        
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
    
    it('should allow admins to create the Actor skillset', function() {
        skillName.sendKeys('Actor');
        
        submit.click();
        
        browser.get('http://localhost/#!/skillsets');
        browser.waitForAngular();
        expect(element.all(by.repeater('skillset in skillsets')).count()).toEqual(5);
    });
});


describe('angularjs create-users', function() {
    var firstName = element(by.id('firstName'));
    var lastName = element(by.id('lastName'));
    var email = element(by.id('email'));
    var phone1 = element(by.model('credentials.phone1'));
    var phone2 = element(by.model('credentials.phone2'));
    var phone3 = element(by.model('credentials.phone3'));
    var skills = element(by.model('credentials.skills'));
    var password = element(by.id('password'));
    var preferredComm = element(by.model('credentials.phoneProvider'));
    var createUserButton = element(by.id('create-user-button'));
    var adminCheck = element(by.model('credentials.isAdmin'));
    
    beforeEach(function() {
        browser.get('http://localhost/#!/createuser');
    });
    
    it('should allow admin to create user (Ben) with skills', function() {
        firstName.sendKeys('Ben');
        lastName.sendKeys('Heuser');
        email.sendKeys('ben@ben.com');
        phone1.sendKeys('321');
        phone2.sendKeys('321');
        phone3.sendKeys('4321');
        password.sendKeys('password');
        adminCheck.click();
        
        element(by.cssContainingText('option', 'Email')).click();
        
        ptor = protractor.getInstance();
        
        element(by.cssContainingText('option', 'Member')).click();
        ptor.actions().keyDown(protractor.Key.SHIFT).perform();
        element(by.cssContainingText('option', 'Director')).click();
        ptor.actions().keyDown(protractor.Key.SHIFT).perform();
        element(by.cssContainingText('option', 'Writer')).click();
        ptor.actions().keyUp(protractor.Key.SHIFT).perform();
        ptor.actions().keyUp(protractor.Key.SHIFT).perform();
        
        createUserButton.click();
        browser.waitForAngular();
        browser.get('http://localhost/#!/roster');
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(2);
    });
    
    it('should allow admin to create user (Michelle) with skills', function() {
        firstName.sendKeys('Michelle');
        lastName.sendKeys('Stone');
        email.sendKeys('michelle@michelle.com');
        phone1.sendKeys('987');
        phone2.sendKeys('654');
        phone3.sendKeys('3210');
        password.sendKeys('password');
        adminCheck.click();
        
        element(by.cssContainingText('option', 'Email')).click();
        
        ptor = protractor.getInstance();
        
        element(by.cssContainingText('option', 'Member')).click();
        ptor.actions().keyDown(protractor.Key.SHIFT).perform();
        element(by.cssContainingText('option', 'Director')).click();
        ptor.actions().keyDown(protractor.Key.SHIFT).perform();
        element(by.cssContainingText('option', 'Actor')).click();
        ptor.actions().keyUp(protractor.Key.SHIFT).perform();
        element(by.cssContainingText('option', 'Editor')).click();
        ptor.actions().keyUp(protractor.Key.SHIFT).perform();
        
        createUserButton.click();
        browser.waitForAngular();
        browser.get('http://localhost/#!/roster');
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(3);
    });
    
    it('should allow admin to create user (Christian) with skills', function() {
        firstName.sendKeys('Christian');
        lastName.sendKeys('Torres');
        email.sendKeys('christian@christian.com');
        phone1.sendKeys('123');
        phone2.sendKeys('456');
        phone3.sendKeys('7890');
        password.sendKeys('password');
        
        element(by.cssContainingText('option', 'Email')).click();
        
        ptor = protractor.getInstance();
        
        element(by.cssContainingText('option', 'Member')).click();
        ptor.actions().keyDown(protractor.Key.SHIFT).perform();
        element(by.cssContainingText('option', 'Actor')).click();
        ptor.actions().keyUp(protractor.Key.SHIFT).perform();
        
        createUserButton.click();
        browser.waitForAngular();
        browser.get('http://localhost/#!/roster');
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(4);
    });
    
    it('should allow admin to create user (Elle) with skills', function() {
        firstName.sendKeys('Elle');
        lastName.sendKeys('Beecher');
        email.sendKeys('elle@elle.com');
        phone1.sendKeys('246');
        phone2.sendKeys('801');
        phone3.sendKeys('3579');
        password.sendKeys('password');
        
        element(by.cssContainingText('option', 'Email')).click();
        
        ptor = protractor.getInstance();
        
        element(by.cssContainingText('option', 'Member')).click();
        ptor.actions().keyDown(protractor.Key.SHIFT).perform();
        
        createUserButton.click();
        browser.waitForAngular();
        browser.get('http://localhost/#!/roster');
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(5);
    });
    
});