package json;
import java.util.ArrayList;

import db.BookDto;

/**
 * JSON形式のデータとマッピングされるクラス
 */
public class DataObject {

	private String operationType;         // 操作種別
	private ArrayList<BookDto> bookList;  // 書籍リスト

	/**
	 * 操作種別を取得する
	 */
	public String getOperationType() {
		return operationType;
	}
	/**
	 * 操作種別を設定する
	 */
	public void setOperationType(String operationType) {
		this.operationType = operationType;
	}

	/**
	 * 書籍リストを取得する
	 */
	public ArrayList<BookDto> getBookList() {
		return bookList;
	}
	/**
	 * 書籍リストを設定する
	 */
	public void setBookList(ArrayList<BookDto> bookList) {
		this.bookList = bookList;
	}
}
