window.addEventListener("load", event => new Base());

let postID = 1;
let isDown = false;
let mouseOffset = {x: 0, y: 0};

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
		this.name.innerHTML = "Tableau des memoire"; // Name
		this.name.classList.add("name"); // Add class css
		this.stage.appendChild(this.name);

		this.div_postbut = document.createElement("div"); // Create div for post-it

		// create post-it form
		this.postit = document.createElement("input");
		this.postit.id = "sendMemory";
		this.postit.classList.add("sendMemory");
		this.div_postbut.appendChild(this.postit);

		// button submit
		this.button_submit = document.createElement("button");
		this.button_submit.innerHTML = "Post-it !";
		this.button_submit.classList.add("button_submit"); // Add class css
		this.div_postbut.appendChild(this.button_submit);

		this.stage.appendChild(this.div_postbut);  // Bind at body or stage

		this.ContainAll = document.createElement("div");
		this.ContainAll.id = "ContainAll"; // Add class css
		this.ContainAll.classList.add("column"); // Add class css

		// create span for drag and drop
		this.DragAndDrop = document.createElement("div");
		this.DragAndDrop.classList.add("draganddrop");
		this.DragAndDrop.id = 0;
		
		this.div_postit = document.createElement("div"); // Create div for post-it
		this.div_postit.classList.add("clearfix", "max_height"); // Add class css
		this.div_postit.id = "firstPost";

		this.postIt = document.createElement("textarea"); // Create a post-it
		this.postIt.classList.add("post"); // Add class css
		
		this.ContainAll.appendChild(this.DragAndDrop);
		this.ContainAll.appendChild(this.postIt); // Bind at div		
		this.div_postit.appendChild(this.ContainAll); // Bind at body or stage
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

		let parent = document.getElementById("firstPost");
		let new_post = document.getElementById("ContainAll");
		
		let ContainAllNew = document.createElement("div"); // Create a post-it
		let DragAndDropNew = document.createElement("div"); // Create a post-it
		let newPostIt = document.createElement("textarea"); // Create a post-it
		

		ContainAllNew.classList.add("column");
		DragAndDropNew.classList.add("draganddrop");

		DragAndDropNew.appendChild(newPostIt);
		ContainAllNew.appendChild(DragAndDropNew);
		ContainAllNew.appendChild(newPostIt);

		newPostIt.classList.add("post"); // Add class css
		DragAndDropNew.id = postID++;
		parent.insertBefore(ContainAllNew, new_post); // Bind at div
		
	}

	onMouseDown() {
		trace("1");
		isDown = true;

		console.log(event.target.id);

		mouseOffset = {
			x : this.stage.offsetLeft - event.clientX, 
			y : this.stage.offsetTop - event.clientY 
		};
	}
	
	onMouseMove() {
		trace("2");
		if(isDown){
			this.div_postit.style.left = event.clientX + mouseOffset.x + "px";
			this.div_postit.style.top = event.clientY + mouseOffset.Y + "px";
		}
	}

	onMouseUp() {
		trace("3");
		isDown = false;
	}

	addListeners() {

		//this.getBtnHandler = e => this.btnClick(e);
		//this.btn.addEventListener("click", this.getBtnHandler);
		

		this.postItSetting = () => this.newPost();
		this.button_submit.addEventListener("click", this.postItSetting);

		this.down = () => this.onMouseDown();
		this.div_postit.addEventListener("mousedown", this.down);

		this.move = () => this.onMouseMove();
		this.div_postit.addEventListener("mousemove", this.move);

		this.up = () => this.onMouseUp();
		this.div_postit.addEventListener("mouseup", this.up);
	}

	removeListeners() {
		
		this.button_submit.removeEventListener("click", this.postItSetting);
	
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