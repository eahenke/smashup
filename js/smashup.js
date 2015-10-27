// TODO - validate input - make sure enough sets vs players
//make display of results dependent on a valid variable that sets to true when validate returns true


var sets = [
	{
		name: 'Base',
		factions: ['Pirates', 'Ninjas', 'Zombies', 'Robots', 'Dinosaurs', 'Wizards', 'Tricksters', 'Aliens'],
		checked: true,
	},

	{
		name: 'Awesome Level 9000',
		factions: ['Killer Plants', 'Ghosts', 'Steampunks', 'Bear Cavalry'],
	},

	{
		name: 'The Obligatory Cthulhu Set',
		factions: ['Cthulhu Cultists', 'Elder Things', 'Innsmouth', 'Miskatonic University'],
	},

	{
		name: 'Science Fiction Double Feature',
		factions: ['Time Travelers', 'Cyborg Apes', 'Super Spies', 'Shapeshifters'],
	},

	{
		name: 'Pretty Pretty Smash Up',
		factions: ['Fairies', 'Mythic Horses', 'Kitty Cats', 'Princesses'],
	},
]

var Set = function(set) {
	var self = this;
	self.name = ko.observable(set.name);
	self.factions = ko.observableArray(set.factions);
	self.checked = set.checked;
}

var Player = function(number) {
	var self = this;
	self.name = ko.observable('Player ' + number);
	self.factions = ko.observableArray([]);
}

var ViewModel = function() {
	var self = this;

	// Observables
	self.valid = {
		result: ko.observable(true),
		message: ko.observable(''),
	}

	self.playerList = ko.observableArray([]);
	self.setList = ko.observableArray([]);

	// Variables
	var selectedSets = [];




	// Methods

	// Main method, calls the methods that generate and assign factions and players
	// Bound to button
	self.generate = function() {
		//resets
		selectedSets = [];
		self.playerList([]);

		getSets();
		getPlayers();

		validate();

		// If choices are valid, generate random cards
		if(self.valid.result) {			
			getFactions();			
		}

		// If mobile, scroll to reveal results
		if($(window).width() < 800) {
			scrollToSection('.results');			
		}
	}
	
	// Private functions

	//Loop through model and create observable objects for card sets
	function initialize() {
		sets.forEach(function(set) {
			self.setList().push(new Set(set));
		});		
	}

	// Creates player objects for the desired number of players
	function getPlayers() {
		var playerNumb;
		var list = [];
		
		//Get number of players and push to observable array
		var playerRadios = document.getElementsByName('players');
		for(var i = 0; i < playerRadios.length; i++) {
			if(playerRadios[i].checked) {
				playerNumb = playerRadios[i].value;
			}
		}

		for(var i = 0; i < playerNumb; i++) {
			list.push(new Player(i + 1));
		}
		self.playerList(list);
	};

	// Pulls the sets selected by the user
	function getSets() {
		var setBoxes = document.querySelectorAll('.sets input:checked');
		for(var i = 0; i < setBoxes.length; i++) {
			var setName = setBoxes[i].name;
			selectedSets.push(getSetByName(setName));
		}
	}

	// Randomly assigns factions from the selected sets to players
	function getFactions() {
		var factionList = [];
		selectedSets.forEach(function(set) {
	 		factionList = factionList.concat(set.factions());
		});

		for(var i = 0; i < 2; i++) {
			self.playerList().forEach(function(player){
				var faction = getRandom(factionList);
				player.factions.push(faction);				
				
				//Cut faction so it can't be chosen again
				remove(faction, factionList);
			});
		}
	};

	/* Checks to make sure there are enough factions in the selected sets to support 
		the desired number of players.  If not, a message is set, alerting the maximum number
		of players.  Each player requires 2 factions */
	function validate() {
		var factionNum = 0;
		selectedSets.forEach(function(set) {
			factionNum += set.factions().length;
		});		
		var maxPlayers = Math.floor(factionNum / 2);
		
		if(factionNum / 2 >= self.playerList().length) {
			self.valid.result(true);
		} else {
			self.valid.result(false);
			self.valid.message('The selected sets do not have enough factions for the number of players.  The maximum number of players possible given the selected sets is ' + maxPlayers + '.  Please either choose more sets or fewer players.');
		}

	}

	// Helper functions

	//Retrieve set object by name
	function getSetByName(name) {
		for(var i = 0; i < self.setList().length; i++) {
			if(self.setList()[i].name() == name) {
				return self.setList()[i];
			}
		}
	}

	// Get random item from array
	function getRandom(array) {
		var item = array[Math.floor(Math.random() * array.length)];
		return item;
	}

	// Remove element from array
	function remove(el, array) {
		var index = array.indexOf(el);
		if(index > -1) {
			array.splice(index, 1);
		}
	}

	//Scroll to given section.  Section must be a valid CSS selector
	function scrollToSection(section) {
		$('html, body').animate({
    		scrollTop: $(section).offset().top
		}, 1000);
	}


	//Initialize
	initialize();
}

ko.applyBindings(new ViewModel());