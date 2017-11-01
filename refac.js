(function() {

    function State(name) {
        this.name = name;
        this.isInitial = false;
        this.isFinal = false;
    }
      
    function Transition(initState, simbol, finalState) {
        this.initState = initState;
        this.simbol = simbol;
        this.finalState = finalState;
    }
    
    function Automata() {
    
        this.description = null;
        this.language = null;
        this.states = [];
    
        this.transitions = [];
    
        // Setters
    
        this.setDescription = (value) => {
            this.description = value.trim();
            return this;
        }
    
        this.setLanguage = (value) => {
            this.language = value.trim();
            return this;
        }
    
        this.setStates = (value) => {
            
            value.forEach(state => {
                this.states.push(new State(state.trim()));
            })
            return this;
        }
    
        this.setInitialState = (value) => {
            
            let initState = this.states.find(state => {
                return state.name == value.trim();
            });
    
            initState.isInitial = true;
    
            return this;
        }
    
        this.setFinalStates = (value) => {
            
            value.forEach(item => {
                let finalState = this.states.find(state => {
                    return state.name == item.trim();
                });
    
                finalState.isFinal = true;
            });
    
            return this;
        }
    
        this.setTransitions = (value) => {
    
            value.forEach(item => {
                this.transitions.push(new Transition(item[0].trim(), item[1].trim(), item[2].trim()));
            });
    
            return this;
        }
    
        this.evalString = (value) => {
            
            let result = null;
            let string = Array.from(value);
    
            let currentState = this.states.find(state => {
                return state.isInitial == true;
            }).name;
    
            string.forEach(simbol => {
                
                for(let i = 0; i < this.transitions.length; i++){
                    if(this.transitions[i].initState === currentState &&
                        this.transitions[i].simbol === simbol) {
    
                        currentState = this.transitions[i].finalState;
                        break;
                    }
                }
            });
    
            result = this.states.find(state => {
                return state.name === currentState && state.isFinal;
            });
    
            if(result !== null)
                return true;
            else
                return false;
        }
    
        this.evalStrings = (value) => {
    
            let outputText = 'Lenguaje L: ' + this.description + '\n\n';
    
            value.forEach((item, index) => {
    
                outputText += 'Procesando cadena ' + (index + 1) + ': "' + item + '"' + '\n';
    
                let data = "";
                let result = null;
                let string = Array.from(item);
    
                let currentState = this.states.find(state => {
                    return state.isInitial == true;
                }).name;
    
                string.forEach(simbol => {
                    
                    for(let i = 0; i < this.transitions.length; i++){
                        if(this.transitions[i].initState === currentState &&
                            this.transitions[i].simbol === simbol) {
    
                            currentState = this.transitions[i].finalState;
                            outputText += '(' + this.transitions[i].initState + ', ' + this.transitions[i].simbol + ') => ' + this.transitions[i].finalState + '\n';
                            break;
                        }
                    }
                });
    
                result = this.states.find(state => {
                    return state.name === currentState && state.isFinal;
                });
    
                if(result !== undefined)
                    outputText += 'La cadena "' + item + '" pertenece al lenguaje L.' + '\n\n';
                else
                    outputText += 'La cadena "' + item + '" no pertenece al lenguaje L.' + '\n\n';
            });
    
            return outputText;
        }
    }
    
    let input = document.getElementById("upload");
    input.addEventListener("change", openFile);
    
    let output = document.getElementById("output");
    
    function openFile(event) {
    
        let input = event.target;
        let reader = new FileReader();
    
        reader.onload = () => {
    
            let text = reader.result;
            commands = text.split('\n');
    
            let automata = new Automata();
    
            let transitions = [];
            let strings = [];
    
            numberTrasitions = +commands[5].trim();
            for(let i = 0; i < numberTrasitions; i++) {
                let stringTrasitions = commands[6 + i];
                transitions.push(stringTrasitions.split(','));
            }
    
            let currentLine = 6 + numberTrasitions;
            let numberString = +(commands[currentLine].trim());
            currentLine = currentLine + 1;
    
            for(let i = 0; i < numberString; i++) {
                strings.push(commands[currentLine + i].trim());
            }
    
            let outputText = automata.setDescription(commands[0])
                            .setLanguage(commands[1])
                            .setStates(commands[2].split(','))
                            .setInitialState(commands[3])
                            .setFinalStates(commands[4].split(','))
                            .setTransitions(transitions)
                            .evalStrings(strings);
    
            output.value = outputText
        }
    
        reader.readAsText(input.files[0]);
    }
 })();
