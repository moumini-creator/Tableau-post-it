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
	 */	
	onIOConnect() {
		trace("yay IO connected");
		this.io.on("dummy", packet => this.onDummyData(packet)); // listen to "dummy" messages
		this.io.emit("dummy", {value: "dummy data from client"}) // send test message
	}

	/**
	 * @method onDummyData : dummy data received from io server
	 * @param {Object} data 
	 */
	onDummyData(data) {
		trace("IO data", data);
		this.mvc.controller.ioDummy(data); // send it to controller
	}

}

class MyModel extends Model {

	constructor() {
		super();
	}

	async initialize(mvc) {
		super.initialize(mvc);

	}

	async data() {
		trace("get data");
		// keep data in class variable ? refresh rate ?
		let result = await Comm.get("data"); // wait data from server
		console.log(result.response);
		return result.response; // return it to controller
	}

	async post(){
		trace("get post");
		let result = await Comm.get("post");
		console.log(result.response);
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

		// create get test btn
		this.btn = document.createElement("button");
		this.btn.innerHTML = "get test";
		this.stage.appendChild(this.btn);

		// create io test btn
		this.iobtn = document.createElement("button");
		this.iobtn.innerHTML = "io test";
		this.stage.appendChild(this.iobtn);

		// io random value display
		this.iovalue = document.createElement("div");
		this.iovalue.innerHTML = "no value";
		this.stage.appendChild(this.iovalue);

		//name app
		this.name = document.createElement("div");
		this.name.innerHTML = "Tableau des souvenirs"; // Name
		this.name.classList.add("name"); // Add class css
		this.stage.appendChild(this.name);

		// create post-it form
		this.postit = document.createElement("input");
		this.postit.id = "sendMemory";
		this.stage.appendChild(this.postit);

		// button submit
		this.btnS = document.createElement("button");
 		this.btnS.innerHTML = "Submit";
		this.stage.appendChild(this.btnS);		

		// create post-it
		this.postit = document.createElement("textarea");
		this.postit.id = "1";
		this.stage.appendChild(this.postit);

		// get dataset display
		this.table = document.createElement("table");
		this.stage.appendChild(this.table);
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
		this.getBtnHandler = e => this.btnClick(e);
		this.btn.addEventListener("click", this.getBtnHandler);

		this.getBtnSHandler = e => this.btnSClick(e);
		this.btnS.addEventListener("click", this.getBtnSHandler);

		this.ioBtnHandler = e => this.ioBtnClick(e);
		this.iobtn.addEventListener("click", this.ioBtnHandler);
	}

	removeListeners() {
		this.btn.removeEventListener("click", this.getBtnHandler);
		this.btnS.removeEventListener("click", this.getBtnSHandler);
		this.iobtn.removeEventListener("click", this.ioBtnHandler);
	}

	btnSClick(event) {
		this.mvc.controller.btnSWasClicked("post"); // dispatch
	}

	btnClick(event) {
		this.mvc.controller.btnWasClicked("more parameters"); // dispatch
	}

	ioBtnClick(event) {
		this.mvc.controller.ioBtnWasClicked("io parameters"); // dispatch
	}

	update(data) {
		while(this.table.firstChild) this.table.removeChild(this.table.firstChild); // empty table
		data.forEach(el => { // loop data
			let line = document.createElement("tr"); // create line
			Object.keys(el).forEach(key => { // loop object keys
				let cell = document.createElement("td"); // create cell
				cell.innerHTML = el[key]; // display
				line.appendChild(cell); // add cell
			});
			this.table.appendChild(line); // add line
		});
	}

	updateIO(value) {
		this.iovalue.innerHTML = value.toString(); // update io display
	}

	updateTXT() {
		let message = document.getElementById("sendMemory"); // take id 
		this.postit.innerHTML = message.value.toString(); // take a message and update io display
		message.value = "";
		//this.postit.innerHTML = v.toString(); // update io display
	}

	addnewpost(){
		
	}

	memories(value) {
		this.postit.innerHTML = value.toString(); // update io display
	}
}

class MyController extends Controller {

	constructor() {
		super();
	}

	initialize(mvc) {
		super.initialize(mvc);

	}

	async btnWasClicked(params) {
		trace("btn click", params);
		this.mvc.view.update(await this.mvc.model.data()); // wait async request > response from server and update view table values
	}

	async btnSWasClicked(params) {
		trace("btn submit click", params);
		this.mvc.view.updateTXT(await this.mvc.model.post()); // wait async request > response from server and update view table values
		this.mvc.view.addnewpost();
	}


	async ioBtnWasClicked(params) {
		trace("io btn click", params);
		this.mvc.app.io.emit("dummy", {message: "dummy io click"}); // send socket.io packet
	}

	ioDummy(data) {
		this.mvc.view.updateIO(data.value); // io dummy data received from main app
	}

	memoriesIO(data) {
		this.mvc.view.memories(data.value); // io dummy data received from main app
	}

}