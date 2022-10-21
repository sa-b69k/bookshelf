package db;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import json.DataObject;
import json.Escaper;

public class BookDao {
	/**
	 * データベース識別子
	 */
	private static final String DATABASE_SPECIFIER = "localhost:1521/orclpdb";
	/**
	 * ユーザー名
	 */
	private static final String USER = "user1";
	/**
	 * パスワード
	 */
	private static final String PASSWORD = "password2";

	/**
	 * データを登録または削除する.
	 * @param request 画面からのリクエスト
	 */
	public void update(HttpServletRequest request) {
		StringBuilder requestBody = new StringBuilder();
		DataObject dataObject = null;

		Connection connection = null;
		PreparedStatement pstmt = null;

		try {
			// JDBCドライバをロードする
			Class.forName("oracle.jdbc.driver.OracleDriver");
		} catch(ClassNotFoundException e) {
			e.printStackTrace();
		}

		try {
			// データベースに接続する
			connection = DriverManager.getConnection("jdbc:oracle:thin:" + USER + "/" + PASSWORD + "@" + DATABASE_SPECIFIER);
			
			try {
				String line = null;
				Escaper escaper = new Escaper();
				// リクエストボディを一行ずつ読み込み、最終行までループ
				while((line = request.getReader().readLine()) != null) {
					//リクエストボディ文字列を作成する
					requestBody.append(escaper.escapeForJSON(line));
				}
			} catch (IOException e) {
				e.printStackTrace();
			}

			// リクエストボディ文字列をJavaオブジェクトにマッピング
			try {
				ObjectMapper mapper = new ObjectMapper();
				dataObject = mapper.readValue(requestBody.toString(), DataObject.class);
			} catch(JsonProcessingException e) {
				e.printStackTrace();
			}

			// 書籍リストを取得する
			ArrayList<BookDto> bookList = dataObject.getBookList();

			switch (dataObject.getOperationType()) {
				// 操作種別が「insert」の場合
				case "insert":
					// データ件数分ループ
					for (int i = 0; i < bookList.size(); i++) {
						BookDto book = bookList.get(i);
						// INSERT文実行
						pstmt = connection.prepareStatement("INSERT INTO BOOK (ISBN, TITLE, AUTHOR, PUBLISHER, SALES_DATE, CAPTION, IMAGE, ITEM_URL) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
						pstmt.setString(1, book.getIsbn());       // ISBN
						pstmt.setString(2, book.getTitle());      // 書籍名
						pstmt.setString(3, book.getAuthor());     // 著者
						pstmt.setString(4, book.getPublisher());  // 出版社
						pstmt.setString(5, book.getSalesDate());  // 発売日
						pstmt.setString(6, book.getCaption());    // 説明
						pstmt.setString(7, book.getImage());      // 画像
						pstmt.setString(8, book.getItemUrl());    // 商品URL
						pstmt.executeUpdate();
					}
					break;
				// 操作種別が「delete」の場合
				case "delete":
					// データ件数分ループ
					for (int i = 0; i < bookList.size(); i++) {
						BookDto book = bookList.get(i);
						// DELETET文実行
						pstmt = connection.prepareStatement("DELETE FROM BOOK WHERE ISBN = ?");
						pstmt.setString(1, book.getIsbn());  // ISBN
						pstmt.executeUpdate();
					}
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (connection != null) {
				try {
					connection.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
	}

	/**
	 * データを取得する.
	 * @param  request 画面からのリクエスト
	 * @return         取得データ(JSON形式)
	 */
	public String read(HttpServletRequest request) {
		StringBuilder response = new StringBuilder();

		Connection connection = null;
		PreparedStatement pstmt = null;
		ResultSet resultSet = null;

		try {
			// JDBCドライバをロードする
			Class.forName("oracle.jdbc.driver.OracleDriver");
		} catch(ClassNotFoundException e) {
			e.printStackTrace();
		}

		try {
			// データベースに接続する
			connection = DriverManager.getConnection("jdbc:oracle:thin:" + USER + "/" + PASSWORD + "@" + DATABASE_SPECIFIER);
			
			response.append("{");
			// SELECT文実行(1)
			pstmt = connection.prepareStatement("SELECT COUNT(*) AS TOTAL_RECORD_COUNT FROM BOOK");
			resultSet = pstmt.executeQuery();
			while(resultSet.next()) {
				response.append("\"count\": \"" + resultSet.getInt("TOTAL_RECORD_COUNT") + "\"");
				response.append(", ");
				response.append("\"pageCount\": \"" + (int)Math.ceil(resultSet.getInt("TOTAL_RECORD_COUNT") / 30.0) + "\"");
			}

			String sortColumn = null;
			try {
				// ソート項目を設定する
				switch (URLEncoder.encode(request.getParameter("sort"), "UTF-8")) {
					case "+releaseDate":
						sortColumn = "SALES_DATE ASC";
						break;
					case "-releaseDate":
						sortColumn = "SALES_DATE DESC";
						break;
					default:
						sortColumn = "CREATE_DATE DESC";
				}
			} catch(UnsupportedEncodingException e) {
				e.printStackTrace();
			}

			// SELECT文実行(2)
			pstmt = connection.prepareStatement("SELECT MIN(COLUMN_NUMBER) AS FIRST_RECORD_NUMBER"
													+ ",MAX(COLUMN_NUMBER) AS LAST_RECORD_NUMBER"
												+ " FROM (SELECT ROW_NUMBER() OVER (ORDER BY " + sortColumn + ") AS COLUMN_NUMBER"
														+ " FROM BOOK"
													+ " ORDER BY " + sortColumn + " OFFSET ? ROWS FETCH NEXT 30 ROWS ONLY)");
			pstmt.setInt(1, 30 * (Integer.parseInt(request.getParameter("page")) - 1));
			resultSet = pstmt.executeQuery();
			while(resultSet.next()) {
				response.append(", ");
				response.append("\"first\": \"" + resultSet.getInt("FIRST_RECORD_NUMBER") + "\"");
				response.append(", ");
				response.append("\"last\": \"" + resultSet.getInt("LAST_RECORD_NUMBER") + "\"");
				response.append(", ");
				response.append("\"page\": \"" + request.getParameter("page") + "\"");
				response.append(", ");
			}

			response.append("\"Items\": [");
			// SELECT文実行(3)
			pstmt = connection.prepareStatement("SELECT ISBN"
													+ ",TITLE"
													+ ",AUTHOR"
													+ ",PUBLISHER"
													+ ",SALES_DATE"
													+ ",CAPTION"
													+ ",IMAGE"
													+ ",ITEM_URL"
													+ ",ROW_NUMBER() OVER (ORDER BY " + sortColumn + ") AS ROW_NUMBER"
												+ " FROM BOOK"
											+ " ORDER BY " + sortColumn + " OFFSET ? ROWS FETCH NEXT 30 ROWS ONLY");
			pstmt.setInt(1, 30 * (Integer.parseInt(request.getParameter("page")) - 1));
			resultSet = pstmt.executeQuery();

			int itemCount = 0;
			while(resultSet.next()) {
				if (0 < itemCount) {
					response.append(", ");
				}
				response.append("{\"Item\": {");
				response.append("\"isbn\": \"" + resultSet.getString("ISBN") + "\"");
				response.append(", ");
				response.append("\"title\": \"" + resultSet.getString("TITLE") + "\"");
				response.append(", ");
				response.append("\"author\": \"" + StringUtils.defaultString(resultSet.getString("AUTHOR")) + "\"");
				response.append(", ");
				response.append("\"publisherName\": \"" + StringUtils.defaultString(resultSet.getString("PUBLISHER")) + "\"");
				response.append(", ");
				response.append("\"salesDate\": \"" + StringUtils.defaultString(resultSet.getString("SALES_DATE")) + "\"");
				response.append(", ");
				response.append("\"itemCaption\": \"" + StringUtils.defaultString(resultSet.getString("CAPTION")) + "\"");
				response.append(", ");
				response.append("\"mediumImageUrl\": \"" + StringUtils.defaultString(resultSet.getString("IMAGE")) + "\"");
				response.append(", ");
				response.append("\"itemUrl\": \"" + StringUtils.defaultString(resultSet.getString("ITEM_URL")) + "\"");
				response.append("}}");
				itemCount++;
			}
			response.append("]");
			response.append("}");

		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (connection != null) {
				try {
					connection.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return response.toString();
	}
}
