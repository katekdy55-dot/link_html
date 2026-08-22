(function () {

    async function loadJsonContents() {

        const boxes = document.querySelectorAll('[data-json]');

        if (!boxes.length) {
            console.log('[JSON Loader] 호출 영역이 없습니다.');
            return;
        }

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

                    if (!groups[prefix]) {
                        groups[prefix] = [];
                    }

                    groups[prefix].push(box);

                    break;
                }
            }
        });

        console.log('[JSON Loader] 호출 영역:', groups);

        for (const prefix in groups) {

            const file = jsonFiles[prefix];

            try {

                console.log('[JSON Loader] 불러오는 파일:', file);

                const response = await fetch(baseUrl + file);

                if (!response.ok) {
                    throw new Error(
                        file + ' 불러오기 실패: ' + response.status
                    );
                }

                const data = await response.json();

                console.log('[JSON Loader] JSON 로드 성공:', file);

                groups[prefix].forEach(function (box) {

                    const id = box.getAttribute('data-json');

                    const item = data[id];

                    if (
                        !item ||
                        item.active === false ||
                        !item.html
                    ) {
                        console.log('[JSON Loader] 데이터 없음:', id);

                        box.remove();

                        return;
                    }

                    box.innerHTML = item.html;

                    console.log('[JSON Loader] 출력 완료:', id);

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


    if (document.readyState === 'loading') {

        document.addEventListener(
            'DOMContentLoaded',
            loadJsonContents
        );

    } else {

        loadJsonContents();

    }

})();
