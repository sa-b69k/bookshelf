
document.getElementById('message').textContent = '該当する結果がありません。';

let pageBack = document.getElementById('page-back');
let pageLink = document.createElement('a');
pageLink.textContent = '検索画面に戻る';
pageLink.href = 'detail-search.html';
pageBack.appendChild(pageLink);
