import { xorBy } from "lodash"
import { lang } from "moment"

class userSettingsPage {

	elements = {
		my_account: () => cy.get('#user-menu-trigger'),
        user_settings: () => cy.get('#user-menu-settings'),
        company_settings: () => cy.get('#user-settings-edit-company'),
        logout: () => cy.get('#user-menu-logout'),

        //user
        user_name: () => cy.get('#user-settings-name'),
        user_surname: () => cy.get('#user-settings-surname'),
        user_phone_code: () => cy.get('#user-phone-code'),
        user_phone: () => cy.get('#user-settings-phone'),
        user_tin: () => cy.get('#user-id-card-type'),
        user_language_menu: () => cy.get('#user-settings-language'),
        user_email: () => cy.get('#user-settings-email'),

        save_button: () => cy.get('#user-settings-save-button'),
        english: () => cy.get('#language-en'),

        //change_password
        change_password_button: () => cy.get('#user-change-password-button'),
        modal_title: () => cy.get('.MuiTypography-body1').eq(3),
        current_password: () => cy.get('#user-current-password'),
        new_password: () => cy.xpath('(//*[@id="user-password"])[2]'),
        new_password_confirm: () => cy.get('#user-password-check'),
        save_password_button: () => cy.get('#user-password-button-accept'),

        //errors
        current_password_error: () => cy.xpath('//*[@id="user-password"]/div[3]/div/div[2]/div/div[1]/div/div/p'),
        password_confirm_error: () => cy.xpath('//*[@id="user-password"]/div[3]/div/div[2]/div/div[2]/div/div[2]/div/div/p'),

        //company
        company_name: () => cy.get('#business-name'),
        company_tax: () => cy.get('#addSociedadCIF'),
        save_company_button: () => cy.xpath('(//*[@id="save-button"])[2]'),
        company_contact_email: () => cy.xpath('//*[@id="root"]/div/div[3]/div/div[2]/div/div[1]/div[2]/div/div/div[1]/div/div/div/div[1]/div[1]/div/div[4]/div/div/div/input'),
        company_language_menu: () => cy.get('#company-language-select'),
        company_language_english: () => cy.xpath('//*[@id="menu-Main language"]/div[3]/ul/li[2]'),

	}

	click_on_my_account() {
        this.elements.my_account()
            .should('be.visible')
            .click()
    }

    select_company_english_language() {
        this.elements.company_language_english()
            .should('be.visible')
            .click()
    }

    verify_company_language(language) {
        this.elements.company_language_menu()
            .should('contain', language)
    }

    click_on_company_language_menu() {
        this.elements.company_language_menu()
            .should('be.visible')
            .click()
    }

    verify_company_tax(tax) {
        this.elements.company_tax()
            .should('have.value', tax)
    }

    enter_company_contact_email(email) {
        this.elements.company_contact_email()
            .should('be.visible')
            .clear()
            .type(email)
            .should('have.value', email)
    }

    verify_company_contact_email(email) {
        this.elements.company_contact_email()
            .should('have.value', email)
    }

    enter_company_tax(tax) {
        this.elements.company_tax()
            .should('be.visible')
            .clear()
            .type(tax)
            .should('have.value', tax)
    }

    click_on_save_compay_button() {
        this.elements.save_company_button()
            .should('be.visible')
            .click()
    }

    enter_company_name(name) {
        this.elements.company_name()
            .should('be.visible')
            .clear()
            .type(name)
            .should('have.value', name)
    }

    verify_company_name(name) {
        this.elements.company_name()
            .should('have.value', name)
    }

    click_on_company_settings() {
        this.elements.company_settings()
            .should('be.visible')
            .click()
        cy.url()
            .should('include', '/settings')
    }

    verify_existing_confirm_password_error() {
        this.elements.password_confirm_error()
            .should('be.visible')
    }

    verify_existing_current_password_error() {
        this.elements.current_password_error()
            .should('be.visible')
    }

    click_on_logout() {
        this.elements.logout()
            .should('be.visible')
            .click()
        cy.url()
            .should('include', '/admin')
    }

    click_on_save_password() {
        this.elements.save_password_button()
            .should('be.visible')
            .click()
            .wait(2000)
    }

    enter_new_password_confirm(new_password) {
        this.elements.new_password_confirm() 
            .type(new_password)
            .should('have.value', new_password)
        
    }

    enter_new_password(new_password) {
        this.elements.new_password()    
            .type(new_password)
            .should('have.value', new_password)
    }

    enter_current_password(password) {
        this.elements.current_password()
            .should('be.visible')
            .type(password)
            .should('have.value', password)
    }

    verify_modal_title(modal_title) {
        this.elements.modal_title()
            .should('contain', modal_title)
    }

    click_on_change_password() {
        this.elements.change_password_button()
            .should('be.visible')
            .click()
    }

    select_english_language() {
        this.elements.english()
            .should('be.visible')
            .click()
    }

    verify_english_language() {
        this.elements.user_language_menu()
            .should('contain', 'English')
    } 

    click_on_language_menu() {
        this.elements.user_language_menu()
            .should('be.visible')
            .click()
    }

    click_on_save() {
        this.elements.save_button()
            .should('be.visible')
            .click()
    }

    enter_user_name(name) {
        this.elements.user_name()
            .should('be.visible')
            .clear()
            .type(name)
            .should('have.value', name)
    }

    enter_user_surname(surname) {
        this.elements.user_surname()
            .should('be.visible')
            .clear()
            .type(surname)
            .should('have.value', surname)
    }

    enter_user_phone_code(phone_code) {
        this.elements.user_phone_code()
            .should('be.visible')
            .clear()
            .type(phone_code)
            .should('have.value', phone_code)
    }

    enter_user_phone(phone) {
        this.elements.user_phone()
            .should('be.visible')
            .clear()
            .type(phone)
            .should('have.value', phone)
    }

    enter_user_email(email) {
        this.elements.user_email()
            .should('be.visible')
            .clear()
            .type(email)
            .should('have.value', email)
    }

    click_on_user_settings() {
        this.elements.user_settings()  
            .should('be.visible')
            .click()
        cy.url()
            .should('include', '/user')
            .wait(2000)
    }

    verify_user_name(name) {
        this.elements.user_name()
            .should('have.value', name)
    }

    verify_user_surname(surname) {
        this.elements.user_surname()
            .should('have.value', surname)
    }

    verify_user_phone_code(phone_code) {
        this.elements.user_phone_code()
            .should('have.value', phone_code)
    }

    verify_user_phone(phone) {
        this.elements.user_phone()
            .should('have.value', phone)
    }

    verify_user_email(email) {
        this.elements.user_email()
            .should('have.value', email)
    }
	

	

}


export default userSettingsPage