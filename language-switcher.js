// Language switcher functionality
class LanguageSwitcher {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = {};
        this.languages = {
            'ar': 'العربية',
            'zh': '中文',
            'en': 'English',
            'fr': 'Français',
            'de': 'Deutsch',
            'hu': 'Magyar',
            'ig': 'Igbo',
            'ja': '日本語',
            'ko': '한국어',
            'lv': 'Latviešu',
            'pl': 'Polski',
            'pt': 'Português',
            'ru': 'Русский',
            'es': 'Español'
        };
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.createLanguageSwitcher();
        this.applyLanguage(this.currentLanguage);
        this.setupEventListeners();
    }

    async loadTranslations() {
        const languageCodes = Object.keys(this.languages);
        for (const lang of languageCodes) {
            try {
                const response = await fetch(`/translations/${lang}.json`);
                this.translations[lang] = await response.json();
            } catch (error) {
                console.error(`Failed to load ${lang} translations:`, error);
            }
        }
    }

    createLanguageSwitcher() {
        const nav = document.querySelector('.navbar .nav-container');
        
        if (!nav) {
            console.error('Navigation container not found!');
            return;
        }
        
        console.log('Found navigation container:', nav);
        
        // Create language switcher container
        const langContainer = document.createElement('div');
        langContainer.className = 'language-switcher';
        
        // Create language button
        const langButton = document.createElement('button');
        langButton.className = 'lang-btn';
        langButton.innerHTML = `
            <i class="fas fa-globe"></i>
            <span>${this.languages[this.currentLanguage]}</span>
            <i class="fas fa-chevron-down"></i>
        `;
        
        // Create dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'lang-dropdown';
        
        Object.entries(this.languages).forEach(([code, name]) => {
            const option = document.createElement('div');
            option.className = 'lang-option';
            option.dataset.lang = code;
            option.innerHTML = `
                <span>${name}</span>
                ${code === this.currentLanguage ? '<i class="fas fa-check"></i>' : ''}
            `;
            dropdown.appendChild(option);
        });
        
        langContainer.appendChild(langButton);
        langContainer.appendChild(dropdown);
        nav.appendChild(langContainer);
        
        console.log('Language switcher added to navigation');
        
        // Store references
        this.langButton = langButton;
        this.dropdown = dropdown;
    }

    setupEventListeners() {
        // Toggle dropdown
        this.langButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.dropdown.classList.remove('active');
        });

        // Language selection
        this.dropdown.addEventListener('click', (e) => {
            const option = e.target.closest('.lang-option');
            if (option) {
                const langCode = option.dataset.lang;
                this.changeLanguage(langCode);
            }
        });
    }

    changeLanguage(langCode) {
        this.currentLanguage = langCode;
        localStorage.setItem('language', langCode);
        this.applyLanguage(langCode);
        this.updateLanguageButton();
        this.updateDropdown();
    }

    applyLanguage(langCode) {
        const translation = this.translations[langCode];
        if (!translation) return;

        // Update navigation
        this.updateElement('[data-translate="nav.apps"]', translation.nav.apps);
        this.updateElement('[data-translate="nav.contact"]', translation.nav.contact);
        this.updateElement('[data-translate="nav.privacy"]', translation.nav.privacy);
        this.updateElement('[data-translate="nav.terms"]', translation.nav.terms);

        // Update hero section
        this.updateElement('[data-translate="hero.title"]', translation.hero.title);
        this.updateElement('[data-translate="hero.subtitle"]', translation.hero.subtitle);
        this.updateElement('[data-translate="hero.viewApps"]', translation.hero.viewApps);
        this.updateElement('[data-translate="hero.appStore"]', translation.hero.appStore);

        // Update apps section
        this.updateElement('[data-translate="apps.title"]', translation.apps.title);
        this.updateElement('[data-translate="apps.subtitle"]', translation.apps.subtitle);

        // Update about section
        this.updateElement('[data-translate="about.title"]', translation.about.title);
        this.updateElement('[data-translate="about.description"]', translation.about.description);
        this.updateElement('[data-translate="about.features.innovation"]', translation.about.features.innovation);
        this.updateElement('[data-translate="about.features.quality"]', translation.about.features.quality);
        this.updateElement('[data-translate="about.features.support"]', translation.about.features.support);
        this.updateElement('[data-translate="about.stats.apps"]', translation.about.stats.apps);
        this.updateElement('[data-translate="about.stats.downloads"]', translation.about.stats.downloads);
        this.updateElement('[data-translate="about.stats.rating"]', translation.about.stats.rating);

        // Update contact section
        this.updateElement('[data-translate="contact.title"]', translation.contact.title);
        this.updateElement('[data-translate="contact.form.name"]', translation.contact.form.name);
        this.updateElement('[data-translate="contact.form.email"]', translation.contact.form.email);
        this.updateElement('[data-translate="contact.form.subject"]', translation.contact.form.subject);
        this.updateElement('[data-translate="contact.form.message"]', translation.contact.form.message);
        this.updateElement('[data-translate="contact.form.send"]', translation.contact.form.send);

        // Update form options
        this.updateSelectOptions('subject', translation.contact.form.subjects);

        // Update footer
        this.updateElement('[data-translate="footer.description"]', translation.footer.description);
        this.updateElement('[data-translate="footer.quickLinks"]', translation.footer.quickLinks);
        this.updateElement('[data-translate="footer.legal"]', translation.footer.legal);
        this.updateElement('[data-translate="footer.support"]', translation.footer.support);
        this.updateElement('[data-translate="footer.copyright"]', translation.footer.copyright);

        // Update document direction for RTL languages
        document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = langCode;
    }

    updateElement(selector, text) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    }

    updateSelectOptions(selectName, options) {
        const select = document.querySelector(`select[name="${selectName}"]`);
        if (select) {
            select.innerHTML = '';
            Object.entries(options).forEach(([value, text]) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = text;
                select.appendChild(option);
            });
        }
    }

    updateLanguageButton() {
        const span = this.langButton.querySelector('span');
        span.textContent = this.languages[this.currentLanguage];
    }

    updateDropdown() {
        const options = this.dropdown.querySelectorAll('.lang-option');
        options.forEach(option => {
            const checkIcon = option.querySelector('.fas.fa-check');
            if (checkIcon) {
                checkIcon.style.display = option.dataset.lang === this.currentLanguage ? 'inline' : 'none';
            }
        });
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageSwitcher();
});
