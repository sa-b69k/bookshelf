import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import api.BookApiClient;
import db.BookDao;

@WebServlet("/Controller")
public class Controller extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) {
		BookApiClient bookApiClient = new BookApiClient();
		String result = null;

		try {
			request.setCharacterEncoding("UTF-8");
		} catch(UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		switch (request.getParameter("operationType")) {
			case "select":
				// データベースからデータを取得する
				BookDao bookDao = new BookDao();
				result = bookDao.read(request);
				break;
			case "executeAPI":
				// APIを実行する
				result = bookApiClient.executeApi(request);
			}

		response.setContentType("application/json; charset=UTF-8");
		try {
			PrintWriter out = response.getWriter();
			out.print(result);
		} catch(IOException e) {
			e.printStackTrace();
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) {
		try {
			request.setCharacterEncoding("UTF-8");
		} catch(UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		BookDao bookDao = new BookDao();
		bookDao.update(request);
	}
}
