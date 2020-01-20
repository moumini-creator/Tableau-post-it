window.addEventListener("load", event => new Base());

let isDown = false; // Its global for all app hold a bool
let mouseOffset = { x: 0, y: 0 }; // Define mouseOffset x and y at 0 

class Base {

	constructor() {
		console.log("loaded");

		this.initialize();
	}

	async initialize() {

		this.iospace = "baseapp"; // IO namespace for this app
		this.io = io.connect("http://localhost/" + this.iospace); // connect socket.io

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

}

class MyView extends View {

	constructor() {
		super();
	}

	initialize(mvc) {
		super.initialize(mvc);

		//name app
		this.name = document.createElement("div"); // Create div
		this.name.innerHTML = "Tableau des memoire"; // Add name
		this.name.classList.add("name"); // Add class css
		this.stage.appendChild(this.name); // Append to body

		this.div_postbut = document.createElement("div"); // Create div for input & button

		// create post-it form
		this.postit = document.createElement("input"); // Create input
		this.postit.id = "sendMemory"; // Give Id
		this.postit.classList.add("sendMemory"); // Add class
		this.div_postbut.appendChild(this.postit); // Append input to main div

		// button submit
		this.button_submit = document.createElement("button"); // Create button
		this.button_submit.innerHTML = "Ajoutez un titre"; // Add text
		this.button_submit.classList.add("button_submit"); // Add class css
		this.div_postbut.appendChild(this.button_submit); // Append button to main div

		this.stage.appendChild(this.div_postbut);  // Apppend button & input at body 

		this.div_postit = document.createElement("div"); // Create div for post-it 
		this.div_postit.classList.add("clearfix", "max_height"); // Add class css
		this.div_postit.id = "firstPost"; // Add id

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

	/* Newpost use to create and a post-it to the body */
	newPost(message) {

		let parent = document.getElementById("firstPost"); // Use to add a new element at good place

		let ContainAll = document.createElement("div"); // Create main container
		let DragAndDrop = document.createElement("div"); // Create div for drag and drop and title
		let newPostIt = document.createElement("textarea"); // Create textarea for add text
		let cross = document.createElement("span"); // Create span for close 

		/* Add class css */
		cross.classList.add("cross");
		ContainAll.classList.add("column"); 
		DragAndDrop.classList.add("draganddrop");
		newPostIt.classList.add("post");

		/* Add message and text */
		DragAndDrop.innerHTML = message;
		newPostIt.innerHTML = "Editez moi";
		cross.innerHTML = "&times;";

		/* Append all element create at DragAndDrop */
		DragAndDrop.appendChild(cross);
		DragAndDrop.appendChild(newPostIt);
		ContainAll.appendChild(DragAndDrop);
		ContainAll.appendChild(newPostIt);

		/** Prevents the elements from dispersing with each click to drag and drop 
		 *  /!\ Position absolute is IMPORTANT !
		*/
		ContainAll.style.position = "absolute";
		parent.appendChild(ContainAll); // Append all contain at parent

		this.stage.appendChild(parent); // Parent append to body

		/**
		 * Cross wait to click for remove
		 */
		cross.addEventListener("click", (e) => {
			this.closePost(e, ContainAll);
		});

		/**
		 * Contain wait to mouse down (click left hold) and callback to onMouseDown
		 */
		ContainAll.addEventListener("mousedown", (e) => {
			this.onMouseDown(e, ContainAll);
		});

		/**
		 * Contain wait to mouse down (click left hold and move) and callback to onMouseMove
		 */
		ContainAll.addEventListener("mousemove", (e) => {
			this.onMouseMove(e, ContainAll);
		});

		/**
		 * Contain wait to mouse up (click left release) and callback to onMouseUp
		 */
		ContainAll.addEventListener("mouseup", () => {
			this.onMouseUp();
		});

	}

	/**
	 * closePost response at addeventlistener Click at cross event
	 */
	closePost(e, item) {
		
		if (item.parentNode) {
			item.parentNode.removeChild(item); // Delete the post-it
		}

	}

	/**
	 * onMouseDown response at addeventlistener mousedown at ContainAll event
	 */
	onMouseDown(e, item) {

		/*
		* isDown takes true to be able 
		* to activate the displacement
		*/
		isDown = true;

		/*
		* Calcule the mouse position relation to the element  
		*/ 
		mouseOffset = {
			x: item.offsetLeft - e.clientX, // Horizontal
			y: item.offsetTop - e.clientY // Vertical
		};

	}

	/**
	 * onMouseDown response at addeventlistener mousemove at ContainAll event
	 */
	onMouseMove(e, item) {
		
		if (isDown) { // isDown have true
			
			// Modify margin left/top of element to displace
			item.style.marginLeft = e.clientX + mouseOffset.x + "px"; 
			item.style.marginTop = e.clientY + mouseOffset.y - 150 + "px"; // "mouseOffset.y - 150" allows the mouse pointer to click in the right place

		}

	}

	/**
	 * onMouseDown response at addeventlistener mouseup at ContainAll event
	 */
	onMouseUp() {

		isDown = false; // isDown takes false to be disable mouse move
	
	}

	addListeners() {

		this.postItSetting = () => this.updateTXT(); // postItSetting call the function 
		this.button_submit.addEventListener("click", this.postItSetting); // button_submit trigger click

	}

	removeListeners() {

		this.button_submit.removeEventListener("click", this.postItSetting); // remove listener

	}

	updateTXT() {

		var message = document.getElementById("sendMemory"); // take id 
		this.newPost(message.value.toString()); // take message et give it to newPost()
		message.value = ""; // replace by empty

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