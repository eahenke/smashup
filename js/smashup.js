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

	self.valid = ko.observable(undefined);

	self.setList = ko.observableArray([]);

	sets.forEach(function(set) {
		self.setList().push(new Set(set));
	});

	var selectedSets = [];
	self.playerList = ko.observableArray([]);

	self.generate = function() {
		//resets
		selectedSets = [];
		self.playerList([]);

		self.getSets();
		self.getPlayers();

		if(validate()) {
			self.valid(true);
			self.getCards();			
		} else {
			self.valid(false);
			console.log('not enough sets');
		}
	}
	
	
	self.getPlayers = function() {
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

	self.getSets = function() {
		var setBoxes = document.querySelectorAll('.sets > input:checked');
		for(var i = 0; i < setBoxes.length; i++) {
			var setName = setBoxes[i].name;
			selectedSets.push(getSetByName(setName));
		}
	}

	self.getCards = function() {
		var factionList = [];
		selectedSets.forEach(function(set) {
	 		factionList = factionList.concat(set.factions());
		});

		for(var i = 0; i < 2; i++) {
			self.playerList().forEach(function(player){
				var faction = getRandom(factionList);
				player.factions.push(faction);				
				//cut faction so it can't be chosen again
				remove(faction, factionList);
			});
		}
	};

	function validate() {
		var factionNum = 0;
		selectedSets.forEach(function(set) {
			factionNum += set.factions().length;
		});
		
		if(factionNum / 2 >= self.playerList().length) {
			return true;
		} else {
			return false;
		}

	}

	// Helper functions

	function getSetByName(name) {
		for(var i = 0; i < self.setList().length; i++) {
			if(self.setList()[i].name() == name) {
				return self.setList()[i];
			}
		}
	}

	function getRandom(items) {
		var item = items[Math.floor(Math.random() * items.length)];
		return item;
	}

	function remove(el, array) {
		var index = array.indexOf(el);
		if(index > -1) {
			array.splice(index, 1);
		}
	}


}

ko.applyBindings(new ViewModel());