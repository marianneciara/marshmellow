import './scss/main.scss';
import 'bootstrap';
import favicon16 from 'images/favicon-16x16.png';
import favicon32 from 'images/favicon-32x32.png';
import sharingImage from 'images/marshmellow-social.jpg';
import logo from 'images/marshmellow-logo.png';
import backgroundImage from 'images/background-image.jpg';
import iconCheckmark from 'images/icon-checkmark.png';
import iconRefresh from 'images/icon-refresh.png';
import data from './data/data';
import Data from './js/models/Data';
import Email from './js/models/Email';
import Hash from './js/models/Hash';
import * as contentView from './js/views/contentView';
import { elements } from './js/base';

/**
 * Global State
 * - Data: All available content
 * - Current Hash: A hash corresponding to the combination of options selected in the UI
 * - Hash Lookup: A map of unique hashes and the IDs of their matching content elements
 * - Email: Stores the structure of the selected matching email
 */
const state = {};

/**
 * DATA CONTROLLER
 */
const controlData = () => {
    // Create new data object based on imported JSON file, then generate hash lookup
    state.data = new Data(data);
    state.hashLookup = state.data.createHashLookup();
};

/**
 * CONTENT CONTROLLER
 */
const controlContent = () => {
    contentView.renderLoader();

    // Scan checked options, return object with selected options
    const contentObj = contentView.scanOptions();

    // Create new Hash object, execute generateHash function and store it in state
    const objectToHash = new Hash(contentObj);
    state.currentHash = objectToHash.generateHash();

    // Prepare UI for new email to render
    contentView.clearLoader();
    contentView.clearEmail();
    contentView.resetCopyButton();

    // Look up content matches in hashLookup map
    const hashMatches = state.data.getHashMatches(state.currentHash);

    if (hashMatches) {
        // Sort through matching content, randomly select option for each section, return clean object
        const emailObj = state.data.generateMatchObj(...hashMatches);

        state.email = new Email(emailObj);
        contentView.renderEmail(state.email);
    } else {
        contentView.noMatches();
    }
};

/**
 * EVENT LISTENER: ON LOAD
 */
window.addEventListener('load', () => {   
    // Page animation on load
    contentView.animateOnLoad();

    // Create hashLookup element
    controlData();
    
    // Populate active radio options
    contentView.populateOptions();

    // Scan options and generate content
    controlContent();
});

/**
 * EVENT LISTENER: RADIO BUTTONS
 */
document.querySelector('.mw-option-list, .mw-option-list *').addEventListener('click', event => {
    if (event.target.matches('input')) {
        // Scan options and generate content
        controlContent();
    }
});

/**
 * EVENT LISTENER: COPY TO CLIPBOARD
 */
document.querySelector('.mw-email-buttons, .mw-email-buttons *').addEventListener('click', event => {
    event.preventDefault();
    
    if (event.target.matches('#btnCopy')) {
        // Execute copy to clipboard function
        state.email.copyToClipboard();

        // Activate Copy to Clipboard button
        contentView.activateCopyButton();
    }
})

/**
 * EVENT LISTENER: KEYDOWN (ACCESSIBILITY)
 * - Enable focus if using keyboard
 * - Allow the selection of options with the Enter key
 */
document.body.addEventListener('keydown', function(event) {
    // Add a specific class to the body element if a key is pressed
    contentView.isKeyboardUser();

    // Allow radio options to be selected with Enter key
    if (event.keyCode === 13 || event.keyCode === 32) {
        if (event.target.querySelector('input')) {
            const targetInput = event.target.querySelector('input');
            contentView.selectOption(targetInput);
            controlContent();
        }
    }
});