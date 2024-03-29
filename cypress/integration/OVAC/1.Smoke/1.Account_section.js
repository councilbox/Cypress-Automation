import loginPage from "../pageObjects/loginPage";
import adminDashboard from "../pageObjects/adminDashboardPage";

let login = new loginPage();
let dashboard = new adminDashboard();

let url = Cypress.config().baseUrl;

import users from "/cypress/fixtures/OVAC/users.json";

describe("Account section", function() {
	before(function() {
		cy.clearLocalStorage();
	});

	it("The user is able to log in to the page", function() {
		cy.log("The user is able to open the browser and enter the URL: ");
		cy.visit(url + "/admin");
		cy.log("The user is able to enter the email address");
		login.enter_email(users.email);
		cy.log("The user is able to enter the password");
		login.enter_password(users.password);
		cy.log("The user is able to click on the Log in button");
		login.login_submit();
		cy.log("The user is successfully logged in");
		login.confirm_login();
	});

	it("The user is able to log out from the page ", function() {
		cy.log("Verify that user is logged in");
		login.confirm_login();
		cy.log("The user is successfully logged in");
		login.confirm_login();
		cy.log("The user is able to click on the Account icon");
		dashboard.click_user_icon();
		cy.log("The user is able to click on the Log out button");
		dashboard.click_logout();
		cy.log("User is logged out successfully");
		dashboard.confirm_logout();
	});
});
