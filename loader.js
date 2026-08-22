(function () {

    async function loadJsonContents() {

        const boxes = document.querySelectorAll('[data-json]');

        console.log('[JSON Loader] data-json 개수:', boxes.length);

        if (!boxes.length) {
            return;
        }

        const jsonFiles = {
            'stockinfo_': '2000_stockinfo.json',
            'hotstock_': '3000_hotstock.json',
            'dividend_': '5000_dividend.json'
        };

        const baseUrl =
            'https://raw.githubusercontent.com/katekdy55-dot/link_html/main/';

        const groups = {};

        boxes.forEach(function (box) {

            const id = box.getAttribute('data-json');

            if (!id) return;

            for (const prefix in jsonFiles) {

                if (id.startsWith(prefix)) {

                    if (!groups[prefix]) {
                        groups[prefix] = [];
                    }

                    groups[prefix].push(box);

                    break;
                }
            }
        });

        for (const prefix in groups) {

            const file = jsonFiles[prefix];

            try {

                console.log('[JSON Loader] 요청:', file);

                const response = await fetch(baseUrl + file, {
                    cache: 'no-cache'
                });

                if (!response.ok) {
                    throw new Error(
                        file + ' 불러오기 실패: ' + response.status
                    );
                }

                const data = await response.json();

                console.log('[JSON Loader] 로드 성공:', file);

                groups[prefix].forEach(function (box) {

                    const id = box.getAttribute('data-json');

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

                    console.log(
                        '[JSON Loader] 출력 완료:',
                        id
                    );

                });

            } catch (error) {

                console.error(
                    '[JSON Loader] 오류:',
                    file,
                    error
                );

                groups[prefix].forEach(function (box) {
                    box.remove();
                });
            }
        }
    }


    /*
     * DOMContentLoaded 이전이면 이벤트를 기다리고,
     * 이미 DOM이 만들어졌으면 즉시 실행
     */
    if (document.readyState === 'loading') {

        document.addEventListener(
            'DOMContentLoaded',
            loadJsonContents
        );

    } else {

        loadJsonContents();

    }

})();
