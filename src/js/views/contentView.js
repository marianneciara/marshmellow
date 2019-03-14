import { elements } from '../base';

const elementLoaded = (...els) => {
    els.forEach(el => el.classList.add('loaded'));
};

export const renderLoader = () => {
    const loader = `
        <div class="mw-loader"></div>
    `;

    elements.emailCard.style.display = 'none';
    elements.emailButtons.style.display = 'none';

    elements.emailPanel.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector('.mw-loader');
    if (loader) {
        loader.parentElement.removeChild(loader);
        elements.emailCard.style.display = 'block';
        elements.emailButtons.style.display = 'flex';
    }
};

export const animateOnLoad = () => {
    const elsToAnimate = [
        elements.main,
        elements.header,
        elements.optionsList,
        elements.emailPanel,
    ];
    elementLoaded(...elsToAnimate);
};

export const populateOptions = () => {
    const firstRadioEls = Array.from(document.querySelectorAll('.mw-option-list-item .btn:first-child input'));
    
    firstRadioEls.forEach(cur => {
        selectOption(cur);
    });
};

export const selectOption = (el) => {
    el.checked = true;
    el.setAttribute('aria-checked', 'true');
    el.closest('.btn').classList.add('active');
};

export const unselectOption = (el) => {
    el.checked = false;
    el.setAttribute('aria-checked', 'false');
    el.closest('.btn').classList.remove('active');
};

export const setNextStepsSection = () => {
    const isSolutionFalse = document.querySelector('#solution_false:checked');
    const isSolutionTrue = document.querySelector('#solution_true:checked');
    const isNextStepsActive = document.querySelector('[name="nextSteps"]');

    // Check if Solution option is set to false and the Next Steps options section is visible
    if (isSolutionFalse && isNextStepsActive) {
        // Select and remove the nextSteps options element
        const nextStepsOptions = document.querySelector('[name="nextSteps"]').closest('.mw-option-list-item');
        nextStepsOptions.parentElement.removeChild(nextStepsOptions);
    } 
    
    // If Solution option set to true and Next Steps options section is not present, add back nextSteps options element
    else if (isSolutionTrue && !isNextStepsActive) {
        const markup = `
                <div class="mw-option-list-item">
                    <h2 class="mw-option-title" id="mw-option-5">Next Steps</h2>
                    <div class="mw-option-select btn-group btn-group-full-width" role="radiogroup" aria-labelledby="mw-option-5">
                        <label class="btn btn-primary" tabindex="0">
                            <input type="radio" name="nextSteps" id="next_steps_none" value="next_steps_none" />No action required
                        </label>
                        <label class="btn btn-primary" tabindex="0">
                            <input type="radio" name="nextSteps" id="next_steps_mine" value="next_steps_mine"/>I need to do something
                        </label>
                        <label class="btn btn-primary" tabindex="0">
                            <input type="radio" name="nextSteps" id="next_steps_theirs" value="next_steps_theirs"/>Customer action required
                        </label>
                    </div>
                </div>
            `;
        elements.optionsList.insertAdjacentHTML('beforeend', markup);

        // Select first radio box as per usual behavior on page load
        selectOption(document.querySelector('#next_steps_none'));
    }    
}

export const scanOptions = () => {
    // Show/Hide Next Steps options depending on whether Solution set to true/false
    setNextStepsSection();

    // Scan all checked and unchecked radio inputs
    const checkedEls = Array.from(document.querySelectorAll('.btn input:checked'));
    const uncheckedEls = Array.from(document.querySelectorAll('.btn input:not(:checked)'));

    // Loop through each array, updating classes and accessibility attributes
    uncheckedEls.forEach(el => unselectOption(el));
    checkedEls.forEach(el => selectOption(el));

    // Return an object of the selected options, ready to generate hash
    const optionsObj = {};
    checkedEls.forEach(cur => optionsObj[cur.name] = cur.value);

    return optionsObj;
};

export const clearEmail = () => {
    document.querySelector('.mw-email-card').innerHTML = '';
};

export const renderEmail = (obj) => {
    let markup;

    for (let section in obj) {
        if (obj[section]) {
            markup = `
                ${markup ? markup : ''}<p class="mw-email-${section}">${obj[section]}</p>
            `;
        } else {
            if (section !== 'nextSteps') {
                markup = `
                    ${markup ? markup : ''}<p class="mw-no-results">Sorry, looks like we're missing a ${section} section for this combination of options. Shoot us an <a href="mailto:hello@seaholmdigital.com?subject=Marshmellow:%20Missing%20Content%20(Section: ${section})">email</a> and we'll get that fixed.</p>
                `;
            }
            
        }
    }

    elements.emailCard.insertAdjacentHTML('beforeend', markup);
};

export const activateCopyButton = () => {
    if (!elements.copyButton.classList.contains('active')) {
        elements.copyButton.classList.add('active');
        elements.copyButton.innerHTML = 'Copied';
    }
};

export const resetCopyButton = () => {
    if (elements.copyButton.classList.contains('active')) {
        elements.copyButton.classList.remove('active');
        elements.copyButton.innerHTML = 'Copy to Clipboard<span></span>';
    }
};

export const noMatches = () => {
    let markup;
    markup = `
        <p class="mw-no-results">Sorry, we have no matching content for this combination of options. Shoot us an <a href="mailto:hello@seaholmdigital.com">email</a> and we'll get that fixed.</p>
    `;

    elements.emailCard.insertAdjacentHTML('beforeend', markup);
};

export const isKeyboardUser = () => {
    document.body.classList.add('user-tab');
};