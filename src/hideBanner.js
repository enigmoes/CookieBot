/**
 * Class HideBanner
 */
class HideBanner
{
    static init()
    {
        // Init banner clases array
        this.htmlClases = ['#didomi-host', '#cl-consent', '[data-nosnippet="data-nosnippet"]', '#gaz-gdpr-modal', '#pmConsentWall'];
        // Init cookies
        this.cookies = ['_ga', '_ga_*'];

        // Call to hide banner
        this.hideBanner();
    }

    static isActive()
    {
        let isActive = false;
        
        let cookibot = localStorage.getItem('cookiebot');
        if (cookibot == 'true') {
            isActive = true;
        }
        
        return isActive;
    }

    static hideBanner()
    {
        // Recorremos banners si no estan vacios
        this.htmlClases.forEach(element => {
            setTimeout(() => {
                let cookieBanner = document.querySelector(element);
                // Comprobamos si existe el banner y si esta activo el bloqueador
                if (cookieBanner !== null) {
                    // Comprobamos si esta activo el banner
                    if (HideBanner.isActive()) {
                        cookieBanner.style.display = 'none';
                        // Enable body scroll
                        HideBanner.enableScroll();
                    } else {
                        cookieBanner.style.display = 'block';
                        // Disable body scroll
                        HideBanner.disableScroll();
                    }
                }
            }, 1000);
        });
    }

    static enableScroll()
    {
        // Habilitamos scroll del body
        document.querySelector('body').style.cssText = 'overflow: auto !important';
    }

    static disableScroll()
    {
        // Habilitamos scroll del body
        document.querySelector('body').style.cssText = 'overflow: hidden !important';
    }
}

// Init object HideBanner
HideBanner.init();