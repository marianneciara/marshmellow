export default class Email {
    constructor(obj) {
        this.greeting = obj.greeting;
        this.intro = obj.intro;
        this.body = obj.body;
        this.nextSteps = obj.nextSteps;
        this.closing = obj.closing;
        this.signature = obj.signature;
    }

    formatForClipboard(text) {
        // Array of regular expressions which need to be replaced
        const expressionsToReplace = [
            /<span class='mw-email-prompt'>/g,
            /<\/span>/g,
            /<br>/g
        ];

        expressionsToReplace.forEach(el => {
            text = text.replace(el, '');
        });

        return text;
    }

    copyToClipboard() {
        // Create dummy textarea to allow copy to clipboard
        const el = document.createElement('textarea');

        // Collate text content, insert line breaks
        let copyText = '';
        for (let section in this) {
            copyText = copyText.concat(`${this[section] ? this[section] + '\r\n\r\n' : ''}`);
        }

        // Invoke formatForClipboard method to emove HTML tags
        el.value = this.formatForClipboard(copyText);   
        
        // Append textarea to document
        document.body.appendChild(el);

        // Check user agent due to different process for iOS
        const isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);

        if (isiOSDevice) {
            let editable = el.contentEditable;
            let readOnly = el.readOnly;
    
            el.contentEditable = true;
            el.readOnly = false;
    
            let range = document.createRange();
            range.selectNodeContents(el);
    
            let selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
    
            el.setSelectionRange(0, 999999);
            el.contentEditable = editable;
            el.readOnly = readOnly;
        } else {
            el.select();
        }

        // Execute copy command and remove dummy textarea
        document.execCommand('copy');
        document.body.removeChild(el);
    };
}