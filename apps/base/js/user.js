window.addEventListener("load", event => new Base());

class Base {

	constructor() {
		console.log("loaded");

		this.initialize();
	}

	async initialize() {

		this.iospace = "baseapp"; // IO namespace for this app
		this.io = io.connect("http://localhost/" + this.iospace); // connect socket.io
		this.io.on("connect", () => this.onIOConnect()); // listen connect event

		this.mvc = new MVC("myMVC", this, new MyModel(), new MyView(), new MyController()); // init app MVC
		await this.mvc.initialize(); // run init async tasks
		this.mvc.view.attach(document.body); // attach view
		this.mvc.view.activate(); // activate user interface

	}
}

class MyModel extends Model {

	constructor() {
		super();
	}

	async initialize(mvc) {
		super.initialize(mvc);

	}
	
	// Try : Send data to server
	async connect(data){
		trace("get post");
		this.mvc.app.io.emit("register", data);
		data.forEach((key, value) => {
			console.log(value + " " + key);
		});
	}

	// Try : Register
	async register(data){
		trace("get post");
		this.mvc.app.io.emit("register", data);
	}

	// Try : Receive answer to server
	receive_register(){
		trace("send it to controller");
		this.mvc.app.io.on("return_register", msg => this.receive_msg(msg)); // Listen and send to receive_msg
	}

	// Try : Send to controller
	receive_msg(){
		trace("Message", msg);
		this.mvc.controller.io_message(msg);
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
		this.navbar = document.createElement("nav"); // Create navbar
		this.navbar.innerHTML = "Tableau des memoire"; // Add title
		this.navbar.classList.add("navbar", "color_text", "text_center", "font_24", "text_navbar"); // Add class css
		this.stage.appendChild(this.navbar); // Append to body
		
		// Presentation
		this.welcome = document.createElement("div");
		this.welcome.innerHTML = "Bienvenu !";
		this.welcome.classList.add("text_center", "font_32", "welcome");
		this.stage.appendChild(this.welcome);

		this.div_postbut = document.createElement("div"); // Create div contain button user
		this.div_postbut.classList.add("contain_button_user");

		this.postbut_div = document.createElement("div"); // Create div main

		// button suscribe
		this.button_suscribe = document.createElement("button");
		this.button_suscribe.innerHTML = "Inscription !";
		this.button_suscribe.classList.add("button"); // Add class css
		this.div_postbut.appendChild(this.button_suscribe);

		// button login
		this.button_log = document.createElement("button");
		this.button_log.innerHTML = "Se connecter";
		this.button_log.classList.add("button"); // Add class css
		this.div_postbut.appendChild(this.button_log);

		this.postbut_div.appendChild(this.div_postbut);  // Bind at body or stage
		this.stage.appendChild(this.postbut_div);

		/* FORM 1 */
		
		/* Main container */
		this.div_form_main_connect = document.createElement("div"); 
		this.div_form_main_connect.id = "form_modal_connect";
		this.div_form_main_connect.classList.add("modal");


		this.div_subcontainer_cross = document.createElement("div");
		
		/* Cross to close */
		this.span_cross = document.createElement("span");
		this.span_cross.classList.add("close");
		this.span_cross.innerHTML = "&times;";

		/* Form with post methode */
		this.form_connect = document.createElement("form");
		this.form_connect.method = "post";
		this.form_connect.name = "form_connect";

		/* Contain all elements */
		this.div_form = document.createElement("div");
		this.div_form.classList.add("modal-content");
		
		/* Container for label name */
		this.div_subcontainer_label_name = document.createElement("div");
		this.div_subcontainer_label_name.style.marginTop = 50 + "px";
		
		/* Label */
		this.div_form_label_name = document.createElement("label");
		this.div_form_label_name.innerHTML = "Nom d'utilisateur";
		
		/* Input for name with placeholder */
		this.div_form_input_name = document.createElement("input");
		this.div_form_input_name.type = "text";
		this.div_form_input_name.name = "form_name";
		this.div_form_input_name.placeholder = "Entrer le nom d'utilisateur";
		
		/* Container label and input password*/
		this.div_subcontainer_label_password = document.createElement("div");
		
		/* Label for password */
		this.div_form_label_password = document.createElement("label");
		this.div_form_label_password.innerHTML = "Mots de passe";

		/* Input for password with placeholder */
		this.div_form_input_password = document.createElement("input");
		this.div_form_input_password.type = "password";
		this.div_form_input_password.name = "form_password";
		this.div_form_input_password.id = "form_password_id";
		this.div_form_input_password.placeholder = "Entrer le mot de passe";

		/* Container for button */
		this.div_subcontainer_button_submit = document.createElement("div");
		this.div_form_button_submit = document.createElement("button");
		this.div_form_button_submit.classList.add("button");
		this.div_form_button_submit.innerHTML = "Connexion";

		/* Contain element cross */
		this.div_subcontainer_cross.appendChild(this.span_cross);

		/* Contain label & input name */
		this.div_subcontainer_label_name.appendChild(this.div_form_label_name);
		this.div_subcontainer_label_name.appendChild(this.div_form_input_name);
		
		/* Contain label & input password */
		this.div_subcontainer_label_password.appendChild(this.div_form_label_password);
		this.div_subcontainer_label_password.appendChild(this.div_form_input_password);

		/* Contain button submit */
		this.div_subcontainer_button_submit.appendChild(this.div_form_button_submit);

		/* Cross append to div */
		this.div_form.appendChild(this.div_subcontainer_cross);

		/* LABEL & INPUT append to div */
		this.div_form.appendChild(this.div_subcontainer_label_name);
		
		/* LABEL &  PASSWORD append to div */
		this.div_form.appendChild(this.div_subcontainer_label_password);

		/* BUTTON SUBMIT append to div */
		this.div_form.appendChild(this.div_subcontainer_button_submit);

		/* Div append to form connect */
		this.form_connect.appendChild(this.div_form);

		/* Contain all modal */
		this.div_form_main_connect.appendChild(this.form_connect);

		/* MODAL FORM TO BODY */
		this.stage.appendChild(this.div_form_main_connect);

		/* FORM 2 we operate in the same way as for form one */

		this.div_form_main_suscribe = document.createElement("div");
		this.div_form_main_suscribe.id = "form_modal_suscribe";
		this.div_form_main_suscribe.classList.add("modal");

		this.div_subcontainer_cross_suscribe = document.createElement("div");
		this.span_cross_suscribe = document.createElement("span");
		this.span_cross_suscribe.classList.add("close");
		this.span_cross_suscribe.innerHTML = "&times;";

		this.div_form_suscribe = document.createElement("div"); // Div contain all element to suscribe
		this.div_form_suscribe.classList.add("modal-content");

		this.form_suscribe = document.createElement("form"); // Form of suscribe
		this.form_suscribe.method = "post";
		this.form_suscribe.name = "form_suscribe";

		this.div_subcontainer_label_form_suscribe = document.createElement("div"); // Div contain label		
		this.div_subcontainer_label_form_suscribe.style.marginTop = 50 + "px";
		this.div_form_label_name_suscribe = document.createElement("label"); // label name of suscribe
		this.div_form_label_name_suscribe.innerHTML = "Nom d'utilisateur";		

		this.div_subcontainer_name_form_suscribe = document.createElement("div"); // DiSuscribe		
		this.div_form_input_name_suscribe = document.createElement("input"); // input suscribe
		this.div_form_input_name_suscribe.name = "name_suscribe"; // input suscribe
		this.div_form_input_name_suscribe.type = "text"; // input suscribe
		this.div_form_input_name_suscribe.placeholder = "Entrer le nom d'utilisateur";

		this.div_subcontainer_email_form_suscribe = document.createElement("div"); //	
		this.div_form_label_email_suscribe = document.createElement("label"); // label email of suscribe
		this.div_form_label_email_suscribe.innerHTML = "E-mail";		

		this.div_form_input_email_suscribe = document.createElement("input"); // input suscribe
		this.div_form_input_email_suscribe.name = "suscribe_email";	// Div contain input email
		this.div_form_input_email_suscribe.type = "email";
		this.div_form_input_email_suscribe.placeholder = "Entrer votre e-mail";

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
		this.div_form_button_submit_suscribe.classList.add("button");
		this.div_form_button_submit_suscribe.innerHTML = "Inscription";

		this.div_subcontainer_cross_suscribe.appendChild(this.span_cross_suscribe);

		this.div_subcontainer_label_form_suscribe.appendChild(this.div_form_label_name_suscribe);
		this.div_subcontainer_label_form_suscribe.appendChild(this.div_form_input_name_suscribe);

		this.div_subcontainer_email_form_suscribe.appendChild(this.div_form_label_email_suscribe);
		this.div_subcontainer_email_form_suscribe.appendChild(this.div_form_input_email_suscribe);

		this.div_subcontainer_password_form_suscribe.appendChild(this.div_form_label_password_suscribe);
		this.div_subcontainer_password_form_suscribe.appendChild(this.div_form_input_password_suscribe);

		this.div_subcontainer_password_2_form_suscribe.appendChild(this.div_form_label_password_2_suscribe);
		this.div_subcontainer_password_2_form_suscribe.appendChild(this.div_form_input_password_2_suscribe);

		this.div_subcontainer_submit_form_suscribe.appendChild(this.div_form_button_submit_suscribe);
		
		this.div_form_suscribe.appendChild(this.div_subcontainer_cross_suscribe);

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
		
		/**
		 * Use div_form_button_submit for call btn_connect(e)
		 */
		this.getBtnSHandler = e => this.btn_connect(e);
		this.div_form_button_submit.addEventListener("click", this.getBtnSHandler);

		/**
		 * Use div_form_button_submit_suscribe for call btn_suscribe(e)
		 */
		this.Btn_suscribe = e => this.btn_suscribe(e);
		this.div_form_button_submit_suscribe.addEventListener("click", this.Btn_suscribe);
		
		// Open modal connect
		this.modal_open_connect = e => this.open_modal_connect(e);
		this.button_log.addEventListener("click", this.modal_open_connect);

		// Open modal suscribe
		this.modal_open_suscribe = e => this.open_modal_suscribe(e);
		this.button_suscribe.addEventListener("click", this.modal_open_suscribe);

		// Close both modal
		this.modal_close_handler = e => this.close_modal(e);

		// Modal Connect & Suscribe
		this.span_cross.addEventListener("click", this.modal_close_handler);
		this.span_cross_suscribe.addEventListener("click", this.modal_close_handler);


	}

	removeListeners() {

		this.div_form_button_submit.addEventListener("click", this.getBtnSHandler);
		this.div_form_button_submit_suscribe.addEventListener("click", this.Btn_suscribe);
		this.button_log.addEventListener("click", this.modal_open_connect);
		this.button_suscribe.addEventListener("click", this.modal_open_suscribe);
		this.span_cross.addEventListener("click", this.modal_close_handler);
		this.span_cross_suscribe.addEventListener("click", this.modal_close_handler);

	}

	open_modal_connect(){
		
		document.getElementById('form_modal_connect').style.display ='block'; // Add class css to open modal
	
	}

	open_modal_suscribe(){
		
		document.getElementById('form_modal_suscribe').style.display ='block'; // Add class css to open modal
	
	}

	close_modal(){
		
		/**
		 * Add class css to close both modal
		 */
		document.getElementById('form_modal_connect').style.display ='none'; 
		document.getElementById('form_modal_suscribe').style.display ='none';
	
	}

	btn_connect() {
	
		this.mvc.controller.btn_connect_send("post"); // dispatch

	}

	btn_suscribe() {
	
		this.mvc.controller.btn_suscribe_send("post"); // dispatch
	
	}

}

class MyController extends Controller {

	constructor() {
		super();
	}

	initialize(mvc) {

		super.initialize(mvc);

	}

	btn_connect_send(params){

		// Create a map
		let authentification_user = new Map();
		trace("send data", params);

		// Get element values
		let name = this.mvc.view.div_form_input_name.value;
		let pass = this.mvc.view.div_form_input_password.value;
		
		// Set a map
		authentification_user.set(name, pass);
		
		// Send it to Model
		this.mvc.model.connect(authentification_user); 
	}

	btn_suscribe_send(params){
		
		trace("send", params);

		// Get all element value
		let name = this.mvc.view.div_form_input_name_suscribe.value;
		let email = this.mvc.view.div_form_input_email_suscribe.value;
		let psw = this.mvc.view.div_form_input_password_suscribe.value;
		let psw2 = this.mvc.view.div_form_input_password_2_suscribe.value;

		// Create object
		let create_user = [
			{ 
				name: name, 
				email: email, 
				password : psw, 
				password_2 : psw2 
			}
		]

		// Send it to model
		this.mvc.model.register(create_user);
	}

}