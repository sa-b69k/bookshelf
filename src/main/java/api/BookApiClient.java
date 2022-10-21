package api;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;

public class BookApiClient {
	private static final String APP_URL = "https://app.rakuten.co.jp/services/api";  // アプリケーションURL
	private static final String APP_ID ="1034795189404505384&format=json";           // アプリケーションID
	private static final String TYPE_TOTAL = "/BooksTotal/Search/20170404";          // 種別_総合検索
	private static final String TYPE_DETAIL = "/BooksBook/Search/20170404";          // 種別_詳細検索
	private static final String FORMAT ="json";                                      // フォーマット
	private static final String CHAR_CODE = "UTF-8";                                 // 文字コード

	/**
	 * 楽天ブックスAPIを実行する.
	 * @param request 画面からのリクエスト
	 * @return        API実行結果
	 */
	public String executeApi(HttpServletRequest request) {
		StringBuilder requestUrl = new StringBuilder();
		requestUrl.append(APP_URL);
		String response = null;
		try {
			response = sendRequest(addParameters(request, requestUrl));
		} catch(UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return response;
	}

	/**
	 * URLにパラメータを付加する.
	 * @param request    画面からのリクエスト
	 * @param requestUrl APIのリクエストURL
	 * @return           パラメータ付加後のAPIのリクエストURL
	 */
	private String addParameters(HttpServletRequest request, StringBuilder requestUrl) throws UnsupportedEncodingException {
		// 「keyword」パラメータがある場合
		if (request.getParameter("keyword") != null) {
			// 総合検索用のパラメータを付加する
			requestUrl.append(TYPE_TOTAL);
			requestUrl.append("?applicationId=" + APP_ID);
			requestUrl.append("&format=" + FORMAT);
			requestUrl.append("&keyword=" + URLEncoder.encode(request.getParameter("keyword"), CHAR_CODE));
		// 「keyword」パラメータがない場合
		} else {
			// 詳細検索用のパラメータを付加する
			requestUrl.append(TYPE_DETAIL);
			requestUrl.append("?applicationId=" + APP_ID);
			requestUrl.append("&format=" + FORMAT);
			// 「title」パラメータが空でない場合
			if (request.getParameter("title") != "") {
				requestUrl.append("&title=" + URLEncoder.encode(request.getParameter("title"), CHAR_CODE));
			}
			// 「author」パラメータが空でない場合
			if (request.getParameter("author") != "") {
				requestUrl.append("&author=" + URLEncoder.encode(request.getParameter("author"), CHAR_CODE));
			}
			// 「publisherName」パラメータが空でない場合
			if (request.getParameter("publisherName") != "") {
				requestUrl.append("&publisherName=" + URLEncoder.encode(request.getParameter("publisherName"), CHAR_CODE));
			}
			// 「isbn」パラメータが空でない場合
			if (request.getParameter("isbn") != "") {
				requestUrl.append("&isbn=" + request.getParameter("isbn"));
			}
		}
		requestUrl.append("&sort=" + URLEncoder.encode(URLEncoder.encode(request.getParameter("sort"), CHAR_CODE), CHAR_CODE));
		requestUrl.append("&page=" + URLEncoder.encode(request.getParameter("page"), CHAR_CODE));
		return requestUrl.toString();
	}

	/**
	 * 楽天ブックスAPIにリクエストを送信する.
	 * @param requestUrl リクエストURL
	 * @return           レスポンス
	 */
	private String sendRequest(String requestUrl) {
		StringBuilder response = new StringBuilder();
		try {
			// 楽天ブックスAPIに接続する
			HttpURLConnection connection = (HttpURLConnection)(new URL(requestUrl)).openConnection();
			connection.connect();

			// レスポンスを取得する
			InputStreamReader inputStreamReader = new InputStreamReader(connection.getInputStream(), CHAR_CODE);
			BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

			String line = "";
			// レスポンスを一行ずつ読み込み、最終行までループ
			while ((line = bufferedReader.readLine()) != null) {
				// レスポンス文字列を作成する
				response.append(line);
			}
		} catch(IOException e) {
			e.printStackTrace();
		}
		return response.toString();
	}
}
