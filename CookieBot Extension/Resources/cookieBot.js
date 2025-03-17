document.addEventListener('DOMContentLoaded', function () {
    // Init CookieBot object
    CookieBot.init();
}, false);

/**
 * Clase CookieBot
 */
class CookieBot
{
    static init()
    {
        // Load events
        this.events();
        // Read tab storage
        this.getCurrentTab().then(tab => {
            browser.scripting.executeScript({
                target: {tabId: tab.id},
                func: getCheck
            }, (result) => {
                if (typeof result !== 'undefined') {
                    if (result[0].result == 'true') {
                        document.querySelector('.status-text').textContent = 'Desbloqueado';
                        document.querySelector('.status').innerHTML = '<i class="fa-solid fa-square-check fa-green"></i>';
                        document.querySelector('#cookiebot_enable').checked = true;
                    } else {
                        document.querySelector('.status-text').textContent = 'Bloqueado';
                        document.querySelector('.status').innerHTML = '<i class="fa-solid fa-square-xmark fa-red"></i>';
                        document.querySelector('#cookiebot_enable').checked = false;
                    }
                }
            });
        });

        // Remove cookies
        this.removeCookies();
    }

    static events()
    {
        // Evento activar switch
        document.querySelector('#cookiebot_enable').addEventListener('change', (event) => {
            let checked = (event.target.checked) ? true : false;

            if (checked) {
                document.querySelector('.status').innerHTML = '<i class="fa-solid fa-square-check fa-green"></i>';
            } else {
                document.querySelector('.status').innerHTML = '<i class="fa-solid fa-square-xmark fa-red"></i>';
            }

            this.getCurrentTab().then(tab => {
                // Call to ExecuteScript for save cookiebot is active or not
                browser.scripting.executeScript({
                    target: {tabId: tab.id},
                    func: saveCheck,
                    args: [checked]
                });
            });
        });
    }

    static async getCurrentTab()
    {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        return tab;
    }

    static removeCookies()
    {
        this.getCurrentTab().then(tab => {
            if (tab?.url) {
                try {
                    // Create URL
                    let url = new URL(tab.url);
                    // Remove WWW from URL
                    let shortDomain = url.hostname.replace('www', '');
                    // Get cookies from URL
                    browser.cookies.getAll({ domain: shortDomain }, (cookies) => {
                        cookies.forEach(cookie => {
                            if (cookie.domain == shortDomain) {
                                // Set protocol
                                const protocol = cookie.secure ? 'https:' : 'http:';
                                // Set URL
                                const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;
                                // Remove cookie
                                browser.cookies.remove({
                                    url: cookieUrl,
                                    name: cookie.name,
                                    storeId: cookie.storeId
                                });
                            }
                        });
                    });
                } catch {
                    // ignore
                }
            }
        });
    }
}

async function saveCheck(checked)
{
    if (checked) {
        localStorage.setItem('cookiebot', true);
        // Reload page
        setTimeout(() => {
            location.reload();
        }, 1000);
    } else {
        localStorage.setItem('cookiebot', false);
        // Reload page
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

async function getCheck()
{
    return localStorage.getItem('cookiebot');
}
