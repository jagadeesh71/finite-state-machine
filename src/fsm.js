class FSM {
	/**
	 * Creates new FSM instance.
	 * @param config
	 */
	constructor(config) {
		if (!config) {
			throw Error('Config is not provided');
		}
		this.config = config;
		this.states = this.config.states;
		this.activeStateName = config.initial;
		this.prevStates = [];
		this.nextStates = [];
	}

	/**
	 * Returns active state.
	 * @returns {String}
	 */
	getState() {
		return this.activeStateName;
	}

	/**
	 * Goes to specified state.
	 * @param state
	 */
	changeState(state) {
		if (!this.states[state]){
			throw Error('State doesn\'t exist');
		}
		this.prevStates.push(this.activeStateName);
		this.activeStateName = state;
		this.nextStates = [];
	}

	/**
	 * Changes state according to event transition rules.
	 * @param event
	 */
	trigger(event) {
		var currentState = this.states[this.activeStateName],
			newStateName = currentState.transitions[event];
		
		if (!newStateName){
			throw Error('Event doesn\'t exist');
		}
		this.changeState(newStateName);
	}

	/**
	 * Resets FSM state to initial.
	 */
	reset() {
		this.activeStateName = this.config.initial;
		this.prevStates = [];
		this.nextStates = [];
	}

	/**
	 * Returns an array of states for which there are specified event transition rules.
	 * Returns all states if argument is undefined.
	 * @param event
	 * @returns {Array}
	 */
	getStates(event) {
		var allStates = Object.keys(this.states),
		    possibleStates,
	            that = this;
		
		if (!event) {
			possibleStates = allStates;
		} else {
			possibleStates = allStates.filter(function(stateName) {
				return that.states[stateName].transitions[event];
			});
		}
		
		return possibleStates;
	}

	/**
	 * Goes back to previous state.
	 * Returns false if undo is not available.
	 * @returns {Boolean}
	 */
	undo() {
		var result = false,
		    state;
		
		if (this.prevStates.length) {
			this.nextStates.push(this.activeStateName);
			state = this.prevStates.pop();
			this.activeStateName = state;
			result = true;
		}
		
		return result;
	}

	/**
	 * Goes redo to state.
	 * Returns false if redo is not available.
	 * @returns {Boolean}
	 */
	redo() {
		var result = false,
		    state;
		if (this.nextStates.length) {
			state = this.nextStates.pop();
			this.activeStateName = state;
			this.prevStates.push(state);
			result = true;
		}
		
		return result;
	}

	/**
	 * Clears transition history
	 */
	clearHistory() {
               this.prevStates = [];
               this.nextStates = [];
   	}
}

module.exports = FSM;
