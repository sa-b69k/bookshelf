let searchResult = JSON.parse(sessionStorage.getItem('response'));  // 登録内容(JSON形式)
let deleteItemCount;                                                // 削除データ件数

/**
 * 通信状態に応じた処理
 * @param xhr XMLHttpRequestインスタンス
 */
function deleteXhrEvent(xhr) {
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				// 削除結果をポップアップで表示する
				alert(`${deleteItemCount}件削除しました`);
			} else {
				alert('削除に失敗しました');
			}
		} else {
			console.log('通信中...');
		}
	};
}

// 登録件数が0件の場合
if (searchResult.Items.length < 1) {
	// 結果なし画面へリダイレクト
	window.location = 'no-result.html';
}

// チェック済みデータ数初期化
let checkCount = 0;

// ソート条件を表示する
document.querySelector(`select[name='sort']`).value = sessionStorage.getItem('sort');

// 表示件数・取得件数を表示する
let displayCount = document.getElementsByClassName('display-count');
for (let i = 0; i < displayCount.length; i++) {
	displayCount[i].textContent = `${searchResult.first}～${searchResult.last}件／全${searchResult.count}件`;
}

// ページネーションを表示する
let pagination = document.getElementsByClassName('pagination');
for (let i = 0; i < pagination.length; i++) {
	let pageList = pagination[i].querySelector('ul');
	let currentPage = parseInt(searchResult.page);   // 表示中のページ番号
	let maxPage = parseInt(searchResult.pageCount);  // 検索結果の最終ページ番号

	// 2ページ目以降を表示する場合
	if (1 < currentPage) {
		// 前ページリンクを作成する
		let prevPageItem = document.createElement('li');
		let prevPageLink = document.createElement('a');
		prevPageLink.textContent = '<<前へ';
		prevPageLink.href = '#';
		prevPageLink.dataset.page = currentPage - 1;
		prevPageItem.appendChild(prevPageLink);
		pageList.appendChild(prevPageItem);
	}

	// ループ制御変数を設定する
	let startPage;             // ループ開始ページ番号
	let endPage;               // ループ終了ページ番号
	const MAX_LINK_COUNT = 9;  // 最大ページリンク数
	const RANGE = 4;           // 表示中のページを基準にした前後のページ数

	// 検索結果ページ数が最大ページリンク数未満の場合
	if (maxPage < MAX_LINK_COUNT ) {
		startPage = 1;
		endPage = maxPage;
	// 検索結果ページ数が最大ページリンク数以上の場合
	} else {
		// 表示中のページより前のページ数が指定数未満の場合
		if (currentPage - RANGE < 1) {
			startPage = 1;
			endPage = MAX_LINK_COUNT;
		// 表示中のページより後のページ数が指定数未満の場合
		} else if (maxPage < currentPage + RANGE) {
			startPage = maxPage - MAX_LINK_COUNT + 1;
			endPage = maxPage;
		// 表示中のページの前後のページ数が指定数以上の場合
		} else {
			startPage = currentPage - RANGE;
			endPage = currentPage + RANGE;
		}
	}

	// 上記で設定した範囲のページリンクを作成する
	for (let j = startPage; j <= endPage; j++) {
		let pageItem = document.createElement('li');
		let pageLink = document.createElement('a');
		// 表示中のページである場合
		if (j === currentPage) {
			pageLink.id = 'current-page';
		}
		pageLink.textContent = j;
		pageLink.href = '#';
		pageLink.dataset.page = j;
		pageItem.appendChild(pageLink);
		pageList.appendChild(pageItem);
	}

	// 最終ページではない場合
	if (currentPage < maxPage) {
		// 次ページリンクを作成する
		let nextPageItem = document.createElement('li');
		let nextPageLink = document.createElement('a');
		nextPageLink.textContent = '次へ>>';
		nextPageLink.href = '#';
		nextPageLink.dataset.page = currentPage + 1;
		nextPageItem.appendChild(nextPageLink);
		pageList.appendChild(nextPageItem);
	}
}

// 登録内容を表示する
let items = document.getElementById('item-list');
//データ件数分ループ
for (let i = 0; i < searchResult.Items.length; i++) {
	let item = document.createElement('li');
	item.className = 'item';
	let infos = document.createElement('ul');
	infos.className = 'item-info';
	infos.id = 'item' + i + '-info-list';

	// 画像データ等
	let imageData = document.createElement('div');
	imageData.id = 'image-data';

	// 画像を追加する
	let imageInfo = document.createElement('li');
	imageInfo.dataset.type = 'image';
	let image = document.createElement('img');
	image.src = searchResult.Items[i].Item['mediumImageUrl'];
	imageInfo.appendChild(image);
	imageData.appendChild(imageInfo);

	// ISBNを追加する
	let isbnInfo = document.createElement('li');
	isbnInfo.dataset.type = 'isbn';
	isbnInfo.appendChild(document.createTextNode(searchResult.Items[i].Item['isbn']));
	imageData.appendChild(isbnInfo);

	// チェックボックスを追加する
	let checkboxInfo = document.createElement('li');
	checkboxInfo.id = 'check';
	let checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkboxInfo.appendChild(checkbox);
	imageData.appendChild(checkboxInfo);
	// チェックボックスにリスナーを登録する
	checkbox.addEventListener('change', function(e) {
		// チェックがついている場合
		if(e.target.checked) {
			checkCount++;
		// チェックがついていない場合
		} else {
			checkCount--;
		}
		// チェックがついているデータが一つ以上ある場合
		if (checkCount > 0) {
			document.getElementById('delete').disabled = false;
		// チェックがついているデータが一つもない場合
		} else {
			document.getElementById('delete').disabled = true;
		}
	});

	// テキストデータ等
	let textData = document.createElement('div');
	textData.id = 'text-data';

	// 書籍名を追加する
	let titleInfo = document.createElement('li');
	titleInfo.dataset.type = 'title';
	let link = document.createElement('a');
	link.href = searchResult.Items[i].Item['itemUrl'];
	link.appendChild(document.createTextNode(searchResult.Items[i].Item['title']));
	titleInfo.appendChild(link);
	textData.appendChild(titleInfo);

	// 著者名を追加する
	let authorInfo = document.createElement('li');
	authorInfo.dataset.type = 'author';
	authorInfo.appendChild(document.createTextNode(searchResult.Items[i].Item['author']));
	textData.appendChild(authorInfo);

	// 出版社名を追加する
	let publisherInfo = document.createElement('li');
	publisherInfo.dataset.type = 'publisher';
	publisherInfo.appendChild(document.createTextNode(searchResult.Items[i].Item['publisherName']));
	textData.appendChild(publisherInfo);

	// 発売日を追加する
	let salesDateInfo = document.createElement('li');
	salesDateInfo.dataset.type = 'salesDate';
	salesDateInfo.appendChild(document.createTextNode(searchResult.Items[i].Item['salesDate']));
	textData.appendChild(salesDateInfo);

	// 説明を追加する
	let captionInfo = document.createElement('li');
	captionInfo.dataset.type = 'caption';
	captionInfo.appendChild(document.createTextNode(searchResult.Items[i].Item['itemCaption']));
	textData.appendChild(captionInfo);
	
	infos.appendChild(imageData);
	infos.appendChild(textData);
	item.appendChild(infos);
	items.appendChild(item);
}

window.addEventListener('load', function() {
	// ソート順選択リストにリスナーを登録する
	document.querySelector(`select[name='sort']`).addEventListener('change', function() {
		// セッションストレージにパラメータ値を保存する
		sessionStorage.setItem('sort', document.querySelector(`select[name='sort']`).value);

		let xhr = new XMLHttpRequest();
		searchXhrEvent(xhr, 'my-page.html');
		// リクエストパラメータを付加する
		let requestUrl = '/' + APP_NAME + '/' + URL_PATTERN + '?' + 'user=' + sessionStorage.getItem('user')
															+ '&' + 'operationType=' + sessionStorage.getItem('operationType')
															+ '&' + 'sort=' + document.querySelector(`select[name='sort']`).value
															+ '&' + 'page=' + '1';
		// リクエスト送信
		xhr.open('GET', requestUrl, true);
		xhr.send();
	});

	for (let i = 0; i < pagination.length; i++) {
		let pageLinks = pagination[i].querySelector('ul').children;
		// ページリンク分ループ
		for (let j = 0; j < pageLinks.length; j++) {
			// ページネーションにリスナーを登録する
			pageLinks[j].addEventListener('click', function(e) {
				let xhr = new XMLHttpRequest();
				searchXhrEvent(xhr, 'my-page.html');
				// リクエストパラメータを付加する
				let requestUrl = '/' + APP_NAME + '/' + URL_PATTERN + '?' + 'user=' + sessionStorage.getItem('user')
																	+ '&' + 'operationType=' + sessionStorage.getItem('operationType')
																	+ '&' + 'sort=' + document.querySelector(`select[name='sort']`).value
																	+ '&' + 'page=' + e.target.dataset.page;
				// リクエスト送信
				xhr.open('GET', requestUrl, true);
				xhr.send();
			});
		}
	}

	// 全選択ボタンにリスナーを登録する
	document.getElementById('select-all').addEventListener('click', function(e) {
		let items = document.getElementById('item-list').getElementsByTagName('ul');
		// ボタンの表示値によって処理を分ける
		switch (e.target.value) {
			case '全選択':
				// データ件数分ループ
				for (let i = 0; i < items.length; i++) {
					let infos = items[i].children;
					infos.namedItem('image-data').children[2].firstChild.checked = true;
					document.getElementById('delete').disabled = false;
				}
				e.target.value = '全解除';
				break;
			case '全解除':
				// データ件数分ループ
				for (let i = 0; i < items.length; i++) {
					let infos = items[i].children;
					infos.namedItem('image-data').children[2].firstChild.checked = false;
					document.getElementById('delete').disabled = true;
				}
				e.target.value = '全選択';
		}
	});

	// 削除ボタンにリスナーを登録する
	document.getElementById('delete').addEventListener('click', function() {
		if (window.confirm('削除しますか？')) {
			let items = document.getElementById('item-list').getElementsByTagName('ul');
			// リクエストボディを作成する
			let requestBody = '{"bookList": [';
			// 削除データ件数初期化
			deleteItemCount = 0;

			// データ件数分ループ
			for (let i = 0; i < items.length; i++) {
				// チェックがついていない場合
				if (!items[i].children.namedItem('image-data').children[2].firstChild.checked) {
					// 次のデータへ
					continue;
				// チェックがついている場合
				} else {
					// 二件目以降のデータの場合
					if (0 < deleteItemCount) {
						requestBody += ', ';
					}
					requestBody += '{';
				}
				// 項目数初期化
				let deleteInfoCount = 0;

				// データブロック数分ループ
				for (let j = 0; j < items[i].children.length; j++) {
					let blockId = items[i].children[j].id;
					let datas = items[i].children.namedItem(blockId).children;
					// 項目数分ループ
					for (let k = 0; k < datas.length; k++) {
						let key = datas[k].dataset.type;
						let value = '';
						// 設定対象外の項目の場合
						if (!key) {
							// 次の項目へ
							continue;
						// 設定対象の項目の場合
						} else {
							// 二番目以降の項目の場合
							if (0 < deleteInfoCount) {
								requestBody += ', ';
							}
							// 画像データの場合
							if (key === 'image') {
								value = datas[k].firstChild.getAttribute('src');
							// テキストデータの場合
							} else {
								value = datas[k].textContent;
							}
							requestBody += `"${key}": "${value}"`;
							// 項目数カウント
							deleteInfoCount++;
						}
					}
				}
				requestBody += '}';
				// 削除データ件数カウント
				deleteItemCount++;
			}
			requestBody += '], "operationType": "delete"}';

			var xhr = new XMLHttpRequest();
			deleteXhrEvent(xhr);
			// 削除リクエスト送信
			xhr.open('POST', '/' + APP_NAME + '/' + URL_PATTERN);
			xhr.send(requestBody);

			var xhr = new XMLHttpRequest();
			searchXhrEvent(xhr, 'my-page.html');
			// リクエストパラメータを付加する
			let requestUrl = '/' + APP_NAME + '/' + URL_PATTERN + '?' + 'user=' + sessionStorage.getItem('user')
																+ '&' + 'operationType=' + sessionStorage.getItem('operationType')
																+ '&' + 'sort=' + sessionStorage.getItem('sort')
																+ '&' + 'page=' + '1';
			// リクエスト送信
			xhr.open('GET', requestUrl, true);
			xhr.send();
		}
	});
});
