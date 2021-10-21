const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");



describe("Councilbox login - valid username and password", function() {

     before(function() {
        
    });


    it("Visits the Councilbox web page", function() {
        cy.visit(login_url);
        cy.wait(3000)
    });

    it("Change language to Spanish", function() {
        cy.get('#language-selector').click();
        cy.get('#language-es').click();
    });

    it("Enters email address", function() {
        cy.get('#username').clear()
            .type('alem@qaengineers.net')    
            .should("have.value", 'alem@qaengineers.net')
    });

    it("Enters password", function() {
        cy.get('#password').clear()
            .type('Mostar123!')    
            .should("have.value", 'Mostar123!')
    });

    it("Clicks login button", function() {
        cy.get("#login-button").click();
        cy.wait(2000)
    });

});




describe("The user is able to create a new call with session in the 'Nueva reunion' section", function() {

    it("Click on the 'Nueva reunion' button", function() {
        cy.wait(3000)
        cy.get('#create-council-block').click()

    });


    it("Click on the 'Con sesion' button", function() {
        cy.get('#create-council-with-session').click()

        cy.wait(1000)

       

    });

    it("Populate all required fields and click on the 'Siguiente' button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')

        cy.get('#council-editor-next').click()


    });


    it("Click on the 'Anadir participante' button and populate all required fields then click on the 'Siguiente' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)


           
            
        cy.get('#participant-name-input').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))    
            
        
            
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))    
            
        cy.get('#participant-dni-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))     
            
        cy.get('#participant-phone-input').clear()
            .type('123123123')    
            
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')    
            
        cy.get('#participant-administrative-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
          
          
    });

  

    it("Click on the 'Aceptar' button", function() {
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        cy.get('#censoSiguienteNew').click()
          
    });


    it("Click on the 'Anadir punto al orden del dia+'' button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()
          
    });




     it("Click on the 'Punto Si/no/ abstencion' button and populate all required fields and click on the 'Aceptar' button then click on the 'Siguiente' button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#agenda-editor-title-input')
            .type('Test')
        cy.get('#alert-confirm-button-accept').click()  
        cy.wait(1000)
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
        cy.wait(1000)
        cy.get('#council-options-contact-email').scrollIntoView()
        cy.wait(1000)
        cy.get('#council-options-contact-email')
            .type('test@test.test')
        cy.get('#optionsNewSiguiente').click()
        cy.wait(1000)
    });

/*

     it("Click on the 'Anadir+'' button then click on the 'Subir archivo button and select the document you want to add and click on the 'next' button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#tituloPuntoDelDiaModal').type('Test')
        cy.contains('Aceptar').click()  
        cy.get('#ordenDelDiaNext').click()
    });

*/

it("Click on the 'Convocar y notificar' button", function() {
        cy.get('#council-editor-convene-notify').click()
        cy.wait(5000)


    
});

it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });

});


describe("The user is able to create a new call without session in the 'Nueva reunion' section", function() {

    it("Click on the 'Nueva reunion' button", function() {
        cy.get('#create-council-block').click()

    });


    it("Click on the 'Sin sesion' button and populate all required fields then click on the 'Aceptar' button", function() {
        cy.get('#create-council-without-session').click()
        cy.wait(3000)
        cy.get('#date-time-picker-date-start').click()
        cy.wait(1000)
        cy.get('#calendar-accept-button').click()

        cy.get('#date-time-picker-date-end').click()
        cy.contains('2021').click()
        cy.contains('2022').click()
        cy.get('#calendar-accept-button').click()
        cy.wait(1000)
        cy.get('#alert-confirm-button-accept').click()
        



    });

    it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });
    
});

describe("The user is able to start council in the 'New call with session' section", function() {

    it("Click on the 'Nueva reunion' button", function() {
        cy.get('#create-council-block').click()

    });


    it("Click on the “Con sesion” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)
    
    });


    it("Populate all required fields and click on the “Siguiente” button", function() {

        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')

        cy.get('#council-editor-next').click()

    });


    it("Click on the 'Anadir participante' button and populate all required fields then click on the “Siguiente” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)

     
        
            
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))    
            
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 

        cy.get('#participant-dni-input').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))      
            
        cy.get('#participant-phone-input').clear()
            .type('123123123')    
            
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')    
            
        cy.get('#participant-administrative-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
          
          cy.get('#alert-confirm-button-accept').click()

          cy.wait(1000)

          cy.wait(3000)

          cy.get('#censoSiguienteNew').click()

    });


    it("Click on the “Anadir punto al orden del dia+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()
        

    });


    it("Click on the “Punto Si/no abstencion” button and populate “Title” field then choose “Votacio nominal” tipo and click on the “Aceptar” button then click on the “Siguiente” button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#agenda-editor-title-input').clear()
            .type('Test')

        cy.get('#agenda-editor-type-select').click()

        cy.wait(1000)
        cy.get('#agenda-editor-type-1').click()
        cy.wait(1000)
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        cy.get('#ordenDelDiaNext').click()

        cy.wait(1000)

        cy.get('#attachmentSiguienteNew').click()

        cy.wait(1000)
        

    });

/*
    it("Click on the 'Anadir+'' button then click on the 'Subir archivo button and select the document you want to add and click on the next' button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#tituloPuntoDelDiaModal').type('Test')
        cy.contains('Informativo').click()
        cy.wait(1000)
        cy.contains('Votación nominal').click()
        cy.contains('Aceptar').click()
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)

       

    });

    */


     it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-options-contact-email').scrollIntoView()
        cy.wait(1000)
        cy.get('#council-options-contact-email')
            .type('test@test.test')
        
        cy.get('#optionsNewSiguiente').click()
        cy.wait(1000)
        
        

    });


      it("Click on the “Convocar y notificar” button", function() {
        
        cy.get('#council-editor-convene-notify').click()
        cy.wait(3000)
        
        

    });


       it("Click on the “Preparar sala” button", function() {
        
        cy.get('#prepararSalaNew').click()
        
        

    });


         it("Navigate to the upper right corner and click on the “Abrir Sala” button", function() {
        
        cy.get('#abrirSalaEnReunion').click()
        
        

    });


           it("Populate all required fields and click on the “Aceptar” button", function() {
        
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(10000)
        
        

    });


           it("Navigate to the “Camera and microphone” form and click on the “Accept” button", function() {
 /*       
            cy.get('#admin-room-iframe').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    .contains('Join')
    .click()

    cy.wait(10000)
})
*/
       
   });


            it("Navigate to the upper right corner and click on the “Iniciar reunion” button", function() {
        
        cy.get('#start-council-button').click()
        cy.wait(2000)
        
        
    
    });


             it("Populate all required fields and click on the “Aceptar” button", function() {
        
        

        cy.get('#council-president-select').click()

       cy.wait(200)

       cy.get('#participant-selector-0').click()

        cy.get('#council-secretary-select').click()

        cy.wait(200)

        cy.get('#participant-selector-0').click()

        cy.get('#council-quality-vote-select').click()

        cy.wait(200)

        cy.get('#participant-selector-0').click()

       
        cy.get('#alert-confirm-button-accept').click()

        cy.wait(200)

        cy.get('#alert-confirm-button-cancel').click()
        
    
    });

    it("User should be able to exit the meeting", function() {

        cy.visit(login_url)
/*
         cy.get('#Your App: 'councilbox-client'').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    cy.get('#exit-live-room-button').click()
        cy.wait(1000)

   
})
        
        
        cy.contains('Aceptar').click()
        cy.wait(1000)
        
   */     
    
    });



     

 });



describe("The user is able to open point in the 'New call with session' section", function() {

    it("Click on the 'Nueva reunion' button", function() {

        cy.get('#create-council-block').click()

    });


    it("Click on the “Con sesion” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)
    
    });


    it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')

        cy.get('#council-editor-next').click()
        cy.wait(1000)

    });


    it("Click on the 'Anadir participante' button and populate all required fields then click on the “Siguiente” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)


           cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))    
            
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 

        cy.get('#participant-dni-input').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))      
            
        cy.get('#participant-phone-input').clear()
            .type('123123123')    
            
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')    
            
        cy.get('#participant-administrative-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
          
          cy.get('#alert-confirm-button-accept').click()

          cy.wait(1000)
          cy.wait(3000)

          cy.get('#censoSiguienteNew').click()

    });


    it("Click on the “Anadir punto al orden del dia+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()
        

    });


    it("Click on the “Punto Si/no abstencion” button and populate “Title” field then choose “Votacio nominal” tipo and click on the “Aceptar” button then click on the “Siguiente” button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#agenda-editor-title-input').type('Test')

        cy.get('#agenda-editor-type-select').click()

        cy.wait(1000)
        cy.get('#agenda-editor-type-1').click()
        cy.wait(1000)
        cy.wait(1000)

        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        cy.get('#ordenDelDiaNext').click()

        cy.wait(1000)

        cy.get('#attachmentSiguienteNew').click()

        cy.wait(1000)
        

    });

/*
    it("Click on the 'Anadir+'' button then click on the 'Subir archivo button and select the document you want to add and click on the next' button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#tituloPuntoDelDiaModal').type('Test')
        cy.contains('Informativo').click()
        cy.wait(1000)
        cy.contains('Votación nominal').click()
        cy.contains('Aceptar').click()
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)

       

    });

    */


     it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-options-contact-email').scrollIntoView()
        cy.wait(1000)
        cy.get('#council-options-contact-email')
            .type('test@test.test')
        
        cy.get('#optionsNewSiguiente').click()
        cy.wait(1000)
        
        

    });


      it("Click on the “Convocar y notificar” button", function() {
        
        cy.get('#council-editor-convene-notify').click()
        cy.wait(3000)
        
        

    });


       it("Click on the “Preparar sala” button", function() {
        
        cy.get('#prepararSalaNew').click()
        
        

    });


         it("Navigate to the upper right corner and click on the “Abrir Sala” button", function() {
        
        cy.get('#abrirSalaEnReunion').click()
        
        

    });


           it("Populate all required fields and click on the “Aceptar” button", function() {
        
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(10000)
        
        

    });


           it("Navigate to the “Camera and microphone” form and click on the “Accept” button", function() {
 /*       
            cy.get('#admin-room-iframe').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    .contains('Join')
    .click()

    cy.wait(10000)
})
*/
       
   });


            it("Navigate to the upper right corner and click on the “Iniciar reunion” button", function() {
        
        cy.get('#start-council-button').click()
        cy.wait(2000)
        
        
    
    });


             it("Populate all required fields and click on the “Aceptar” button", function() {
        
       

        cy.get('#council-president-select').click()

       cy.wait(200)

       cy.get('#participant-selector-0').click()

        cy.get('#council-secretary-select').click()

        cy.wait(200)

        cy.get('#participant-selector-0').click()

        cy.get('#council-quality-vote-select').click()

        cy.wait(200)

        cy.get('#participant-selector-0').click()

       
         cy.get('#alert-confirm-button-accept').click()
        cy.wait(200)
        cy.get('#alert-confirm-button-cancel').click()
        
    
    });


        it("Click on the “Abrir punto” button", function() {
        
        cy.get('#ordenDelDiaParticipantesButton').click()
        cy.wait(1000)
        cy.get('#open-agenda-point-button').click()
        cy.wait(2000)
        
        
    
    });




        it("User should be able to exit the meeting", function() {

        cy.visit(login_url)

    });




 });




describe("The user is able to activate ratings in the 'New call with session'", function() {

     it("Click on the 'Nueva reunion' button", function() {
        cy.get('#create-council-block').click()

    });


    it("Click on the “Con sesion” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)
    
    });


    it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')

        cy.get('#council-editor-next').click()
        cy.wait(1000)

    });


    it("Click on the 'Anadir participante' button and populate all required fields then click on the “Siguiente” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)


           
            
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))    
            
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 

        cy.get('#participant-dni-input').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))      
            
        cy.get('#participant-phone-input').clear()
            .type('123123123')    
            
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')    
            
        cy.get('#participant-administrative-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
          
          cy.get('#alert-confirm-button-accept').click()

          cy.wait(1000)
          cy.wait(3000)

          cy.get('#censoSiguienteNew').click()

    });


    it("Click on the “Anadir punto al orden del dia+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()
        

    });


    it("Click on the “Punto Si/no abstencion” button and populate “Title” field then choose “Votacio nominal” tipo and click on the “Aceptar” button then click on the “Siguiente” button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#agenda-editor-title-input').type('Test')

        cy.get('#agenda-editor-type-select').click()

        cy.wait(1000)
        cy.get('#agenda-editor-type-1').click()
        cy.wait(1000)
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        cy.get('#ordenDelDiaNext').click()

        cy.wait(1000)

        cy.get('#attachmentSiguienteNew').click()

        cy.wait(1000)
        

    });

/*
    it("Click on the 'Anadir+'' button then click on the 'Subir archivo button and select the document you want to add and click on the next' button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#tituloPuntoDelDiaModal').type('Test')
        cy.contains('Informativo').click()
        cy.wait(1000)
        cy.contains('Votación nominal').click()
        cy.contains('Aceptar').click()
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)

       

    });

    */


     it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-options-contact-email').scrollIntoView()
        cy.wait(1000)
        cy.get('#council-options-contact-email')
            .type('test@test.test')
        
        cy.get('#optionsNewSiguiente').click()
        cy.wait(1000)
        
        

    });


      it("Click on the “Convocar y notificar” button", function() {
        
        cy.get('#council-editor-convene-notify').click()
        cy.wait(3000)
        
        

    });


       it("Click on the “Preparar sala” button", function() {
        
        cy.get('#prepararSalaNew').click()
        
        

    });


         it("Navigate to the upper right corner and click on the “Abrir Sala” button", function() {
        
        cy.get('#abrirSalaEnReunion').click()
        
        

    });


           it("Populate all required fields and click on the “Aceptar” button", function() {
        
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(10000)
        
        

    });


           it("Navigate to the “Camera and microphone” form and click on the “Accept” button", function() {
 /*       
            cy.get('#admin-room-iframe').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    .contains('Join')
    .click()

    cy.wait(10000)
})
*/
       
   });


            it("Navigate to the upper right corner and click on the “Iniciar reunion” button", function() {
        
        cy.get('#start-council-button').click()
        cy.wait(2000)
        
        
    
    });
            it("Populate all required fields and click on the “Aceptar” button", function() {


        

        cy.get('#council-president-select').click()

       cy.wait(200)

       cy.get('#participant-selector-0').click()

        cy.get('#council-secretary-select').click()

        cy.wait(200)

        cy.get('#participant-selector-0').click()

        cy.get('#council-quality-vote-select').click()

        cy.wait(200)

        cy.get('#participant-selector-0').click()

       
         cy.get('#alert-confirm-button-accept').click()
        cy.wait(200)
        cy.get('#alert-confirm-button-cancel').click()
        
    
    });


        it("Click on the “Abrir punto” button", function() {
        
        cy.get('#ordenDelDiaParticipantesButton').click()
        cy.wait(1000)
        cy.get('#open-agenda-point-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Activar votaciones” button", function() {
        
        cy.get('#ordenDelDiaParticipantesButton').click()
        cy.wait(1000)
        cy.get('#open-point-votings-button').click()
        cy.wait(2000)
        
        
    
    });



    it("User should be able to exit the meeting", function() {

        cy.visit(login_url)

    });







 });




describe("The user is able to close point votations in the 'New call with session' type of meeting'", function() {

     it("Click on the 'Nueva reunion' button", function() {
        cy.get('#create-council-block').click()

    });


    it("Click on the “Con sesion” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)
    
    });


    it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')

        cy.get('#council-editor-next').click()
        cy.wait(1000)

    });


    it("Click on the 'Anadir participante' button and populate all required fields then click on the “Siguiente” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)


           
            
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))    
            
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 

        cy.get('#participant-dni-input').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))      
            
        cy.get('#participant-phone-input').clear()
            .type('123123123')    
            
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')    
            
        cy.get('#participant-administrative-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
          
          cy.get('#alert-confirm-button-accept').click()

          cy.wait(1000)
          cy.wait(3000)

          cy.get('#censoSiguienteNew').click()

    });


    it("Click on the “Anadir punto al orden del dia+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()
        

    });


    it("Click on the “Punto Si/no abstencion” button and populate “Title” field then choose “Votacio nominal” tipo and click on the “Aceptar” button then click on the “Siguiente” button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#agenda-editor-title-input').type('Test')

        cy.get('#agenda-editor-type-select').click()

        cy.wait(1000)
        cy.get('#agenda-editor-type-1').click()
        cy.wait(1000)
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        cy.get('#ordenDelDiaNext').click()

        cy.wait(1000)

        cy.get('#attachmentSiguienteNew').click()

        cy.wait(1000)
        

    });

/*
    it("Click on the 'Anadir+'' button then click on the 'Subir archivo button and select the document you want to add and click on the next' button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#tituloPuntoDelDiaModal').type('Test')
        cy.contains('Informativo').click()
        cy.wait(1000)
        cy.contains('Votación nominal').click()
        cy.contains('Aceptar').click()
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)

       

    });

    */


     it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-options-contact-email').scrollIntoView()
        cy.wait(1000)
        cy.get('#council-options-contact-email')
            .type('test@test.test')
        
        cy.get('#optionsNewSiguiente').click()
        cy.wait(1000)
        
        

    });


      it("Click on the “Convocar y notificar” button", function() {
        
        cy.get('#council-editor-convene-notify').click()
        cy.wait(3000)
        
        

    });


       it("Click on the “Preparar sala” button", function() {
        
        cy.get('#prepararSalaNew').click()
        
        

    });


         it("Navigate to the upper right corner and click on the “Abrir Sala” button", function() {
        
        cy.get('#abrirSalaEnReunion').click()
        
        

    });


           it("Populate all required fields and click on the “Aceptar” button", function() {
        
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(10000)
        
        

    });


           it("Navigate to the “Camera and microphone” form and click on the “Accept” button", function() {
 /*       
            cy.get('#admin-room-iframe').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    .contains('Join')
    .click()

    cy.wait(10000)
})
*/
       
   });


            it("Navigate to the upper right corner and click on the “Iniciar reunion” button", function() {
        
        cy.get('#start-council-button').click()
        cy.wait(2000)
        
        
    
    });


             it("Populate all required fields and click on the “Aceptar” button", function() {
        
       

       cy.get('#council-president-select').click()

       cy.wait(200)

       cy.get('#participant-selector-0').click()

        cy.get('#council-secretary-select').click()

        cy.wait(200)

        cy.get('#participant-selector-0').click()

        cy.get('#council-quality-vote-select').click()

        cy.wait(200)

        cy.get('#participant-selector-0').click()

       
         cy.get('#alert-confirm-button-accept').click()
        cy.wait(200)
        cy.get('#alert-confirm-button-cancel').click()
        
    
    });


        it("Click on the “Abrir punto” button", function() {
        
        cy.get('#ordenDelDiaParticipantesButton').click()
        cy.wait(1000)
        cy.get('#open-agenda-point-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Activar votaciones” button", function() {
        
        cy.get('#ordenDelDiaParticipantesButton').click()
        cy.wait(1000)
        cy.get('#open-point-votings-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Cerrar las votaciones del punto” button", function() {
        
        cy.get('#close-point-votings-button').click()
        cy.wait(2000)
        
        
    
    });




    it("User should be able to exit the meeting", function() {

        cy.visit(login_url)

    });






 });



describe("The user is able to close point in the 'New call with session' type of meeting'", function() {

     it("Click on the 'Nueva reunion' button", function() {
        cy.contains('dashboard').click({ force: true })
        cy.get('#create-council-block').click()

    });


    it("Click on the “Con sesion” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)
    
    });


    it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')

        cy.get('#council-editor-next').click()
        cy.wait(1000)

    });


    it("Click on the 'Anadir participante' button and populate all required fields then click on the “Siguiente” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)


           
            
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))    
            
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 

        cy.get('#participant-dni-input').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))      
            
        cy.get('#participant-phone-input').clear()
            .type('123123123')    
            
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')    
            
        cy.get('#participant-administrative-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
          
          cy.get('#alert-confirm-button-accept').click()

          cy.wait(1000)
          cy.wait(3000)

          cy.get('#censoSiguienteNew').click()

    });


    it("Click on the “Anadir punto al orden del dia+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()
        

    });


    it("Click on the “Punto Si/no abstencion” button and populate “Title” field then choose “Votacio nominal” tipo and click on the “Aceptar” button then click on the “Siguiente” button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#agenda-editor-title-input').type('Test')

        cy.get('#agenda-editor-type-select').click()

        cy.wait(1000)
        cy.get('#agenda-editor-type-1').click()
        cy.wait(1000)
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        cy.get('#ordenDelDiaNext').click()

        cy.wait(1000)

        cy.get('#attachmentSiguienteNew').click()

        cy.wait(1000)
        

    });

/*
    it("Click on the 'Anadir+'' button then click on the 'Subir archivo button and select the document you want to add and click on the next' button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#tituloPuntoDelDiaModal').type('Test')
        cy.contains('Informativo').click()
        cy.wait(1000)
        cy.contains('Votación nominal').click()
        cy.contains('Aceptar').click()
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)

       

    });

    */


     it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-options-contact-email').scrollIntoView()
        cy.wait(1000)
        cy.get('#council-options-contact-email')
            .type('test@test.test')
        
        cy.get('#optionsNewSiguiente').click()
        cy.wait(1000)
        
        

    });


      it("Click on the “Convocar y notificar” button", function() {
        
        cy.get('#council-editor-convene-notify').click()
        cy.wait(3000)
        
        

    });


       it("Click on the “Preparar sala” button", function() {
        
        cy.get('#prepararSalaNew').click()
        
        

    });


         it("Navigate to the upper right corner and click on the “Abrir Sala” button", function() {
        
        cy.get('#abrirSalaEnReunion').click()
        
        

    });


           it("Populate all required fields and click on the “Aceptar” button", function() {
        
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(10000)
        
        

    });


           it("Navigate to the “Camera and microphone” form and click on the “Accept” button", function() {
 /*       
            cy.get('#admin-room-iframe').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    .contains('Join')
    .click()

    cy.wait(10000)
})
*/
       
   });


            it("Navigate to the upper right corner and click on the “Iniciar reunion” button", function() {
        
        cy.get('#start-council-button').click()
        cy.wait(2000)
        
        
    
    });


             it("Populate all required fields and click on the “Aceptar” button", function() {
        
       

        cy.get('#council-president-select').click()

       cy.wait(200)

       cy.get('#participant-selector-0').click()

        cy.get('#council-secretary-select').click()

        cy.wait(200)

        cy.get('#participant-selector-0').click()

        cy.get('#council-quality-vote-select').click()

        cy.wait(200)

        cy.get('#participant-selector-0').click()

       
         cy.get('#alert-confirm-button-accept').click()
        cy.wait(200)
        cy.get('#alert-confirm-button-cancel').click()
        
    
    });


        it("Click on the “Abrir punto” button", function() {
        
        cy.get('#ordenDelDiaParticipantesButton').click()
        cy.wait(1000)
        cy.get('#open-agenda-point-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Activar votaciones” button", function() {
        
        cy.get('#ordenDelDiaParticipantesButton').click()
        cy.wait(1000)
        cy.get('#open-point-votings-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Cerrar las votaciones del punto” button", function() {
        
        cy.get('#close-point-votings-button').click()
        cy.wait(2000)
        
        
    
    });

    it("Click on the “Cerrar punto” button", function() {
        
        cy.get('#close-agenda-point-button').click()
        cy.wait(2000)
        
        
    
    });



    it("User should be able to exit the meeting", function() {

        cy.visit(login_url)

    });




 });







describe("The user is able to finish council in the 'New call with session' type of meeting", function() {

     it("Click on the 'Nueva reunion' button", function() {
        cy.get('#create-council-block').click()

    });


    it("Click on the “Con sesion” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)
    
    });


    it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')

        cy.get('#council-editor-next').click()
        cy.wait(1000)

    });


    it("Click on the 'Anadir participante' button and populate all required fields then click on the “Siguiente” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)


           
            
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))    
            
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 

        cy.get('#participant-dni-input').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))      
            
        cy.get('#participant-phone-input').clear()
            .type('123123123')    
            
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')    
            
        cy.get('#participant-administrative-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
          
          cy.get('#alert-confirm-button-accept').click()

          cy.wait(1000)
          cy.wait(3000)

          cy.get('#censoSiguienteNew').click()

    });


    it("Click on the “Anadir punto al orden del dia+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()
        

    });


    it("Click on the “Punto Si/no abstencion” button and populate “Title” field then choose “Votacio nominal” tipo and click on the “Aceptar” button then click on the “Siguiente” button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#agenda-editor-title-input').type('Test')

        cy.get('#agenda-editor-type-select').click()

        cy.wait(1000)
        cy.get('#agenda-editor-type-1').click()
        cy.wait(1000)
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        cy.get('#ordenDelDiaNext').click()

        cy.wait(1000)

        cy.get('#attachmentSiguienteNew').click()

        cy.wait(1000)
        

    });

/*
    it("Click on the 'Anadir+'' button then click on the 'Subir archivo button and select the document you want to add and click on the next' button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#tituloPuntoDelDiaModal').type('Test')
        cy.contains('Informativo').click()
        cy.wait(1000)
        cy.contains('Votación nominal').click()
        cy.contains('Aceptar').click()
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)

       

    });

    */


     it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-options-contact-email').scrollIntoView()
        cy.wait(1000)
        cy.get('#council-options-contact-email')
            .type('test@test.test')
        
        cy.get('#optionsNewSiguiente').click()
        cy.wait(1000)
        
        

    });


      it("Click on the “Convocar y notificar” button", function() {
        
        cy.get('#council-editor-convene-notify').click()
        cy.wait(3000)
        
        

    });


       it("Click on the “Preparar sala” button", function() {
        
        cy.get('#prepararSalaNew').click()
        
        

    });


         it("Navigate to the upper right corner and click on the “Abrir Sala” button", function() {
        
        cy.get('#abrirSalaEnReunion').click()
        
        

    });


           it("Populate all required fields and click on the “Aceptar” button", function() {
        
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(10000)
        
        

    });


           it("Navigate to the “Camera and microphone” form and click on the “Accept” button", function() {
 /*       
            cy.get('#admin-room-iframe').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    .contains('Join')
    .click()

    cy.wait(10000)
})
*/
       
   });


            it("Navigate to the upper right corner and click on the “Iniciar reunion” button", function() {
        
        cy.get('#start-council-button').click()
        cy.wait(2000)
        
        
    
    });


             it("Populate all required fields and click on the “Aceptar” button", function() {
        
       

        cy.get('#council-president-select').click()

       cy.wait(200)

       cy.get('#participant-selector-0').click()

        cy.get('#council-secretary-select').click()

        cy.wait(200)

        cy.get('#participant-selector-0').click()

        cy.get('#council-quality-vote-select').click()

        cy.wait(200)

        cy.get('#participant-selector-0').click()
       
         cy.get('#alert-confirm-button-accept').click()
        cy.wait(200)
        cy.get('#alert-confirm-button-cancel').click()
        
    
    });


        it("Click on the “Abrir punto” button", function() {
        
        cy.get('#ordenDelDiaParticipantesButton').click()
        cy.wait(1000)
        cy.get('#open-agenda-point-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Activar votaciones” button", function() {
        
        cy.get('#ordenDelDiaParticipantesButton').click()
        cy.wait(1000)
        cy.get('#open-point-votings-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Cerrar las votaciones del punto” button", function() {
        
        cy.get('#close-point-votings-button').click()
        cy.wait(2000)
        
        
    
    });

    it("Click on the “Cerrar punto” button", function() {
        
        cy.get('#close-agenda-point-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Finalizar reunion” button", function() {
        
        cy.get('#finalizarReunionEnReunion').click()
        
        
    
    });


    it("Click on the “Accept” button", function() {
        
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        
        
    
    });

    it("User should be able to exit the meeting", function() {

        cy.visit(login_url)

    });


 });




describe("The user is able to finalize and approve act in the 'New call with session' type of meeting", function() {

     it("Click on the 'Nueva reunion' button", function() {
        cy.get('#create-council-block').click()

    });


    it("Click on the “Con sesion” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)
    
    });


    it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')

        cy.get('#council-editor-next').click()
        cy.wait(1000)

    });


    it("Click on the 'Anadir participante' button and populate all required fields then click on the “Siguiente” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)


           
            
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))    
            
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 

        cy.get('#participant-dni-input').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))      
            
        cy.get('#participant-phone-input').clear()
            .type('123123123')    
            
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')    
            
        cy.get('#participant-administrative-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
          
          cy.get('#alert-confirm-button-accept').click()

          cy.wait(1000)
          cy.wait(3000)

          cy.get('#censoSiguienteNew').click()

    });


    it("Click on the “Anadir punto al orden del dia+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()
        

    });


    it("Click on the “Punto Si/no abstencion” button and populate “Title” field then choose “Votacio nominal” tipo and click on the “Aceptar” button then click on the “Siguiente” button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#agenda-editor-title-input').type('Test')

        cy.get('#agenda-editor-type-select').click()

        cy.wait(1000)
        cy.get('#agenda-editor-type-1').click()
        cy.wait(1000)
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        cy.get('#ordenDelDiaNext').click()

        cy.wait(1000)

        cy.get('#attachmentSiguienteNew').click()

        cy.wait(1000)
        

    });

/*
    it("Click on the 'Anadir+'' button then click on the 'Subir archivo button and select the document you want to add and click on the next' button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#tituloPuntoDelDiaModal').type('Test')
        cy.contains('Informativo').click()
        cy.wait(1000)
        cy.contains('Votación nominal').click()
        cy.contains('Aceptar').click()
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)

       

    });

    */


     it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-options-contact-email').scrollIntoView()
        cy.wait(1000)
        cy.get('#council-options-contact-email')
            .type('test@test.test')
        
        cy.get('#optionsNewSiguiente').click()
        cy.wait(1000)
        
        

    });


      it("Click on the “Convocar y notificar” button", function() {
        
        cy.get('#council-editor-convene-notify').click()
        cy.wait(3000)
        
        

    });


       it("Click on the “Preparar sala” button", function() {
        
        cy.get('#prepararSalaNew').click()
        
        

    });


         it("Navigate to the upper right corner and click on the “Abrir Sala” button", function() {
        
        cy.get('#abrirSalaEnReunion').click()
        
        

    });


           it("Populate all required fields and click on the “Aceptar” button", function() {
        
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(10000)
        
        

    });


           it("Navigate to the “Camera and microphone” form and click on the “Accept” button", function() {
 /*       
            cy.get('#admin-room-iframe').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    .contains('Join')
    .click()

    cy.wait(10000)
})
*/
       
   });


            it("Navigate to the upper right corner and click on the “Iniciar reunion” button", function() {
        
        cy.get('#start-council-button').click()
        cy.wait(2000)
        
        
    
    });


             it("Populate all required fields and click on the “Aceptar” button", function() {
        
        cy.get('#council-president-select').click()


        cy.wait(200)

        cy.get('#participant-selector-0').click()

        cy.get('#council-secretary-select').click()

        cy.wait(200)

        cy.get('#participant-selector-0').click()

        cy.wait(200)

        cy.get('#council-quality-vote-select').click()

        cy.get('#participant-selector-0').click()

       
         cy.get('#alert-confirm-button-accept').click()
        cy.wait(200)
        cy.get('#alert-confirm-button-cancel').click()
        
    
    });


        it("Click on the “Abrir punto” button", function() {
        
        cy.get('#ordenDelDiaParticipantesButton').click()
        cy.wait(1000)
        cy.get('#open-agenda-point-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Activar votaciones” button", function() {
        
        cy.get('#ordenDelDiaParticipantesButton').click()
        cy.wait(1000)
        cy.get('#open-point-votings-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Cerrar las votaciones del punto” button", function() {
        
        cy.get('#close-point-votings-button').click()
        cy.wait(2000)
        
        
    
    });

    it("Click on the “Cerrar punto” button", function() {
        
        cy.get('#close-agenda-point-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Finalizar reunion” button", function() {
        
        cy.get('#finalizarReunionEnReunion').click()
        
        
    
    });


    it("Click on the “Accept” button", function() {
        
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(3000)
        
        
    
    });


    it("Click on the “Finalizar y aprobar acta” button and again click on the “Finalizar y aprobar acta” button", function() {
        
        cy.get('#council-act-approve-button').click()
        cy.wait(5000)
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        
        
    
    });

    it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


 });



describe("The user is able to send minutes in the 'New call with session' type of meeting", function() {

     it("Click on the 'Nueva reunion' button", function() {
        
        cy.get('#create-council-block').click()

    });


    it("Click on the “Con sesion” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)
    
    });


    it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')

        cy.get('#council-editor-next').click()
        cy.wait(1000)

    });


    it("Click on the 'Anadir participante' button and populate all required fields then click on the “Siguiente” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)


           
            
         cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))    
            
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 

        cy.get('#participant-dni-input').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))      
            
        cy.get('#participant-phone-input').clear()
            .type('123123123')    
            
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')    
            
        cy.get('#participant-administrative-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
          
          cy.get('#alert-confirm-button-accept').click()

          cy.wait(1000)

          cy.wait(3000)

          cy.get('#censoSiguienteNew').click()

    });


    it("Click on the “Anadir punto al orden del dia+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()
        

    });


    it("Click on the “Punto Si/no abstencion” button and populate “Title” field then choose “Votacio nominal” tipo and click on the “Aceptar” button then click on the “Siguiente” button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#agenda-editor-title-input').type('Test')

        cy.get('#agenda-editor-type-select').click()

        cy.wait(1000)
        cy.get('#agenda-editor-type-1').click()
        cy.wait(1000)
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        cy.get('#ordenDelDiaNext').click()

        cy.wait(1000)

        cy.get('#attachmentSiguienteNew').click()

        cy.wait(1000)
        

    });

/*
    it("Click on the 'Anadir+'' button then click on the 'Subir archivo button and select the document you want to add and click on the next' button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#tituloPuntoDelDiaModal').type('Test')
        cy.contains('Informativo').click()
        cy.wait(1000)
        cy.contains('Votación nominal').click()
        cy.contains('Aceptar').click()
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)

       

    });

    */


     it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-options-contact-email').scrollIntoView()
        cy.wait(1000)
        cy.get('#council-options-contact-email')
            .type('test@test.test')
        
        cy.get('#optionsNewSiguiente').click()
        cy.wait(1000)
        
        

    });


      it("Click on the “Convocar y notificar” button", function() {
        
        cy.get('#council-editor-convene-notify').click()
        cy.wait(3000)
        
        

    });


       it("Click on the “Preparar sala” button", function() {
        
        cy.get('#prepararSalaNew').click()
        
        

    });


         it("Navigate to the upper right corner and click on the “Abrir Sala” button", function() {
        
        cy.get('#abrirSalaEnReunion').click()
        
        

    });


           it("Populate all required fields and click on the “Aceptar” button", function() {
        
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(10000)
        
        

    });


           it("Navigate to the “Camera and microphone” form and click on the “Accept” button", function() {
 /*       
            cy.get('#admin-room-iframe').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    .contains('Join')
    .click()

    cy.wait(10000)
})
*/
       
   });


            it("Navigate to the upper right corner and click on the “Iniciar reunion” button", function() {
        
        cy.get('#start-council-button').click()
        cy.wait(2000)
        
        
    
    });


             it("Populate all required fields and click on the “Aceptar” button", function() {
        
       cy.get('#council-president-select').click()

       cy.wait(200)

       cy.get('#participant-selector-0').click()

        cy.get('#council-secretary-select').click()

        cy.wait(200)

        cy.get('#participant-selector-0').click()

        cy.get('#council-quality-vote-select').click()

        cy.wait(200)

        cy.get('#participant-selector-0').click()

       
         cy.get('#alert-confirm-button-accept').click()
        cy.wait(200)
        cy.get('#alert-confirm-button-cancel').click()
        
    
    });


        it("Click on the “Abrir punto” button", function() {
        
        cy.get('#ordenDelDiaParticipantesButton').click()
        cy.wait(1000)
        cy.get('#open-agenda-point-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Activar votaciones” button", function() {
        
        cy.get('#ordenDelDiaParticipantesButton').click()
        cy.wait(1000)
        cy.get('#open-point-votings-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Cerrar las votaciones del punto” button", function() {
        
        cy.get('#close-point-votings-button').click()
        cy.wait(2000)
        
        
    
    });

    it("Click on the “Cerrar punto” button", function() {
        
        cy.get('#close-agenda-point-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Finalizar reunion” button", function() {
        
        cy.get('#finalizarReunionEnReunion').click()
        
        
    
    });


    it("Click on the “Accept” button", function() {
        
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Finalizar y aprobar acta” button and again click on the “Finalizar y aprobar acta” button", function() {
        
        cy.get('#council-act-approve-button').click()
        cy.wait(5000)
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        
        
    
    });


    it("Click on the “Envio del acta” button", function() {
        
        cy.get('#tab-sendAct').click()
        cy.wait(1000)
        
        
    
    });


    it("Click on the “Enviar acta” button", function() {
        
        cy.get('#send-act-button').click()
        cy.wait(1000)
        
        
    
    });


    it("Click on the “Enviar a todos los convocados then click on the “Enviar” button", function() {
        
        cy.get('#send-act-all-convened-option').click()
        cy.wait(1000)
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(3000)
        cy.get('#alert-confirm-button-cancel').click()
        
        
    
    });

    it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });



 });
