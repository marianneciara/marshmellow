export default class Hash {
    constructor(obj) {
        this.tone = obj.tone;
        this.context = obj.context;
        this.mood = obj.mood;
        this.solution = obj.solution;
        this.nextSteps = obj.nextSteps;
        this.optionsMap = Object.freeze({
            TONE: {
                FORMAL: 0,
                INFORMAL: 1
            },
            CONTEXT: {
                FIRST: 0,
                REPLY: 1
            },
            MOOD: {
                FRIENDLY: 0,
                UPSET: 1
            },
            SOLUTION: {
                SOLUTION_TRUE: 0,
                SOLUTION_FALSE: 1
            },
            NEXTSTEPS: {
                NEXT_STEPS_NONE: 0,
                NEXT_STEPS_MINE: 1,
                NEXT_STEPS_THEIRS: 2
            }
        });
    }

    generateHash() {
        // Set maximum options
        const maxOptions = 256;

        // Map the values of the passed object to the optionsMap values
        const toneId = this.tone ? this.optionsMap.TONE[this.tone.toUpperCase()] : undefined;
        const contextId = this.context ? this.optionsMap.CONTEXT[this.context.toUpperCase()] : undefined;
        const moodId = this.mood ? this.optionsMap.MOOD[this.mood.toUpperCase()] : undefined;
        const solutionId = this.solution ? this.optionsMap.SOLUTION[this.solution.toUpperCase()] : undefined;
        const nextStepsId = this.nextSteps ? this.optionsMap.NEXTSTEPS[this.nextSteps.toUpperCase()] : undefined;
    
        // Return a hash based on these values
        return (toneId ? (toneId * (Math.pow(maxOptions, 0))) : '0') + (contextId ? (contextId * (Math.pow(maxOptions, 1))) : '0') + (moodId ? (moodId * (Math.pow(maxOptions, 2))) : '0') + (solutionId ? (solutionId * (Math.pow(maxOptions, 3))) : '0') + (nextStepsId ? (nextStepsId * (Math.pow(maxOptions, 4))) : '0');
    };
}