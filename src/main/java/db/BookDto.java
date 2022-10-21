package db;

public class BookDto {
	
	private String isbn;       // ISBN
	private String title;      // 書籍名
	private String author;     // 著者
	private String publisher;  // 出版社
	private String salesDate;  // 発売日
	private String caption;    // 説明
	private String image;      // 画像
	private String itemUrl;    // 商品URL

	/**
	 * ISBNを取得する
	 */
	public String getIsbn() {
		return isbn;
	}
	/**
	 * ISBNを設定する
	 */
	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}

	/**
	 * 書籍名を取得する
	 */
	public String getTitle() {
		return title;
	}
	/**
	 * 書籍名を設定する
	 */
	public void setTitle(String title) {
		this.title = title;
	}

	/**
	 * 著者を取得する
	 */
	public String getAuthor() {
		return author;
	}
	/**
	 * 著者を設定する
	 */
	public void setAuthor(String author) {
		this.author = author;
	}

	/**
	 * 出版社を取得する
	 */
	public String getPublisher() {
		return publisher;
	}
	/**
	 * 出版社を設定する
	 */
	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}

	/**
	 * 発売日を取得する
	 */
	public String getSalesDate() {
		return salesDate;
	}
	/**
	 * 発売日を設定する
	 */
	public void setSalesDate(String salesDate) {
		this.salesDate = salesDate;
	}

	/**
	 * 説明を取得する
	 */
	public String getCaption() {
		return caption;
	}
	/**
	 * 説明を設定する
	 */
	public void setCaption(String caption) {
		this.caption = caption;
	}

	/**
	 * 画像を取得する
	 */
	public String getImage() {
		return image;
	}
	/**
	 * 画像を設定する
	 */
	public void setImage(String image) {
		this.image = image;
	}

	/**
	 * 商品URLを取得する
	 */
	public String getItemUrl() {
		return itemUrl;
	}
	/**
	 * 商品URLを設定する
	 */
	public void setItemUrl(String itemUrl) {
		this.itemUrl = itemUrl;
	}
}
