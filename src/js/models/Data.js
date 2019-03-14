import Hash from './Hash';

export default class Data {
    constructor(obj) {
        this.data = obj;
    }

    createHashLookup() {
        const hashLookup = new Map();

        this.data.forEach((el, i) => {
            // Cartesian product of all options
            const flatten = (arr) => [].concat.apply([], arr);

            const product = (...sets) => {
                return sets.reduce((acc, set) => {
                return flatten(acc.map(x => set.map(y => [ ...x, y ])))
                }, [[]]);
            };

            // Build a new object for each combination
            const contentObjs = product(el.options.tone, el.options.context, el.options.mood, el.options.solution, el.options.nextSteps).reduce((acc, options) => {
                let contentObj = {};
                contentObj.tone = options[0];
                contentObj.context = options[1];
                contentObj.mood = options[2];
                contentObj.solution = options[3];
                contentObj.nextSteps = options[4];
                return acc.concat(contentObj);
            }, []);

            // Loop through those objects and generate a unique hash for each, then sort them into the new hashLookup map
            contentObjs.forEach(contentObj => {
                const hashContentObj = new Hash(contentObj);

                // Generate unique hash for that content object
                const contentHash = hashContentObj.generateHash();

                // Check if the hashLookup already contains that hash
                // When it doesn't, create an empty array and store the current content ID in it
                // When it does, push the current content ID to its existing array of IDs
                const contentIds = hashLookup.has(contentHash) ? hashLookup.get(contentHash) : [];
                contentIds.push(i);

                // Finally, set this hash in the hashLookup map
                hashLookup.set(contentHash, contentIds);
            });
        });

        this.hashLookup = hashLookup;

        return hashLookup;
    };

    getHashMatches(currentHash) {
        // Get array of IDs which match the current hash
        let contentMatches = this.hashLookup.get(currentHash);

        return contentMatches;
    };

    // Sort through matching content, randomly select option for each section
    generateMatchObj(...contentMatches) {
        // Create an array of the matching elements
        const contentMatchesArr = [];
        contentMatches.forEach((cur, i) => {
            contentMatchesArr.push(this.data[contentMatches[i]]);
        });

        // Create a clean object to sort content into
        const contentMatchesObj = {
            greeting: [],
            intro: [],
            body: [],
            nextSteps: [],
            closing: [],
            signature: []
        };

        // Loop through the matches array, sorting it into the new object according to which section it relates to
        contentMatchesArr.forEach((cur, i) => {
            if (contentMatchesArr[i].section == 'greeting') {
                contentMatchesObj.greeting.push(cur);
            } else if (contentMatchesArr[i].section == 'intro') {
                contentMatchesObj.intro.push(cur);
            } else if (contentMatchesArr[i].section == 'body') {
                contentMatchesObj.body.push(cur);
            } else if (contentMatchesArr[i].section == 'nextSteps') {
                contentMatchesObj.nextSteps.push(cur);
            } else if (contentMatchesArr[i].section == 'closing') {
                contentMatchesObj.closing.push(cur);
            } else if (contentMatchesArr[i].section == 'signature') {
                contentMatchesObj.signature.push(cur);
            }
        });

        // Loop through the object of matches, randomly select a match for each email section, return object
        let emailObject = {};
        for (let section in contentMatchesObj) {
            let randomIndex = Math.floor(Math.random() * contentMatchesObj[section].length);
            let selectedIndex = randomIndex;

            if (contentMatchesObj[section].length > 0) {
                emailObject[section] = contentMatchesObj[section][selectedIndex].content;
            }
        }

        return emailObject;
    }
}