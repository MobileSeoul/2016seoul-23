package org.playthm.core.model;

import java.sql.Timestamp;

/**
 *
 *
 */
public class Menu {

	/** 메뉴 시퀀스 */
	protected int menuSq;
	/** 메뉴 타입(A:어드민 F:프론트) */
	protected String menuType;
	/** 메뉴 명 */
	protected String menuName;
	/** 메뉴 그룹 */
	protected String menuGroup;
	/** 페이지 구분(PAGE : 일반 페이지, NEW : 새창, LINK : 링크) */
	protected String pageType;
	/** 페이지 구분 옵션 */
	protected String pageTypeOption;
	/** 상위 메뉴 시퀀스 */
	protected int parentSq;
	/** 메뉴 깊이 */
	protected int depth;
	/** 같은 그룹(부모) 메뉴 중 순서 */
	protected int ordinal;
	/** 전체 메뉴 중 순서 */
	protected int ordinalAll;
	/** 메뉴 사용 유무 */
	protected String useYn;
	/** 메뉴 URI */
	protected String uri;
	/** 생성일 */
	protected Timestamp createDate;
	/** 수정일 */
	protected Timestamp modifyDate;
	/** 생성자 */
	protected int createMemberSeq;
	/** 수정자 */
	protected int modifyMemberSeq;
	/** 메뉴수 */
	protected int count;
	/** 연결 컨트롤러명 */
	protected String controller;

	/**
	 * 생성자
	 */
	public Menu() {
		this.menuSq = 0;
		this.menuType = "";
		this.menuName = "";
		this.menuGroup = "";
		this.pageType = "";
		this.pageTypeOption = "";
		this.parentSq = 0;
		this.depth = 0;
		this.ordinal = 0;
		this.ordinalAll = 0;
		this.useYn = "N";
		this.uri = "/";
		this.createMemberSeq = 0;
		this.modifyMemberSeq = 0;
		this.count = 0;
		this.controller = "";
	}

	/**
	 * menuSq Getter
	 *
	 * @return 메뉴 시퀀스
	 */
	public int getMenuSq() {
		return menuSq;
	}

	/**
	 * menuSq Setter
	 *
	 * @param menuSq 메뉴 시퀀스
	 */
	public void setMenuSq(int menuSq) {
		if (menuSq < 1) {
			menuSq = 0;
		}

		this.menuSq = menuSq;
	}

	/**
	 * menuType Getter
	 *
	 * @return 메뉴 타입(A:어드민 F:프론트)
	 */
	public String getMenuType() {
		return menuType;
	}

	/**
	 * menuType Setter
	 *
	 * @param menuType 메뉴 타입(A:어드민 F:프론트)
	 */
	public void setMenuType(String menuType) {
		if (menuType == null) {
			menuType = "";
		}

		this.menuType = menuType;
	}

	/**
	 * menuName Getter
	 *
	 * @return 메뉴 명
	 */
	public String getMenuName() {
		return menuName;
	}

	/**
	 * menuName Setter
	 *
	 * @param menuName 메뉴 명
	 */
	public void setMenuName(String menuName) {
		if (menuName == null) {
			menuName = "";
		}

		this.menuName = menuName;
	}

	/**
	 * menuGroup Getter
	 *
	 * @return 메뉴 그룹
	 */
	public String getMenuGroup() {
		return menuGroup;
	}

	/**
	 * menuGroup Setter
	 *
	 * @param menuGroup 메뉴 그룹
	 */
	public void setMenuGroup(String menuGroup) {
		if (menuGroup == null) {
			menuGroup = "";
		}

		this.menuGroup = menuGroup;
	}

	/**
	 * pageType Getter
	 *
	 * @return 페이지 구분(PAGE : 일반 페이지, NEW : 새창, LINK : 링크)
	 */
	public String getPageType() {
		return pageType;
	}

	/**
	 * pageType Setter
	 *
	 * @param pageType 페이지 구분(PAGE : 일반 페이지, NEW : 새창, LINK : 링크)
	 */
	public void setPageType(String pageType) {
		if (pageType == null) {
			pageType = "";
		}

		this.pageType = pageType;
	}

	/**
	 * pageTypeOption Getter
	 *
	 * @return 페이지 구분 옵션
	 */
	public String getPageTypeOption() {
		return pageTypeOption;
	}

	/**
	 * pageTypeOption Setter
	 *
	 * @param pageTypeOption 페이지 구분 옵션
	 */
	public void setPageTypeOption(String pageTypeOption) {
		if (pageTypeOption == null) {
			pageTypeOption = "";
		}

		this.pageTypeOption = pageTypeOption;
	}

	/**
	 * parentSq Getter
	 *
	 * @return 상위 메뉴 시퀀스
	 */
	public int getParentSq() {
		return parentSq;
	}

	/**
	 * parentSq Setter
	 *
	 * @param parentSq 상위 메뉴 시퀀스
	 */
	public void setParentSq(int parentSq) {
		if (parentSq < 1) {
			parentSq = 0;
		}

		this.parentSq = parentSq;
	}

	/**
	 * depth Getter
	 *
	 * @return 메뉴 깊이
	 */
	public int getDepth() {
		return depth;
	}

	/**
	 * depth Setter
	 *
	 * @param depth 메뉴 깊이
	 */
	public void setDepth(int depth) {
		if (parentSq < 1) {
			parentSq = 0;
		}

		this.depth = depth;
	}

	/**
	 * ordinal Getter
	 *
	 * @return 같은 그룹(부모) 메뉴 중 순서
	 */
	public int getOrdinal() {
		return ordinal;
	}

	/**
	 * ordinal Setter
	 *
	 * @param ordinal 같은 그룹(부모) 메뉴 중 순서
	 */
	public void setOrdinal(int ordinal) {
		if (parentSq < 1) {
			parentSq = 0;
		}

		this.ordinal = ordinal;
	}

	/**
	 * ordinalAll Getter
	 *
	 * @return 전체 메뉴 중 순서
	 */
	public int getOrdinalAll() {
		return ordinalAll;
	}

	/**
	 * ordinalAll Setter
	 *
	 * @param ordinalAll 전체 메뉴 중 순서
	 */
	public void setOrdinalAll(int ordinalAll) {
		if (ordinalAll < 1) {
			ordinalAll = 0;
		}

		this.ordinalAll = ordinalAll;
	}

	/**
	 * useYn Getter
	 *
	 * @return 메뉴 사용 유무
	 */
	public String getUseYn() {
		return useYn;
	}

	/**
	 * useYn Setter
	 *
	 * @param useYn 메뉴 사용 유무
	 */
	public void setUseYn(String useYn) {
		if (useYn == null || !useYn.equals("Y")) {
			useYn = "N";
		}

		this.useYn = useYn;
	}

	/**
	 * uri Getter
	 *
	 * @return 메뉴 URI
	 */
	public String getUri() {
		return uri;
	}

	/**
	 * uri Setter
	 *
	 * @param uri 메뉴 URI
	 */
	public void setUri(String uri) {
		if (uri == null) {
			uri = "";
		}

		this.uri = uri;
	}

	/**
	 * createDate Getter
	 *
	 * @return 생성일
	 */
	public Timestamp getCreateDate() {
		return createDate;
	}

	/**
	 * createDate Setter
	 *
	 * @param createDate 생성일
	 */
	public void setCreateDate(Timestamp createDate) {
		this.createDate = createDate;
	}

	/**
	 * modifyDate Getter
	 *
	 * @return 수정일
	 */
	public Timestamp getModifyDate() {
		return modifyDate;
	}

	/**
	 * modifyDate Setter
	 *
	 * @param modifyDate 수정일
	 */
	public void setModifyDate(Timestamp modifyDate) {
		this.modifyDate = modifyDate;
	}

	/**
	 * createMemberSeq Getter
	 *
	 * @return 생성자
	 */
	public int getCreateMemberSeq() {
		return createMemberSeq;
	}

	/**
	 * createMemberSeq Setter
	 *
	 * @param createMemberSeq 생성자
	 */
	public void setCreateMemberSeq(int createMemberSeq) {
		if (createMemberSeq < 1) {
			createMemberSeq = 0;
		}

		this.createMemberSeq = createMemberSeq;
	}

	/**
	 * modifyMemberSeq Getter
	 *
	 * @return 수정자
	 */
	public int getModifyMemberSeq() {
		return modifyMemberSeq;
	}

	/**
	 * modifyMemberSeq Setter
	 *
	 * @param modifyMemberSeq 수정자
	 */
	public void setModifyMemberSeq(int modifyMemberSeq) {
		if (modifyMemberSeq < 1) {
			modifyMemberSeq = 0;
		}

		this.modifyMemberSeq = modifyMemberSeq;
	}

	/**
	 * count Getter
	 *
	 * @return 메뉴수
	 */
	public int getCount() {
		return count;
	}

	/**
	 * count Setter
	 *
	 * @param count 메뉴수
	 */
	public void setCount(int count) {
		if (count < 0) {
			count = 0;
		}

		this.count = count;
	}

	/**
	 * controller Getter
	 *
	 * @return 연결 컨트롤러명
	 */
	public String getController() {
		return controller;
	}

	/**
	 * controller Setter
	 *
	 * @param controller 연결 컨트롤러명
	 */
	public void setController(String controller) {
		if (controller == null) {
			controller = "";
		}

		this.controller = controller;
	}

	@Override
	public String toString() {
		return "Menu [menuSq=" + menuSq + ", menuType=" + menuType + ", menuName=" + menuName + ", menuGroup=" + menuGroup + ", pageType=" + pageType + ", pageTypeOption=" + pageTypeOption + ", parentSq=" + parentSq + ", depth=" + depth + ", ordinal=" + ordinal + ", ordinalAll=" + ordinalAll + ", useYn=" + useYn + ", uri=" + uri + ", createDate=" + createDate + ", modifyDate=" + modifyDate + ", createMemberSeq=" + createMemberSeq + ", modifyMemberSeq=" + modifyMemberSeq + ", count=" + count + ", controller=" + controller + "]";
	}
}
