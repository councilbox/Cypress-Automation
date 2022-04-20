class appointmentsPage {

	elements = {
		add_button: () => cy.get('#create-appointment-button'),
		desription: () => cy.get('#council-notice-convene-intro'),
		next_details: () => cy.get('#council-editor-next'),

		add_participant: () => cy.get('#anadirParticipanteEnCensoNewReunion'),
		participant_name: () => cy.get('#participant-name'),
		participant_surname: () => cy.get('#participant-surnamename'),
		participant_dni: () => cy.get('#participant-dni'),
		participant_position: () => cy.get('#participant-position'),
		participant_email: () => cy.get('#participant-email'),
		participant_phone_code: () => cy.get('#participant-phone-code'),
		participant_phone: () => cy.get('#participant-phone'),
		participant_language: () => cy.get('#participant-language'),
		next_participants: () => cy.get('#censoSiguienteNew'),

		consents_add_button: () => cy.get('#add-appointment-agenda-point'),
		consents_title: () => cy.get('#agenda-editor-title-input'),
		consents_save: () => cy.get('#panel-confirm-button-accept'),
		next_consents: () => cy.get('#ordenDelDiaNext'),

		next_documentation: () => cy.get('#attachmentSiguienteNew'),

		next_configuration: () => cy.get('#optionsNewSiguiente'),

		send_button: () => cy.get('#council-editor-convene-notify'),

		prepare_room: () => cy.get('#prepararSalaNew'),

		open_room: () => cy.get('#abrirSalaEnReunion'),

		start_appointment: () => cy.get('#start-council-button'),


		

	}

	click_on_add_button() {
		this.elements.add_button()
			.should('be.visible')
			.click()
		cy.url().should('include', '/council/')
	}

	enter_description(description) {
		this.elements.description()
			.should('be.visible')
			.clear()
			.type(description)
			.should('have.value', description)
	}

	click_next_details() {
		this.elements.next_details()
			.should('be.visible')
			.click()		
	}

	click_add_participant_button() {
		this.elements.add_participant()
			.should('be.visible')
			.click()
		cy.get('#alert-confirm > div.MuiDialog-container.MuiDialog-scrollPaper > div')
			.should('be.visible')
	}

	enter_participant_data(name, surname, dni, email, phone_code, phone) {
		this.elements.participant_name()
			.should('be.visible')
			.type(name)
			.should('have.value', name)
		this.elements.participant_surname()
			.should('be.visible')
			.type(surname)
			.should('have.value', surname)
		this.elements.participant_dni()
			.should('be.visible')
			.type(dni)
			.should('have.value', dni)
		this.elements.participant_email()
			.should('be.visible')
			.type(email)
			.should('have.value', email)
		this.elements.participant_phone_code()
			.should('be.visible')
			.clear()
			.type(phone_code)
			.should('have.value', phone_code)
		this.elements.participant_phone()
			.should('be.visible')
			.type(phone)
			.should('have.value', phone)
		}

	click_next_participants() {
		this.elements.next_participants()
			.should(be.visible)
			.click()
	}

	click_add_consents() {
		this.elements.consents_add_button()
			.should('be.visible')
			.click()
	}

	enter_consent_title() {
		this.elements.consents_title()
			.should('be.visible')
			.clear()
			.type(consents_title)
			.should('have.value', consents_title)
	}

	click_consent_save_button() {
		this.elements.consents_save()
			.should('be.visible')
			.click()
	}

	click_next_consents() {
		this.elements.next_consents()
			.should('be.visible')
			.click()
	}

	click_next_documentation() {
		this.elements.next_documentation()
			.should('be.visible')
			.click()
	}

	click_next_configuration() {
		this.elements.next_configuration()
			.should('be.visible')
			.click()
	}

	click_send() {
		this.elements.send_button()
			.should('be.visible')
			.click()
		cy.wait(1000)
	}

	click_prepare_room() {
		this.elements.prepare_room()
			.should('be.visible')
			.click()
	}

	click_open_room() {
		this.elements.open_room()
			.should('be.visible')
			.click()
	}

	click_start_appointment() {
		this.elements.start_appointment()
			.should('be.visible')
			.click()
	}




}

export default appointmentsPage