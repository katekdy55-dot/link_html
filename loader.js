document.addEventListener('DOMContentLoaded', async function () {
    const boxes = document.querySelectorAll('[data-json]');
    if (!boxes.length) return;

    const jsonFiles = {
        'stockinfo_': '2000_stockinfo.json',
        'hotstock_': '3000_hotstock.json',
        'dividend_': '5000_dividend.json'
    };

    const baseUrl = 'https://raw.githubusercontent.com/katekdy55-dot/link_html/main/';
    const groups = {};

    boxes.forEach(function (box) {
        const id = box.getAttribute('data-json');
        if (!id) return;

        for (const prefix in jsonFiles) {
            if (id.startsWith(prefix)) {
                (groups[prefix] ||= []).push(box);
                break;
            }
        }
    });

    for (const prefix in groups) {
        const file = jsonFiles[prefix];

        try {
            const response = await fetch(baseUrl + file, { cache: 'no-cache' });
            if (!response.ok) throw new Error(file + ' 불러오기 실패: ' + response.status);

            const data = await response.json();

            groups[prefix].forEach(function (box) {
                const id = box.getAttribute('data-json');
                const item = data[id];

                if (!item || item.active === false || !item.html) {
                    box.remove();
                    return;
                }

                box.innerHTML = item.html;
            });
        } catch (error) {
            console.error('[JSON Loader] ' + file, error);
            groups[prefix].forEach(box => box.remove());
        }
    }
});
