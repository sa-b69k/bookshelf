package json;

public class Escaper {
	/**
	 * JSONにおける特殊文字をエスケープする.
	 * @param target 対象文字列
	 * @return       エスケープ後文字列
	 */
	public String escapeForJSON(String target) {
		StringBuilder sb = new StringBuilder();
		sb.append(target.replaceAll("\t", "\\\\t"));  // タブ文字
		return sb.toString();
	}
}
