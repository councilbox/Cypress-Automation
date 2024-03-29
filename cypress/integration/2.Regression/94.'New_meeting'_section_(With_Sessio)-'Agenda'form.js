const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");

beforeEach(function() {
    cy.restoreLocalStorage();
});

afterEach(function() {
    cy.saveLocalStorage();
});

before(function() {
    cy.clearLocalStorage();
    cy.saveLocalStorage();
});


function userID_Alpha() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }


describe("Councilbox login - valid username and password", function() {

     before(function() {
        
    });


    it("Visits the Councilbox web page", function() {
        cy.visit(login_url);
    });

    it("Enters email address", function() {
        cy.get('input').eq(0)
            .type('alem@qaengineers.net')    
            .should("have.value", 'alem@qaengineers.net')
    });

    it("Enters password", function() {
        cy.get('input').eq(1)
            .type('Mostar123!test')    
            .should("have.value", 'Mostar123!test')
    });

    it("Clicks login button", function() {
        cy.get("#login-button").click();
        
    });

});





describe("The user is not able to add 'New item yes/no/abstention' without populating the 'Title' field to the 'Add item to the agenda' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
        cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000) 
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields expect 'Title' field and click on the 'OK' CTA", function() {
        cy.get('#alert-confirm-button-accept').click()        
    });

    it("'Required field' alert message is displayed beyond the Title field", function() {
        cy.get('#agenda-editor-title-input-error-text').should('be.visible')     
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });





});

describe("The user is not able to add Custom item without populating the 'Title' field to the 'Add item to the agenda' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
        cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
        cy.wait(2000)
          
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Custom item' CTA", function() {
        cy.get('#puntoPersonalizado').click()        
    });

    it("Populate all required fields expect 'Title' field and click on the 'OK' CTA", function() {
        cy.get('#custom-point-added-option-0').type('Test')
        cy.get('#alert-confirm-button-accept').click()
    });

    it("'Required field' alert message is displayed beyond the Title field", function() {
        cy.get('#agenda-custom-point-title-error-text').should('be.visible')     
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});


describe("The user is not able to add Custom item with invalid input in the 'Value' field to the 'Add item to the agenda' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
        cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Custom item' CTA", function() {
        cy.get('#puntoPersonalizado').click()        
    });

    it("Populate all required fields expect 'Value' field and click on the 'OK' CTA", function() {
        cy.get('#agenda-custom-point-title').type('Test')
        cy.get('#alert-confirm-button-accept').click()
    });

    it("'Required field' alert message is displayed beyond the 'Value' field", function() {
        cy.get('#custom-point-added-option-0-error-text').should('be.visible')     
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to reorder agenda points in the 'Agenda' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
        cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
         cy.wait(2000) 
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Yes/No agenda')
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(2000)
    })

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Custom item' CTA", function() {
        cy.get('#puntoPersonalizado').click()        
    });

    it("Populate all required fields and click on the 'OK' CTA", function() {
        cy.get('#agenda-custom-point-title').type('Custom Agenda')
        cy.get('#custom-point-added-option-0').type('Value')
        cy.get('#alert-confirm-button-accept').click()
    });

    it("Click on the 'Reorder agenda items' button", function() {
        cy.get('#agenda-step-reorder-button').click()   
    });

    it("Reorder agenda items and click on the 'Save' button", function () {
        cy.get('#agenda-step-sort-list-0').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to add 'Informative' type of the Yes/no item to the 'New item yes/no/abstention' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')

            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)  
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});

describe("The user is able to edit 'Informative' type of the Yes/no item to the 'New item yes/no/abstention' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)   
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'Type' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the already added type of meeting and modify it with changes you want then click on the 'OK' button", function() {
        cy.get('#agenda-step-item-1').click()
        cy.get('#agenda-editor-title-input').clear().type('Edit Informative Agenda')
        cy.get('#alert-confirm-button-accept').click()
    })

    it("Item is successfully edited", function() {
        cy.contains('Edit Informative Agenda').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to remove 'Informative' type of the Item Yes/no Abstention to the 'Add item to the agenda' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)   
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Navigate to the already added item and click on the 'X' button to remove it then click on the 'Delete' button", function() {
        cy.get('#agenda-step-delete-item-1').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("Item is successfully removed", function() {
        cy.get('#agenda-step-item-1').should('not.exist')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

























describe("The user is able to add 'Roll-call vote' type of the Yes/no item to the 'New item yes/no/abstention' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)   
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Roll-call vote' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Roll-call vote Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-1').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Roll-call vote' type of item is successfully added", function () {
        cy.contains('Roll-call vote Agenda').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});


describe("The user is able to edit 'Roll-call vote' type of the Yes/no item to the 'New item yes/no/abstention' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)   
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Roll-call vote' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Roll-call vote Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-1').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Roll-call vote' type of item is successfully added", function () {
        cy.contains('Roll-call vote Agenda').should('be.visible')
    })

    it("Click on the already added type of meeting and modify it with changes you want then click on the 'OK' button", function() {
        cy.get('#agenda-step-item-1').click()
        cy.get('#agenda-editor-title-input').clear().type('Edit Roll-call vote Agenda')
        cy.get('#alert-confirm-button-accept').click()
    })

    it("Item is successfully edited", function() {
        cy.contains('Edit Roll-call vote Agenda').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to remove 'Roll-call vote' type of the Item Yes/no Abstention to the 'Add item to the agenda' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)   
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Roll-call vote' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Roll-call vote Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-1').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Roll-call vote' type of item is successfully added", function () {
        cy.contains('Roll-call vote Agenda').should('be.visible')
    })

    it("Navigate to the already added item and click on the 'X' button to remove it then click on the 'Delete' button", function() {
        cy.get('#agenda-step-delete-item-1').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("Item is successfully removed", function() {
        cy.get('#agenda-step-item-1').should('not.exist')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

























describe("The user is able to add 'Public voting' type of the Yes/no item to the 'New item yes/no/abstention' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)  
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Public voting' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Public voting Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-3').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Public voting' type of item is successfully added", function () {
        cy.contains('Public voting Agenda').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});


describe("The user is able to edit 'Public voting' type of the Yes/no item to the 'New item yes/no/abstention' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)   
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Public voting' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Public voting Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-3').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Public voting' type of item is successfully added", function () {
        cy.contains('Public voting Agenda').should('be.visible')
    })

    it("Click on the already added type of meeting and modify it with changes you want then click on the 'OK' button", function() {
        cy.get('#agenda-step-item-1').click()
        cy.get('#agenda-editor-title-input').clear().type('Edit Public voting Agenda')
        cy.get('#alert-confirm-button-accept').click()
    })

    it("Item is successfully edited", function() {
        cy.contains('Edit Public voting Agenda').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to remove 'Public voting' type of the Item Yes/no Abstention to the 'Add item to the agenda' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)   
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Public voting' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Public voting Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-3').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Public voting' type of item is successfully added", function () {
        cy.contains('Public voting Agenda').should('be.visible')
    })

    it("Navigate to the already added item and click on the 'X' button to remove it then click on the 'Delete' button", function() {
        cy.get('#agenda-step-delete-item-1').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("Item is successfully removed", function() {
        cy.get('#agenda-step-item-1').should('not.exist')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});






































describe("The user is able to add 'Anonymous votation' type of the Yes/no item to the 'New item yes/no/abstention' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)   
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Anonymous votation' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Anonymous votation Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-5').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Anonymous votation' type of item is successfully added", function () {
        cy.contains('Anonymous votation Agenda').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});


describe("The user is able to edit 'Anonymous votation' type of the Yes/no item to the 'New item yes/no/abstention' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)  
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Anonymous votation' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Anonymous votation Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-5').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Anonymous votation' type of item is successfully added", function () {
        cy.contains('Anonymous votation Agenda').should('be.visible')
    })

    it("Click on the already added type of meeting and modify it with changes you want then click on the 'OK' button", function() {
        cy.get('#agenda-step-item-1').click()
        cy.get('#agenda-editor-title-input').clear().type('Edit Anonymous votation Agenda')
        cy.get('#alert-confirm-button-accept').click()
    })

    it("Item is successfully edited", function() {
        cy.contains('Edit Anonymous votation Agenda').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to remove 'Anonymous votation' type of the Item Yes/no Abstention to the 'Add item to the agenda' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)   
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Anonymous votation' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Anonymous votation Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-5').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Anonymous votation' type of item is successfully added", function () {
        cy.contains('Anonymous votation Agenda').should('be.visible')
    })

    it("Navigate to the already added item and click on the 'X' button to remove it then click on the 'Delete' button", function() {
        cy.get('#agenda-step-delete-item-1').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("Item is successfully removed", function() {
        cy.get('#agenda-step-item-1').should('not.exist')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});































describe("The user is able to add 'Roll-call vote' type of the Custom item to the 'New item yes/no/abstention' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)   
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Custom item' CTA", function() {
        cy.get('#puntoPersonalizado').click()        
    });

    it("Populate all required fields and navigate to the 'Type' field and select the 'Roll-call vote' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-custom-point-title').type('Roll-call vote Custom Agenda')
        cy.get('#agenda-custom-point-type-dropdown').click()
        cy.get('#agenda-custom-point-type-0').click()
        cy.get('#custom-point-added-option-0').type('Value')
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Roll-call vote' type of item is successfully added", function () {
        cy.contains('Roll-call vote Custom Agenda').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});


describe("The user is able to edit 'Roll-call vote' type of the Custom item to the 'New item yes/no/abstention' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)   
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Custom item' CTA", function() {
        cy.get('#puntoPersonalizado').click()        
    });

    it("Populate all required fields and navigate to the 'Type' field and select the 'Roll-call vote' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-custom-point-title').type('Roll-call vote Custom Agenda')
        cy.get('#agenda-custom-point-type-dropdown').click()
        cy.get('#agenda-custom-point-type-0').click()
        cy.get('#custom-point-added-option-0').type('Value')
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Roll-call vote' type of item is successfully added", function () {
        cy.contains('Roll-call vote Custom Agenda').should('be.visible')
    })

    it("Click on the already added item and modify it with changes you want then click on the 'OK' button", function() {
        cy.get('#agenda-step-item-1').click()
        cy.get('#agenda-custom-point-title').clear().type('Edit Roll-call vote Custom Agenda')
        cy.get('#alert-confirm-button-accept').click()
    })

    it("Item is successfully edited", function() {
        cy.contains('Edit Roll-call vote Custom Agenda').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to remove 'Roll-call vote' type of the Custom item to the 'Add item to the agenda' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)   
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Custom item' CTA", function() {
        cy.get('#puntoPersonalizado').click()        
    });

    it("Populate all required fields and navigate to the 'Type' field and select the 'Roll-call vote' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-custom-point-title').type('Roll-call vote Custom Agenda')
        cy.get('#agenda-custom-point-type-dropdown').click()
        cy.get('#agenda-custom-point-type-0').click()
        cy.get('#custom-point-added-option-0').type('Value')
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Roll-call vote' type of item is successfully added", function () {
        cy.contains('Roll-call vote Custom Agenda').should('be.visible')
    })


    it("Navigate to the already added item and click on the 'X' button to remove it then click on the 'Delete' button", function() {
        cy.get('#agenda-step-delete-item-1').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("Item is successfully removed", function() {
        cy.get('#agenda-step-item-1').should('not.exist')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});





















describe("The user is able to add 'Anonymous votation' type of the Custom item to the 'New item yes/no/abstention' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)  
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Custom item' CTA", function() {
        cy.get('#puntoPersonalizado').click()        
    });

    it("Populate all required fields and navigate to the 'Type' field and select the 'Anonymous votation' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-custom-point-title').type('Roll-call vote Custom Agenda')
        cy.get('#agenda-custom-point-type-dropdown').click()
        cy.get('#agenda-custom-point-type-1').click()
        cy.get('#custom-point-added-option-0').type('Value')
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Anonymous votation' type of item is successfully added", function () {
        cy.contains('Roll-call vote Custom Agenda').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});


describe("The user is able to edit 'Anonymous votation' type of the Custom item to the 'Add item to the agenda' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)   
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Custom item' CTA", function() {
        cy.get('#puntoPersonalizado').click()        
    });

    it("Populate all required fields and navigate to the 'Type' field and select the 'Anonymous votation' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-custom-point-title').type('Anonymous votation Custom Agenda')
        cy.get('#agenda-custom-point-type-dropdown').click()
        cy.get('#agenda-custom-point-type-1').click()
        cy.get('#custom-point-added-option-0').type('Value')
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Anonymous votation' type of item is successfully added", function () {
        cy.contains('Anonymous votation Custom Agenda').should('be.visible')
    })

    it("Click on the already added item and modify it with changes you want then click on the 'OK' button", function() {
        cy.get('#agenda-step-item-1').click()
        cy.get('#agenda-custom-point-title').clear().type('Edit Anonymous votation Custom Agenda')
        cy.get('#alert-confirm-button-accept').click()
    })

    it("Item is successfully edited", function() {
        cy.contains('Edit Anonymous votation Custom Agenda').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to remove 'Anonymous votation' type of the Custom item to the 'Add item to the agenda' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)  
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Custom item' CTA", function() {
        cy.get('#puntoPersonalizado').click()        
    });

    it("Populate all required fields and navigate to the 'Type' field and select the 'Anonymous votation' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-custom-point-title').type('Anonymous votation Custom Agenda')
        cy.get('#agenda-custom-point-type-dropdown').click()
        cy.get('#agenda-custom-point-type-1').click()
        cy.get('#custom-point-added-option-0').type('Value')
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Anonymous votation' type of item is successfully added", function () {
        cy.contains('Anonymous votation Custom Agenda').should('be.visible')
    })


    it("Navigate to the already added item and click on the 'X' button to remove it then click on the 'Delete' button", function() {
        cy.get('#agenda-step-delete-item-1').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("Item is successfully removed", function() {
        cy.get('#agenda-step-item-1').should('not.exist')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});










describe("The user is able to add 'Public voting' type of the Custom item to the 'Add item to the agenda' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)  
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Custom item' CTA", function() {
        cy.get('#puntoPersonalizado').click()        
    });

    it("Populate all required fields and navigate to the 'Type' field and select the 'Public voting' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-custom-point-title').type('Public voting Custom Agenda')
        cy.get('#agenda-custom-point-type-dropdown').click()
        cy.get('#agenda-custom-point-type-2').click()
        cy.get('#custom-point-added-option-0').type('Value')
        cy.get('#alert-confirm-button-accept').click()

    })

    it("'Public voting' type of item is successfully added", function () {
        cy.contains('Public voting Custom Agenda').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});


describe("The user is able to edit 'Public voting' type of the Custom item to the 'Add item to the agenda' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)   
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Custom item' CTA", function() {
        cy.get('#puntoPersonalizado').click()        
    });

    it("Populate all required fields and navigate to the 'Type' field and select the 'Public voting' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-custom-point-title').type('Public voting Custom Agenda')
        cy.get('#agenda-custom-point-type-dropdown').click()
        cy.get('#agenda-custom-point-type-1').click()
        cy.get('#custom-point-added-option-0').type('Value')
        cy.get('#alert-confirm-button-accept').click()

    })

    it("'Public voting' type of item is successfully added", function () {
        cy.contains('Public voting Custom Agenda').should('be.visible')
    })

    it("Click on the already added item and modify it with changes you want then click on the 'OK' button", function() {
        cy.get('#agenda-step-item-1').click()
        cy.get('#agenda-custom-point-title').clear().type('Edit Public voting Custom Agenda')
        cy.get('#alert-confirm-button-accept').click()
    })

    it("Item is successfully edited", function() {
        cy.contains('Edit Public voting Custom Agenda').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to remove 'Public voting' type of the Custom item to the 'Add item to the agenda' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)   
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Custom item' CTA", function() {
        cy.get('#puntoPersonalizado').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Public voting' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-custom-point-title').type('Public voting Custom Agenda')
        cy.get('#agenda-custom-point-type-dropdown').click()
        cy.get('#agenda-custom-point-type-1').click()
        cy.get('#custom-point-added-option-0').type('Value')
        cy.get('#alert-confirm-button-accept').click()

    })

    it("'Public voting' type of item is successfully added", function () {
        cy.contains('Public voting Custom Agenda').should('be.visible')
    })


    it("Navigate to the already added item and click on the 'X' button to remove it then click on the 'Delete' button", function() {
        cy.get('#agenda-step-delete-item-1').click()
        cy.get('#alert-confirm-button-accept').click()

    })

    it("Item is successfully removed", function() {
        cy.get('#agenda-step-item-1').should('not.exist')
    })
    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});











describe("The user is able to add attachment the 'Item Yes/no/abstention' to the 'Add item to the agenda' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)   
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'add attachment' button and click on it then upload the document you want then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('test Attach')


        const docFile = 'testDocument.txt';
        
  

        cy.get('#agenda-add-attachment-dropdown').click()
        cy.get('#agenda-add-attachment-dropdown > div.jss14770.jss14780.jss14771.jss14827 > div > div > label > div').attachFile(docFile)

        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Public voting' type of item is successfully added", function () {
        cy.contains('Public voting Custom Agenda').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});













describe("The user is able to add attachment in the Custom item to the 'Add item to the agenda' section", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        
        cy.get('#add-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
            cy.get('#participant-email-input')
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

        cy.get('#alert-confirm-button-accept').click()
          
        cy.wait(2000)   
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Custom item' CTA", function() {
        cy.get('#puntoPersonalizado').click()        
    });

    it("Populate all required fields and navigate to the 'add attachment' button and click on it then upload the document you want then click on the 'OK' CTA", function() {
        cy.get('#agenda-custom-point-title').type('Public voting Custom Agenda')
        cy.get('#custom-point-added-option-0').type('Value')

        const docFile = 'testDocument.txt';
        
  

        cy.get('#agenda-add-attachment-dropdown').click()
        cy.get('#agenda-add-attachment-dropdown > div.jss14770.jss14780.jss14771.jss14827 > div > div > label > div').attachFile(docFile)

        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Roll-call vote' type of item is successfully added", function () {
        cy.contains('Public voting Custom Agenda').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});