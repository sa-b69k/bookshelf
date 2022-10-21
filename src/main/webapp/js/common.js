const APP_NAME = 'Bookshelf';
const URL_PATTERN = 'Controller';

/**
 * 通信状態に応じた処理
 * @param xhr      XMLHttpRequestインスタンス
 * @param nextPage 遷移先ページ
 */
function searchXhrEvent(xhr, nextPage) {
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				// セッションストレージにレスポンスを格納
				sessionStorage.setItem('response', xhr.response);
				// 任意の画面に遷移する
				window.location.href = nextPage;
			} else {
				alert('検索に失敗しました');
			}
		} else {
			console.log('通信中...');
		}
	};
}

/**
 * 総合検索ボタンの活性非活性制御
 */
function activateSearchButton() {
	let searchButton = document.getElementById('total-search');
	// 検索ボックスに入力値がある場合
	if (document.getElementById('keyword').value) {
		searchButton.disabled = false;
	// 検索ボックスが空の場合
	} else {
		searchButton.disabled = true;
	}
}

// ヘッダーを読み込む
fetch('/' + APP_NAME + '/html/header.html')
	.then(response => {
		return response.text();
	})
	.then(data => {
		document.querySelector('header').innerHTML = data;
		document.getElementById('keyword').value = sessionStorage.getItem('keyword');

		// 総合検索ボタンにリスナーを登録する
		document.getElementById('total-search').addEventListener('click', function(e) {
			// セッションストレージにパラメータ値を保存する
			sessionStorage.setItem('operationType', 'executeAPI');
			sessionStorage.setItem('sort', 'standard');
			sessionStorage.setItem('keyword', document.getElementById('keyword').value);
			sessionStorage.setItem('title', '');
			sessionStorage.setItem('author', '');
			sessionStorage.setItem('publisher', '');
			sessionStorage.setItem('isbn', '');

			let xhr = new XMLHttpRequest();
			searchXhrEvent(xhr, '/' + APP_NAME + '/html/search-result.html');
			// リクエストパラメータを付加する
			let requestUrl = '/' + APP_NAME + '/' + URL_PATTERN + '?' + 'operationType=' + 'executeAPI'
																+ '&' + 'keyword=' + document.getElementById('keyword').value
																+ '&' + 'sort=' + 'standard'
																+ '&' + 'page=' + e.target.dataset.page;
			// リクエスト送信
			xhr.open('GET', requestUrl, true);
			xhr.send();
		});

		// マイページリンクにリスナーを登録する
		document.getElementById('my-page').addEventListener('click', function() {
			// セッションストレージにパラメータ値を保存する
			sessionStorage.setItem('user', 'user1');
			sessionStorage.setItem('operationType', 'select');
			sessionStorage.setItem('sort', 'standard');
			sessionStorage.setItem('keyword', '');
			sessionStorage.setItem('title', '');
			sessionStorage.setItem('author', '');
			sessionStorage.setItem('publisher', '');
			sessionStorage.setItem('isbn', '');

			let xhr = new XMLHttpRequest();
			searchXhrEvent(xhr, '/' + APP_NAME + '/html/my-page.html');
			// リクエストパラメータを付加する
			let requestUrl = '/' + APP_NAME + '/' + URL_PATTERN + '?' + 'user=' + 'user1'
																+ '&' + 'operationType=' + 'select'
																+ '&' + 'sort=' + 'standard'
																+ '&' + 'page=' + '1';
			// リクエスト送信
			xhr.open('GET', requestUrl, true);
			xhr.send();
		});
	});

// フッターを読み込む
fetch('/' + APP_NAME + '/html/footer.html')
	.then(response => {
		return response.text();
	})
	.then(data => {
		document.querySelector('footer').innerHTML = data;
	});
