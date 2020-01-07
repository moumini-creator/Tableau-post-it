window.addEventListener("load", event => new Base());

class Base {

	constructor() {
		console.log("loaded");

		this.initialize();
	}

	async initialize() {

		this.iospace = "baseapp"; // IO namespace for this app
		this.io = io.connect("http://localhost/user.html" + this.iospace); // connect socket.io

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
		let result = await Comm.get("post");
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

		//name app
		this.name = document.createElement("div");
		this.name.innerHTML = "Tableau des souvenirs"; // Name
		this.name.classList.add("name"); // Add class css
		this.stage.appendChild(this.name);

		this.div_postbut = document.createElement("div"); // Create div for post-it

		// create post-it form
		this.postit = document.createElement("input");
		this.postit.id = "sendMemory";
		this.div_postbut.appendChild(this.postit);

		// button submit
		this.button_submit = document.createElement("button");
		this.button_submit.innerHTML = "Post-it !";
		this.button_submit.classList.add("button_submit"); // Add class css
		this.div_postbut.appendChild(this.button_submit);

		this.stage.appendChild(this.div_postbut);  // Bind at body or stage
		

		this.div_postit = document.createElement("div"); // Create div for post-it
		this.div_postit.classList.add("clearfix"); // Add class css
		this.div_postit.id = "tes";

		this.postIt = document.createElement("textarea"); // Create a post-it
		this.postIt.classList.add("post", "column"); // Add class css
		this.postIt.id = "new_post";

		this.div_postit.appendChild(this.postIt); // Bind at div
		
		this.stage.appendChild(this.div_postit); // Bind at body or stage
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

	newPost(){

		var parent = document.getElementById("tes");
		var new_post = document.getElementById("new_post");
		var newPostIt = document.createElement("textarea"); // Create a post-it
		newPostIt.classList.add("post", "column"); // Add class css
		parent.insertBefore(newPostIt, new_post); // Bind at div
		
	}

	addListeners() {

		this.getBtnSHandler = () => this.btnSClick();
		this.button_submit.addEventListener("click", this.getBtnSHandler);

		this.btnNewPost = () => this.postIt();
		this.button_submit.addEventListener("click", this.newPost);

	}

	removeListeners() {
		
		this.button_submit.removeEventListener("click", this.getBtnSHandler);
	
	}

	btnSClick() {
	
		this.mvc.controller.btnSWasClicked("post"); // dispatch
	
	}

	updateTXT() {

		var message = document.getElementById("sendMemory"); // take id 
		this.postIt.innerHTML = message.value.toString(); // take a message and print
		message.value = "";
	}
}

class MyController extends Controller {

	constructor() {
		super();
	}

	initialize(mvc) {

		super.initialize(mvc);

	}

	async btnSWasClicked(params) {

		trace("btn submit click", params);
		this.mvc.view.updateTXT(await this.mvc.model.post()); // wait async request > response from server and update view post it value
	
	}

}