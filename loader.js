(function () {

    const jsonFiles = {
        'stockinfo_': '2000_stockinfo.json',
        'hotstock_': '3000_hotstock.json',
        'dividend_': '5000_dividend.json'
    };

    const baseUrl =
        'https://raw.githubusercontent.com/katekdy55-dot/link_html/main/';

    const loadedData = {};
    const loadingData = {};

    function getPrefix(id) {

        for (const prefix in jsonFiles) {

            if (id.startsWith(prefix)) {
                return prefix;
            }

        }

        return null;
    }


    async function loadJson(prefix) {

        if (loadedData[prefix]) {
            return loadedData[prefix];
        }

        if (loadingData[prefix]) {
            return loadingData[prefix];
        }

        const file = jsonFiles[prefix];

        loadingData[prefix] = fetch(
            baseUrl + file + '?v=' + Date.now(),
            {
                cache: 'no-store'
            }
        )
        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    file + ' 불러오기 실패: ' + response.status
                );
            }

            return response.json();

        })
        .then(function (data) {

            loadedData[prefix] = data;

            return data;

        })
        .catch(function (error) {

            console.error(
                '[JSON Loader 오류]',
                file,
                error
            );

            return null;

        });

        return loadingData[prefix];

    }


    async function processBox(box) {

        if (box.dataset.jsonLoaded === 'true') {
            return;
        }

        const id = box.getAttribute('data-json');

        if (!id) {
            return;
        }

        const prefix = getPrefix(id);

        if (!prefix) {
            console.warn(
                '[JSON Loader] 알 수 없는 data-json:',
                id
            );

            return;
        }

        const data = await loadJson(prefix);

        if (!data) {
            return;
        }

        const item = data[id];

        if (
            !item ||
            item.active === false ||
            !item.html
        ) {
            box.remove();
            return;
        }

        box.innerHTML = item.html;

        box.dataset.jsonLoaded = 'true';

    }


    function processAll() {

        const boxes =
            document.querySelectorAll('[data-json]');

        boxes.forEach(function (box) {

            processBox(box);

        });

    }


    // 페이지가 이미 로딩된 경우
    if (document.readyState === 'loading') {

        document.addEventListener(
            'DOMContentLoaded',
            processAll
        );

    } else {

        processAll();

    }


    // 티스토리에서 본문이 나중에 생성되는 경우까지 감지
    const observer = new MutationObserver(function () {

        processAll();

    });


    observer.observe(
        document.documentElement,
        {
            childList: true,
            subtree: true
        }
    );


})();
