package org.playthm.core.model;

/**
 *
 * @author Administrator
 *
 */
public class Paging {

	private boolean isAutoInit = false;

	/** 현재 페이지 */
	private int page;

	/** 총 레코드 수 */
	private int total;

	/** 첫 번째 글번호(순서정보) */
	private int firstNumber;

	/** 리스트(화면)당 글 수 */
	private int rowCount;

	/** 페이징 그룹의 표시 페이지 수 */
	private int colCount;

	/** 현재 페이지 첫 번째 글번호(순서정보, DB 검색 쿼리에서 검색 페이지 구간 선별용) */
	private int rowStart;

	/** 현재 페이지의 마지막 글번호(순서정보, DB 검색 쿼리에서 검색 페이지 구간 선별용) */
	private int rowEnd;

	/** 첫 번째 페이지 번호 */
	private int pageFirst;

	/** 페이징에서 첫 번째 페이지 번호 */
	private int pageStart;

	/** 이전 페이지 번호 */
	private int pagePrevious;

	/** 다음 페이지 번호 */
	private int pageNext;

	/** 페이징에서 마지막 페이지 번호 */
	private int pageEnd;

	/** 마지막 페이지 번호 */
	private int pageLast;


	/**
	 *
	 */
	public Paging() {
		this(10, 10);
	}

	/**
	 *
	 * @param rowCount
	 * @param colCount
	 */
	public Paging(int rowCount, int colCount) {
		this.page = 1;
		this.total = 0;
		this.firstNumber = 0;

		this.rowCount = rowCount;
		this.colCount = colCount;
		this.rowStart = 0;

		this.pageFirst = 1;
		this.pageStart = 1;
		this.pagePrevious = 0;
		this.pageNext = 0;
		this.pageEnd = 1;
		this.pageLast = 1;

		this.init();
	}

	/**
	 * 초기화(페이징을 위한 값들을 계산하여 세팅)
	 */
	public void init() {
		rowStart = (page - 1) * rowCount + 1;
		rowEnd = rowStart + rowCount - 1;

		if (rowEnd > total) {
			rowEnd = total;
		}

		firstNumber = total - (rowCount * (page - 1));

		pageFirst = 1;
		pageLast = (int)Math.ceil((double)total / rowCount);

		if (pageLast < 1) {
			pageLast = 1;
		}

		pageStart = (int)Math.ceil((double)(page - colCount) / colCount) * colCount + 1;
		pageEnd = pageStart + colCount - 1;

		if (pageEnd > pageLast) {
			pageEnd = pageLast;
		}

		if (pageEnd < 1) {
			pageEnd = 1;
		}

		if (page > 1) {
			pagePrevious = page - 1;
		} else {
			pagePrevious = 0;
		}

		if (page < pageLast) {
			pageNext = page + 1;
		} else {
			pageNext = 0;
		}
	}

	/**
	 *
	 * @return
	 */
	public boolean isAutoInit() {
		return isAutoInit;
	}

	/**
	 *
	 * @param isAutoInit
	 */
	public void setAutoInit(boolean isAutoInit) {
		this.isAutoInit = isAutoInit;
	}

	/**
	 * page Getter
	 *
	 * @return 현재 페이지
	 */
	public int getPage() {
		return page;
	}

	/**
	 * page Setter
	 *
	 * @param page 현재 페이지
	 */
	public void setPage(int page) {
		if (page < 1) {
			page = 1;
		}

		this.page = page;

		if (isAutoInit) {
			this.init();
		}
	}

	/**
	 * total Getter
	 *
	 * @return 총 레코드 수
	 */
	public int getTotal() {
		return total;
	}

	/**
	 * total Setter
	 *
	 * @param total 총 레코드 수
	 */
	public void setTotal(int total) {
		if (total < 1) {
			total = 0;
		}

		this.total = total;

		if (isAutoInit) {
			this.init();
		}
	}

	/**
	 * firstNumber Getter
	 *
	 * @return 첫 번째 글번호(순서정보)
	 */
	public int getFirstNumber() {
		return firstNumber;
	}

	/**
	 * rowCount Getter
	 *
	 * @return 리스트(화면)당 글 수
	 */
	public int getRowCount() {
		return rowCount;
	}

	/**
	 * rowCount Setter
	 *
	 * @param rowCount 리스트(화면)당 글 수
	 */
	public void setRowCount(int rowCount) {
		if (rowCount < 1) {
			rowCount = 1;
		}

		this.rowCount = rowCount;

		if (isAutoInit) {
			this.init();
		}
	}

	/**
	 * colCount Getter
	 *
	 * @return 페이징 그룹의 표시 페이지 수
	 */
	public int getColCount() {
		return colCount;
	}

	/**
	 * colCount Setter
	 *
	 * @param colCount 페이징 그룹의 표시 페이지 수
	 */
	public void setColCount(int colCount) {
		if (colCount < 1) {
			colCount = 1;
		}

		this.colCount = colCount;

		if (isAutoInit) {
			this.init();
		}
	}

	/**
	 * rowStart Getter
	 *
	 * @return 현재 페이지 첫 번째 글번호(순서정보, DB 검색 쿼리에서 검색 페이지 구간 선별용)
	 */
	public int getRowStart() {
		return rowStart;
	}

	/**
	 * rowEnd Getter
	 *
	 * @return 현재 페이지의 마지막 글번호(순서정보, DB 검색 쿼리에서 검색 페이지 구간 선별용)
	 */
	public int getRowEnd() {
		return rowEnd;
	}

	/**
	 * pageFirst Getter
	 *
	 * @return 첫 번째 페이지 번호
	 */
	public int getPageFirst() {
		return pageFirst;
	}

	/**
	 * pageStart Getter
	 *
	 * @return 페이징에서 첫 번째 페이지 번호
	 */
	public int getPageStart() {
		return pageStart;
	}

	/**
	 * pagePrevious Getter
	 *
	 * @return 이전 페이지 번호
	 */
	public int getPagePrevious() {
		return pagePrevious;
	}

	/**
	 * pageNext Getter
	 *
	 * @return 다음 페이지 번호
	 */
	public int getPageNext() {
		return pageNext;
	}

	/**
	 * pageEnd Getter
	 *
	 * @return 페이징에서 마지막 페이지 번호
	 */
	public int getPageEnd() {
		return pageEnd;
	}

	/**
	 * pageLast Getter
	 *
	 * @return 마지막 페이지 번호
	 */
	public int getPageLast() {
		return pageLast;
	}

	/**
	 *
	 */
	@Override
	public String toString() {
		return "Paging [page=" + page + ", total=" + total + ", firstNumber="
				+ firstNumber + ", rowCount=" + rowCount + ", colCount=" + colCount
				+ ", rowStart=" + rowStart + ", rowEnd=" + rowEnd
				+ ", pageFirst=" + pageFirst + ", pageStart=" + pageStart
				+ ", pagePrevious=" + pagePrevious + ", pageNext=" + pageNext
				+ ", pageEnd=" + pageEnd + ", pageLast=" + pageLast + "]";
	}
}
