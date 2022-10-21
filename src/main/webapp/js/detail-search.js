// 検索ボックスに検索条件を表示する
document.getElementById('title').value = sessionStorage.getItem('title');
document.getElementById('author').value = sessionStorage.getItem('author');
document.getElementById('publisher').value = sessionStorage.getItem('publisher');
document.getElementById('isbn').value = sessionStorage.getItem('isbn');

let conditions = document.getElementById('search-condition').children;
// 検索条件分ループ
for (let i = 0; i < conditions.length; i++) {
	// 検索条件入力時のリスナー登録
	conditions[i].querySelector('input').addEventListener('input', function() {
		// 検索条件分ループ
		for (let j = 0; j < conditions.length; j++) {
			// 入力値がある場合
			if(conditions[j].querySelector('input').value) {
				document.getElementById('clear').disabled = false;
				document.getElementById('detail-search').disabled = false;
				break;
			}
			// 検索条件が未入力の場合
			document.getElementById('detail-search').disabled = true;
		}
	});
}

// 条件クリアボタン押下時のリスナー登録
document.getElementById('clear').addEventListener('click', function() {
	// 検索条件分ループ
	for (let i = 0; i < conditions.length; i++) {
		conditions[i].querySelector('input').value = '';
		document.getElementById('clear').disabled = true;
		document.getElementById('detail-search').disabled = true;
	}
});

// 詳細検索ボタンにリスナーを登録する
document.getElementById('detail-search').addEventListener('click', function(e) {
	// セッションストレージにパラメータ値を保存する
	sessionStorage.setItem('operationType', 'executeAPI');
	sessionStorage.setItem('sort', 'standard');
	sessionStorage.setItem('keyword', '');
	sessionStorage.setItem('title', document.getElementById('title').value);
	sessionStorage.setItem('author', document.getElementById('author').value);
	sessionStorage.setItem('publisher', document.getElementById('publisher').value);
	sessionStorage.setItem('isbn', document.getElementById('isbn').value);
	// リクエストパラメータを付加する
	let requestUrl = '/' + APP_NAME + '/' + URL_PATTERN + '?' + 'operationType=' + 'executeAPI'
														+ '&' + 'title=' + document.getElementById('title').value
														+ '&' + 'author=' + document.getElementById('author').value
														+ '&' + 'publisherName=' + document.getElementById('publisher').value
														+ '&' + 'isbn=' + document.getElementById('isbn').value
														+ '&' + 'sort=' + 'standard'
														+ '&' + 'page=' + e.target.dataset.page;
	let xhr = new XMLHttpRequest();
	searchXhrEvent(xhr, 'search-result.html');
	// リクエスト送信
	xhr.open('GET', requestUrl, true);
	xhr.send();
});
