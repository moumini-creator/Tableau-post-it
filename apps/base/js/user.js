window.addEventListener("load", event => new Base());

class Base {

	constructor() {
		console.log("loaded");

		this.initialize();
	}

	async initialize() {

		this.iospace = "baseapp"; // IO namespace for this app
		this.io = io.connect("http://localhost/user.html" + this.iospace); // connect socket.io
		//this.io.on("connect", () => this.onIOConnect()); // listen connect event

		this.mvc = new MVC("myMVC", this, new MyModel(), new MyView(), new MyController()); // init app MVC
		await this.mvc.initialize(); // run init async tasks
		this.mvc.view.attach(document.body); // attach view
		this.mvc.view.activate(); // activate user interface

	}

	/**
	 * @method test : test server GET fetch
	 */
	async test() {
		console.log("test server hello method");
		let result = await Comm.get("hello/everyone"); // call server hello method with argument "everyone"
		console.log("result", result);
		console.log("response", result.response);
	}

	/**
	 * @method onIOConnect : socket is connected
		
	onIOConnect() {
		trace("yay IO connected");
		this.io.on("dummy", packet => this.onDummyData(packet)); // listen to "dummy" messages
		this.io.emit("dummy", {value: "dummy data from client"}) // send test message
	}

	/**
	 * @method onDummyData : dummy data received from io server
	 * @param {Object} data 
	 
	onDummyData(data) {
		trace("IO data", data);
		this.mvc.controller.ioDummy(data); // send it to controller
	}
	*/
}

class MyModel extends Model {

	constructor() {
		super();
	}

	async initialize(mvc) {
		super.initialize(mvc);

	}

	async post(){
		trace("get post");
		let result = await Comm.get("suscribe");
		console.log(result);
		return result.response;
	}
	

}

class MyView extends View {

	constructor() {
		super();
		this.table = null;
	}

	initialize(mvc) {
		super.initialize(mvc);

		// Name app
		this.navbar = document.createElement("nav");
		this.navbar.innerHTML = "Tableau de memoire";
		this.navbar.classList.add("navbar", "color_text", "text_center", "font_24", "text_navbar"); // Add class css
		this.stage.appendChild(this.navbar);
		
		// Presentation
		this.welcome = document.createElement("div");
		this.welcome.innerHTML = "Bienvenu !"; // Name
		this.welcome.classList.add("text_center", "font_32", "welcome"); // Add class css
		this.stage.appendChild(this.welcome);

		this.div_postbut = document.createElement("div"); // Create div for post-it
		this.div_postbut.classList.add("contain_button_user");

		this.postbut_div = document.createElement("div"); // Create div for post-it

		// button suscribe
		this.button_suscribe = document.createElement("button");
		this.button_suscribe.innerHTML = "Inscription !";
		this.button_suscribe.classList.add("button"); // Add class css
		this.button_suscribe.addEventListener("click", () => {(document.getElementById('form_modal_suscribe').style.display ='block')}); // Add class css
		this.div_postbut.appendChild(this.button_suscribe);

		// button login
		this.button_log = document.createElement("button");
		this.button_log.innerHTML = "Se connecter";
		this.button_log.classList.add("button"); // Add class css
		this.button_log.addEventListener("click", () => {(document.getElementById('form_modal_connect').style.display ='block')}); // Add class css
		this.div_postbut.appendChild(this.button_log);

		this.postbut_div.appendChild(this.div_postbut);  // Bind at body or stage
		this.stage.appendChild(this.postbut_div);

		/* FORM 1 */
		this.div_form_main_connect = document.createElement("div");
		this.div_form_main_connect.id = "form_modal_connect";
		this.div_form_main_connect.classList.add("modal");
		this.form_connect = document.createElement("form");
		this.form_connect.method = "post";
		this.form_connect.name = "form_connect";

		this.div_form = document.createElement("div");
		this.div_form.classList.add("modal-content");
		
		this.div_subcontainer_label_name = document.createElement("div");
		this.div_form_label_name = document.createElement("label");
		this.div_form_label_name.innerHTML = "Nom d'utilisateur";
		
		this.div_form_input_name = document.createElement("input");
		this.div_form_input_name.type = "text";
		this.div_form_input_name.name = "form_name";
		this.div_form_input_name.placeholder = "Entrer le nom d'utilisateur";
		
		this.div_subcontainer_label_password = document.createElement("div");
		this.div_form_label_password = document.createElement("label");
		this.div_form_label_password.innerHTML = "Mots de passe";

		this.div_form_input_password = document.createElement("input");
		this.div_form_input_password.type = "password";
		this.div_form_input_password.name = "form_password";
		this.div_form_input_password.placeholder = "Entrer le mot de passe";

		this.div_subcontainer_button_submit = document.createElement("div");
		this.div_form_button_submit = document.createElement("button"); // Connect
		this.div_form_button_submit.type = "submit";
		this.div_form_button_submit.classList.add("button");
		this.div_form_button_submit.innerHTML = "Connexion";

		this.div_subcontainer_label_name.appendChild(this.div_form_label_name);
		this.div_subcontainer_label_name.appendChild(this.div_form_input_name);

		this.div_subcontainer_label_password.appendChild(this.div_form_label_password);
		this.div_subcontainer_label_password.appendChild(this.div_form_input_password);

		this.div_subcontainer_button_submit.appendChild(this.div_form_button_submit);

		/* LABEL & INPUT */
		this.div_form.appendChild(this.div_subcontainer_label_name);
		
		/* LABEL &  PASSWORD */
		this.div_form.appendChild(this.div_subcontainer_label_password);

		/* BUTTON SUBMIT */
		this.div_form.appendChild(this.div_subcontainer_button_submit);

		/* MODAL FORM TO BODY */
		this.form_connect.appendChild(this.div_form);
		this.div_form_main_connect.appendChild(this.form_connect);

		this.stage.appendChild(this.div_form_main_connect);

		/* FORM 2 */

		this.div_form_main_suscribe = document.createElement("div"); // Suscribe main div
		this.div_form_main_suscribe.id = "form_modal_suscribe";
		this.div_form_main_suscribe.classList.add("modal");

		this.div_form_suscribe = document.createElement("div"); // Div contain all element to suscribe
		this.div_form_suscribe.classList.add("modal-content");

		this.form_suscribe = document.createElement("form"); // Form of suscribe
		this.form_suscribe.method = "post";
		this.form_suscribe.name = "form_suscribe";

		this.div_subcontainer_label_form_suscribe = document.createElement("div"); // Div contain label		
		this.div_form_label_name_suscribe = document.createElement("label"); // label name of suscribe
		this.div_form_label_name_suscribe.innerHTML = "Nom d'utilisateur";		

		this.div_subcontainer_email_form_suscribe = document.createElement("div"); //	
		this.div_form_label_email_suscribe = document.createElement("label"); // label email of suscribe
		this.div_form_label_email_suscribe.innerHTML = "E-mail";		

		this.div_form_input_email_suscribe = document.createElement("input"); // input suscribe
		this.div_form_input_email_suscribe.name = "suscribe_email";	// Div contain input email
		this.div_form_input_email_suscribe.type = "email";
		this.div_form_input_email_suscribe.placeholder = "Entrer votre e-mail";

		this.div_subcontainer_name_form_suscribe = document.createElement("div"); // DiSuscribe		
		this.div_form_input_name_suscribe = document.createElement("input"); // input suscribe
		this.div_form_input_name_suscribe.name = "name_suscribe"; // input suscribe
		this.div_form_input_name_suscribe.type = "text"; // input suscribe
		this.div_form_input_name_suscribe.placeholder = "Entrer le nom d'utilisateur";

		this.div_subcontainer_password_form_suscribe = document.createElement("div"); // Suscribe		
		this.div_form_label_password_suscribe = document.createElement("label"); // label suscribe
		this.div_form_label_password_suscribe.innerHTML = "Mots de passe"; // Inner HTML
		this.div_form_input_password_suscribe = document.createElement("input");// Input password 
		this.div_form_input_password_suscribe.type = "password"; // Type password 
		this.div_form_input_password_suscribe.name = "password_suscribe"; // Type password 
		this.div_form_input_password_suscribe.placeholder = "Entrer le mot de passe";// Placeholder password 2 

		this.div_subcontainer_password_2_form_suscribe = document.createElement("div"); // Suscribe	password 2	
		this.div_form_label_password_2_suscribe = document.createElement("label"); // Label suscribe password 2
		this.div_form_label_password_2_suscribe.innerHTML = "Confirmation de passe"; // Inner HTML
		this.div_form_input_password_2_suscribe = document.createElement("input");// Input password 2
		this.div_form_input_password_2_suscribe.type = "password"; // Type password 2
		this.div_form_input_password_2_suscribe.name = "password_suscribe_2"; // Name password 2
		this.div_form_input_password_2_suscribe.placeholder = "Entrer le mot de passe";// Placeholder password 2

		this.div_subcontainer_submit_form_suscribe = document.createElement("div"); // Suscribe		
		this.div_form_button_submit_suscribe = document.createElement("button"); // button suscribe
		this.div_form_button_submit_suscribe.type = "submit";
		this.div_form_button_submit_suscribe.classList.add("button");
		this.div_form_button_submit_suscribe.innerHTML = "Inscription";

		this.div_subcontainer_label_form_suscribe.appendChild(this.div_form_label_name_suscribe);
		this.div_subcontainer_label_form_suscribe.appendChild(this.div_form_input_name_suscribe);

		this.div_subcontainer_email_form_suscribe.appendChild(this.div_form_label_email_suscribe);
		this.div_subcontainer_email_form_suscribe.appendChild(this.div_form_input_email_suscribe);

		this.div_subcontainer_password_form_suscribe.appendChild(this.div_form_label_password_suscribe);
		this.div_subcontainer_password_form_suscribe.appendChild(this.div_form_input_password_suscribe);

		this.div_subcontainer_password_2_form_suscribe.appendChild(this.div_form_label_password_2_suscribe);
		this.div_subcontainer_password_2_form_suscribe.appendChild(this.div_form_input_password_2_suscribe);

		this.div_subcontainer_submit_form_suscribe.appendChild(this.div_form_button_submit_suscribe);
		
		this.div_form_suscribe.appendChild(this.div_subcontainer_label_form_suscribe);

		this.div_form_suscribe.appendChild(this.div_subcontainer_email_form_suscribe);

		this.div_form_suscribe.appendChild(this.div_subcontainer_password_form_suscribe);

		this.div_form_suscribe.appendChild(this.div_subcontainer_password_2_form_suscribe);
		this.div_form_suscribe.appendChild(this.div_subcontainer_submit_form_suscribe);

		this.form_suscribe.appendChild(this.div_form_suscribe);
		this.div_form_main_suscribe.appendChild(this.form_suscribe);
		
		this.stage.appendChild(this.div_form_main_suscribe);

		/* FOOTER */

		this.footer = document.createElement("footer"); // Sticky footer
		this.footer_div = document.createElement("div");
		
		this.footer_div.innerHTML = "copyright";
		this.footer.classList.add("footer", "text_center", "color_text_black", "text_footer"); // Add class css

		this.footer.appendChild(this.footer_div);

		this.stage.appendChild(this.footer);
		
	}

	// activate UI
	activate() {

		super.activate();
		this.addListeners(); // listen to events

	}

	// deactivate
	deactivate() {

		super.deactivate();
		this.removeListeners();

	}

	addListeners() {

		
	}

	removeListeners() {
		
	
	}

	btnSClick() {
	
		this.mvc.controller.btnSWasClicked("post"); // dispatch
	
	}

}

class MyController extends Controller {

	constructor() {
		super();
	}

	initialize(mvc) {

		super.initialize(mvc);

	}

}